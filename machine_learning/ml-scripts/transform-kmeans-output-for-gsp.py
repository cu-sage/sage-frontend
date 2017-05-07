import sys, os
import pandas as pd
import numpy as np

#operators = ['<', '>', '=', '*', '|', '-', '+', '\/', '&']

# returns Python dictionary with:
#   keys:   clusters
#   values: students who are in that cluster
def sep_students_by_cluster(data, num_clusters=3):
    clusters = {}
    students = []

    for c in range(num_clusters):
        clusters[str(c)] = []
    for i in range(len(data)):
        student = int(data['student'][i])
        c = data['cluster'][i][-1]
        clusters[str(c)].append(str(student))
        students.append(str(student))
    return clusters, students

# retrieves student solution files.
# only CORRECT, FINAL solutions should be used for Sequential Pattern Mining
# NOTE: naming convention for student solutions may change
def get_student_solutions(student_dir, students):
    solutions = [] # student solution files

    for s in students:
        if s == '.DS_Store':
            continue
        s_dir = os.path.join(student_dir, s)
        s_files = os.listdir(s_dir)
        # get most recent file
        max_file_num = 0
        solution_file = None
        for f in s_files:
            if f == '.DS_Store':
                continue
            file_num = f[4:-3]
            file_num = int(file_num)
            if file_num > max_file_num:
                max_file_num = file_num
                solution_file = os.path.join(s_dir, f)
        solutions.append(solution_file)

    return solutions

# gets vocabulary of ALL blocks used in ALL student solution files.
# also returns count of total number of lines in student solutions. 
def get_vocab(solutions):
    #global operators
    vocab = []
    num_lines = 0
    for sol in solutions:
        sol_file = open(sol, 'r')
        for line in sol_file:
            line = line.strip()
            # exlude sprite/stage/costume objects and operators
            # and only add each block to the vocabulary one time
            #if 'Object' not in line and line not in operators:
            if 'Object' not in line:
                num_lines += 1
                if line not in vocab:
                    vocab.append(line)
    return vocab, num_lines

def fill_dataframe(df, solutions, vocab, timestamp):
    row_ct = 0

    for sol in solutions:
        student_path,_ = os.path.split(sol)
        # NOTE: location of student's ID is dependent on environment
        _, student_id = os.path.split(student_path) # get student id from dir name
        sol_ct = 0 # keeps track of order of steps within a single student's solution
        sol_file = open(sol, 'r')
        for line in sol_file:
            line = line.strip()
            if line in vocab:
                df.set_value(str(row_ct),line, 1)
                df.set_value(str(row_ct),'student_id', student_id)
                df.set_value(str(row_ct),'order',timestamp + sol_ct)
                row_ct += 1
                sol_ct += 10
    return df

# For each cluster, outputs file of features for GSP sequential pattern mining
# algorithm based on all completed, correct solutions of students in that cluster.
# Solutions are represented as one block per line.
# Each block that could be used is represented by a column.
# The block on the line in question has value 1; all other features have value 0.
# Other features are student ID and "timestamp," which indicates the sequence
# of blocks.
# number of rows    = total number of lines in all student solutions
# number of columns = number of possible blocks + 2
# 1 == positive; 0 == negative
def get_features_for_cluster(cluster_name, cluster, student_dir):
    solutions = get_student_solutions(student_dir, cluster) # student solutions
    vocab, num_lines = get_vocab(solutions) # list of all blocks found in solutions

    col_names = vocab
    col_names.append('student_id')
    col_names.append('order')
    starter_matrix = np.zeros((num_lines, len(col_names)))
    starter_matrix = starter_matrix.astype(int)

    row_labels = []
    for i in range(num_lines):
        row_labels.append(str(i))
    df = pd.DataFrame(starter_matrix, index=row_labels, columns=col_names)

    timestamp = os.path.getmtime(os.path.join(student_dir, '0', 'CTG-0.se'))
    feature_matrix = fill_dataframe(df, solutions, vocab, timestamp)

    write_output(feature_matrix, cluster_name, vocab)

def write_output(data, cluster_name, vocab):
    header_row = []
    for i in range(data.shape[1]-2):
        header_row.append(vocab[i])
    header_row.append('student')
    header_row.append('timestamp')
    header_row = np.asarray(header_row)
    header_row = header_row.reshape((1, header_row.shape[0]))
    data = np.vstack([header_row, data])

    filename = os.path.join('machine_learning/ml-output', 'gsp-features-' + str(cluster_name) + '.csv')
    np.savetxt(filename, data, fmt='%s', delimiter=',')


def main():
    if len(sys.argv) != 4:
        usage = 'Usage: python transform-kmeans-output-for-gsp.py '
        usage += '<rel/path/to/kmeans/output> '
        usage += '<path/to/dir/containing/student/se/files> '
        usage += '<#_of_clusters>'
        raise IndexError(usage)
        sys.exit(1)

    # k-means clustering output
    input_file = sys.argv[1]
    student_dir = sys.argv[2]
    num_clusters = int(sys.argv[3])

    data = pd.read_csv(input_file)

    clusters, students = sep_students_by_cluster(data, num_clusters)
            
    # get GSP features for each separate cluster
    for key,val in clusters.iteritems():
        get_features_for_cluster(key, val, student_dir) 


if __name__ == '__main__':
    main()
