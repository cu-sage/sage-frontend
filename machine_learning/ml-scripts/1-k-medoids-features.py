import os, sys
import string
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
import numpy as np
from scipy.sparse import csr_matrix
from flask import Flask, render_template, redirect, url_for,request
from flask import make_response
app = Flask(__name__)

# n-gram representation of data (frequency of all sequences of n words)
def ngram(data, n):
    vectorizer = CountVectorizer(token_pattern=u'(?u)\\b\\w+\\b',
            ngram_range=(1,n), min_df=0)
    # tokenize and count occurrences of each n-gram in each document
    ngram_ct = vectorizer.fit_transform(data) # sparse csr_matrix
    return ngram_ct

def clean_data_line(data):
    data_one_line = ''
    for line in data:
        line = string.strip(line)
        if not line[:9] == '<<Object ':
            data_one_line += line + ' '
    data_one_line = data_one_line[:-1] + '\n'
    return data_one_line

def count_files(data_dir):
    ct = 0
    for d in os.listdir(data_dir):
        if d == '.DS_Store':
            continue
        for f in os.listdir(os.path.join(data_dir, d)):
            ct += 1
    return ct

def write_output(data, name, labels=None):
    # write headers for all features (columns)
    header_row = []
    for i in range(data.shape[1]):
        header_row.append(str(i))
    if labels is not None:
        header_row.append('filename')
    header_row = tuple(header_row)
    header_row = np.array([header_row])

    # convert sparse matrix to dense matrix
    dense = data.toarray()

    # add labeling code to files
    arr_type = []
    for i in range(dense.shape[1]):
        fieldname = str(i)
        arr_type.append((fieldname, 'i4'))
    arr_type.append(('foo', 'S10'))

    reformatted_arr = []
    if labels is not None:
        for line, l in zip(dense, labels):
            line = np.hstack([line, l])
            tup = tuple(line)
            reformatted_arr.append(tup)

        data = np.array(reformatted_arr, dtype=arr_type)
        data = np.vstack([header_row, reformatted_arr])

        np.savetxt('machine_learning/ml-output/output-k-medioids-features-with-labels-' + name + '.csv', data, fmt='%s', delimiter=',')
    else:
        data = np.vstack([header_row, dense])
        np.savetxt('machine_learning/ml-output/output-k-medioids-features-' + name + '.csv', data, fmt='%s', delimiter=',')
        

def main():
    if len(sys.argv) != 2:
        usage = 'Usage: python 1-k-medoids-features.py '
        usage += '</path/to/dir/containing/student/dirs/with/se/files/to/cluster>'
        raise IndexError(usage)
        sys.exit(1)

    # NOTE: data_dir must contain one directory for each student
    # containing their individual project files
    data_dir = sys.argv[1]
    all_data = []
    count = 0
    labels_size = count_files(data_dir)
    labels = np.ndarray((labels_size, 1))
    labels = labels.astype(np.str_)

    for d in os.listdir(data_dir):
        if d == '.DS_Store':
            continue
        for f in os.listdir(os.path.join(data_dir, d)):
            if f == '.DS_Store':
                continue
            labels[count][0] = d + '/' + f[:-3]
            count += 1
            data = open(os.path.join(data_dir, d, f), 'r')
            data_one_line = clean_data_line(data)
            all_data.append(data_one_line)

    # BIGRAM
    #data_rep = ngram(all_data, 2)
    # TRIGRAM
    data_rep = ngram(all_data, 3)
    write_output(data_rep, 'trigram', labels)


if __name__ == '__main__':
    main()
