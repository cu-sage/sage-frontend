import os, sys
import string
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
import numpy as np
from scipy.sparse import csr_matrix
import subprocess


# remove sprite declarations in snapshot file and rewrite to same filename
def remove_sprites(filename):
    data = open(filename, 'r')
    result = ''
    for line in data:
        stripped_line = string.strip(line)
        if not stripped_line[:9] == '<<Object ':
            result += line
    output = open(filename, 'w')
    output.write(result)

# find student with minimum number of snapshots
def min_snapshots(data_dir):
    min_len = 1000000000000
    for d in os.listdir(data_dir):
        if d == '.DS_Store':
            continue
        curr_len = len(os.listdir(os.path.join(data_dir, d))) 
        if curr_len < min_len:
            min_len = curr_len
    return min_len

# exit if there exist any students with an insufficient # of snapshots
def check_num_snapshots(min_len, num_snapshots):
    if min_len < num_snapshots:
        err = 'At least one student does not have enough project snapshots. Please check and try again.'
        raise Exception(err)
        sys.exit(1)

def check_dissim_script(dissim_script):
    if not os.path.isfile(dissim_script):
        err = 'Error: Needleman-Wunsch script not found.'
        raise Exception(err)
        sys.exit(1)

# get feature representation for k-means clustering
def get_features(data_dir, interval, num_snapshots, labels, centroids):
    feature_matrix = []
    student_ct = 0

    dissim_script = 'machine_learning/ml-scripts/needle'
    # check that script exists
    check_dissim_script(dissim_script)

    for student in os.listdir(data_dir):
        if student == '.DS_Store':
            continue
        curr_idx = interval / 2
        student_files = os.listdir(os.path.join(data_dir, student))

        # label for this row
        labels[student_ct][0] = student
        print labels[student_ct][0]

        feat_matrix_row = []

        # iterate through snapshots to compare
        for i in range(num_snapshots):

            # iterate through centroids to compare the snapshots to 
            for j in range(len(centroids)):
                file1 = os.path.join(data_dir, student, student_files[curr_idx])
                file2 = os.path.join(data_dir, centroids[j])
                remove_sprites(file1), remove_sprites(file2)

                # run Needleman-Wunsch script
                score = subprocess.check_output(['python', dissim_script, file1, file2])
                score = int(score)
                # enter feature into matrix to be outputted
                feat_matrix_row.append(score)
            curr_idx += interval

        student_ct += 1
        print "STUDENT", student_ct
        feature_matrix.append(feat_matrix_row)
        print feature_matrix[-1]

    feature_matrix = np.array(feature_matrix)
    return feature_matrix

def write_output(data, labels=None):
    header_row = []
    for i in range(data.shape[1]):
        header_row.append(i)
    if labels is not None:
        header_row.append('student')
    header_row = np.asarray(header_row)
    header_row = header_row.reshape((1, header_row.shape[0]))

    # add labeling code to files
    arr_type = []
    for i in range(data.shape[1]):
        fieldname = str(i)
        arr_type.append((fieldname, 'i4'))
    arr_type.append(('foo', 'S10'))

    reformatted_arr = []
    if labels is not None:
        for line, l in zip(data, labels):
            line = np.hstack([line, l])
            tup = tuple(line)
            reformatted_arr.append(tup)

        data = np.array(reformatted_arr, dtype=arr_type)
        data = np.vstack([header_row, reformatted_arr])
    else:
        data = np.vstack([header_row, data])

    np.savetxt('machine_learning/ml-output/output-k-means-features-with-labels.csv', data, fmt='%s', delimiter=',')


def main():
    if len(sys.argv) != 4:
        usage = 'Usage: python 2-k-means-features.py '
        usage += '</path/to/dir/containing/dirs/with/student/files/to/cluster> '
        usage += '<rel/path/to/file_with_list_of_centroids> '
        usage += '<#_student_snapshots_to_compare_each_centroid_to>'
        raise IndexError(usage)
        sys.exit(1)

    # input files/dirs

    # NOTE: data_dir must contain one directory for each student
    # containing their individual project files
    data_dir = sys.argv[1]
    # name of file with list of centroid filenames (output of 1-get-snapshot-centroid.py)
    centroid_filename = sys.argv[2]
    # number of snapshots from each student progression to compare to each centroid
    num_snapshots = int(sys.argv[3])
    centroid_file = open(centroid_filename, 'r')

    centroids = centroid_file.readline().split(',')

    min_len = min_snapshots(data_dir)
    check_num_snapshots(min_len, num_snapshots)

    # interval for iterating through each student's progression of snapshots
    interval = min_len / 10

    labels = np.ndarray((len(os.listdir(data_dir)), 1))
    labels = labels.astype(np.str_)

    feature_matrix = get_features(data_dir, interval, num_snapshots, labels, centroids)
    write_output(feature_matrix, labels)


if __name__ == '__main__':
   main()
