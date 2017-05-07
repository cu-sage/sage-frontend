import os, sys
import string
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
import numpy as np
from scipy.sparse import csr_matrix
import pandas as pd


def get_centroids(remove_cluster_names, trigram_data):
    centroid_snapshots = [] # RESULT: list of best snapshots to represent centroids

    for cluster,centroid_row in remove_cluster_names.iterrows():
        min_diff = 100000000
        centroid_snapshot = None
        for trigram_idx,trigram_row in trigram_data.iterrows():
            cluster_name = 'cluster_' + str(cluster)
            if (cluster_name == trigram_row['cluster']): # check if cluster in question
                trigram_no_filename = trigram_row.drop(labels=['filename','id','cluster'])
                diff = centroid_row.subtract(trigram_no_filename)
                abs_val = diff.abs()
                sum = abs_val.sum()
                if sum < min_diff: 
                    min_diff = sum
                    centroid_snapshot = trigram_row[-3] + '.se'
        centroid_snapshots.append(centroid_snapshot)

    write_output(centroid_snapshots)
    return centroid_snapshots

def write_output(centroids):
    output_file = '/Users/AliSawyer/Documents/SeniorSpring/SAGE-project/sage-frontend/machine_learning/ml-output/centroid-output.txt'
    output = open(output_file, 'w') 
    to_write = ''
    for c in centroids:
        to_write += c
        to_write += ','
    to_write = to_write[:-1]
    output.write(to_write)


def main():
    if len(sys.argv) != 4:
        usage = 'Usage: python 1-get-snapshot-centroid.py </path/to/dir/containing/se/files/to/cluster> <rel/path/to/rapidminer/output/file/with/features> <rel/path/to/rapidminer/output/file/with/centroids>'
        raise IndexError(usage)
        sys.exit(1)

    # input data files/dirs
    data_dir = sys.argv[1]
    # next 2 are both RapidMiner output files
    trigram_file = sys.argv[2]
    rm_file = sys.argv[3]

    # read in input
    rm_output = pd.read_csv(rm_file)
    trigram_data = pd.read_csv(trigram_file)

    num_clusters = rm_output.shape[0]
    centroid_last_col = rm_output.shape[1]
    trigram_last_col = trigram_data.shape[1]

    remove_cluster_names = rm_output.drop(labels='cluster', axis=1)

    centroid_snapshots = get_centroids(remove_cluster_names, trigram_data)


if __name__ == '__main__':
    main()
