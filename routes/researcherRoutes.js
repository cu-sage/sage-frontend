var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var fs = require('fs');

var clusteringOn;

// (7) run RapidMiner GSP process to get sequential pattern rules
var gspRM = function(error, stdout, stderr, input_dirs) {
    if (!clusteringOn) return;
    if (error) {
        console.error(`exec error running transform-kmeans-output-for-gsp.py: ${error}`);
        return;
    }

    var rm_script = input_dirs[2];
    var rm_repo_dir = input_dirs[3];

    try {
        var cmd = rm_script + ' ' + rm_repo_dir + '/sequential-pattern-mining\"';
        console.log('$ ' + cmd);

        var stdout = exec(cmd, (error, stdout, stderr) => { 
            stderr_lastline = stderr.split('\n').slice(-2)[0] 
            if (stderr_lastline != 'INFO: Process finished successfully') {
                console.log(stderr);
            };
            if (error) {
                console.error(`exec error running sequential-pattern-mining.rmp: ${error}`);
                return;
            }
            // wait for a fixed interval of 15 minutes,
            //  then run clustering again
            setTimeout(kMedClusterFeatures, 900000);
        });
    } catch (error) {
        console.log(error);
    }
    return; 
};

// (6) extract features for GSP (sequential pattern mining) from k-means output
var gspFeatures = function(error, stdout, stderr, input_dirs) {
    if (!clusteringOn) return;
    if (error) {
        console.error(`exec error running progression-kmeans-clustering.rmp: ${error}`);
        return;
    }

    var data_dir = input_dirs[0];
    var rel_ml_dir = input_dirs[1];
    var kmeans_output = 'machine_learning/RapidMiner-output/kmeans-progresssions-2clusters.csv';

    try {
        var cmd = 'python ' + rel_ml_dir + '/transform-kmeans-output-for-gsp.py ' + kmeans_output + ' ' + data_dir + ' 2';
        console.log('$ ' + cmd);

        var stdout = exec(cmd, (error, stdout, stderr) => {
            gspRM(error, stdout, stderr, input_dirs);
        });
    } catch (error) {
        console.log(error);
    }
    return;
};

// (5) run RapidMiner k-means clustering process to get clustered paths
// through milestones
var kMeansClusterRM = function(error, stdout, stderr, input_dirs) {
    if (!clusteringOn) return;
    if (error) {
        console.error(`exec error running 2-k-means-features.py: ${error}`);
        return;
    }

    var rm_script = input_dirs[2];
    var rm_repo_dir = input_dirs[3];

    try {
        var cmd = rm_script + ' ' + rm_repo_dir + '/progression-kmeans-clustering\"';
        console.log('$ ' + cmd);

        var stdout = exec(cmd, (error, stdout, stderr) => { 
            stderr_lastline = stderr.split('\n').slice(-2)[0] 
            if (stderr_lastline != 'INFO: Process finished successfully') {
                console.log(stderr);
            };
             gspFeatures(error, stdout, stderr, input_dirs);
        });
    } catch (error) {
        console.log(error);
    }
    return;
};

// (4) extract k-means features from raw snapshots
var kMeansClusterFeatures = function(error, stdout, stderr, input_dirs) {
    if (!clusteringOn) return;
    if (error) {
        console.error(`exec error running 1-get-snapshot-centroid.py: ${error}`);
        return;
    }

    var centroid_dir = input_dirs[0];
    var rel_ml_dir = input_dirs[1];
    var centroid_output = 'machine_learning/ml-output/centroid-output.txt';

    try {
        var cmd = 'python ' + rel_ml_dir + '/2-k-means-features.py ' + centroid_dir + ' ' + centroid_output + ' 10';
        console.log('$ ' + cmd);

        var stdout = exec(cmd, (error, stdout, stderr) => {
            kMeansClusterRM(error, stdout, stderr, input_dirs);
        });

    } catch (error) {
        console.log(error);
    }
    return;
};

// (3) get discrete snapshots representing each "milestone" resulting from k-medioids clustering
var kMedCentroids = function(error, stdout, stderr, input_dirs) {
    if (!clusteringOn) return;
    if (error) {
        console.error(`exec error running milestones-clustering.rmp: ${error}`);
        return;
    }

    var data_dir = input_dirs[0];
    var rel_ml_dir = input_dirs[1];

    try {
        var cmd = 'python ' + rel_ml_dir + '/1-get-snapshot-centroid.py ' + data_dir + ' machine_learning/RapidMiner-output/clustered-set-cosine-4clusters.csv machine_learning/RapidMiner-output/centroids-cosine-4clusters.csv';
        console.log('$ ' + cmd);

        var stdout = exec(cmd, (error, stdout, stderr) => {
            // get k-means features
            kMeansClusterFeatures(error, stdout, stderr, input_dirs);
        });
    } catch (error) {
        console.log(error);
    }
    return;
};

// (2) run RapidMiner k-medioid clustering process to get project "milestones"
var kMedClusterRM = function(error, stdout, stderr, input_dirs) {
    if (!clusteringOn) return;
    if (error) {
        console.error(`exec error running 1-k-medioids-features.py: ${error}`);
        return;
    }

    var rm_script = input_dirs[2];
    var rm_repo_dir = input_dirs[3];

    try {
        var cmd = rm_script + ' ' + rm_repo_dir + '/milestones-clustering\"';
        console.log('$ ' + cmd);

        var stdout = exec(cmd, (error, stdout, stderr) => { 
            stderr_lastline = stderr.split('\n').slice(-2)[0] 
            if (stderr_lastline != 'INFO: Process finished successfully') {
                console.log(stderr);
            };
            // get cluster centroids
            kMedCentroids(error, stdout, stderr, input_dirs);
        });
    } catch (error) {
        console.log(error);
    }
    return;
};

// (1) extract k-medioids features from raw snapshots
var kMedClusterFeatures = function() {
    if (!clusteringOn) return;
    try {
        // enter relevant file/directory pathnames 
        // dir containing all .se snapshot files to cluster 
        var data_dir = '/Users/AliSawyer/Documents/SeniorSpring/SAGE-project/sage-frontend/machine_learning/sample_data';
        // dir containing machine learning scripts, relative to current dir
        var rel_ml_dir = 'machine_learning/ml-scripts';
        var rm_script = "\"/Applications/RapidMiner Studio.app/Contents/Resources/RapidMiner-Studio/scripts/rapidminer-batch.sh\"";
        var rm_repo_dir = "\"//Local\\ Repository/processes";

        input_dirs = [data_dir, rel_ml_dir, rm_script, rm_repo_dir];

        var cmd = 'python ' + rel_ml_dir + '/1-k-medioids-features.py ' + data_dir;
        //var args = [rel_ml_dir + '/1-k-medioids-features.py', data_dir];
        console.log('$ ' + cmd);

        var stdout = exec(cmd, (error, stdout, stderr) => { 
            // run RapidMiner k-medioids clustering process
            kMedClusterRM(error, stdout, stderr, input_dirs);
        });
    } catch (error) {
        console.log(error);
    }
    return; 
};

router.post('/cluster', function(req, res) {
    console.log('Starting clustering...');
    clusteringOn = true;

    kMedClusterFeatures(req, res, function(err)  {
        if(err){
            res.json({error_code:1, err_desc:err});
            return;
        }
        res.json({error_code:0, err_desc:null});
    });
    res.send('200');
});

router.post('/stop', function(req, res) {
    console.log('Stopping clustering...');
    clusteringOn = false;
    res.send('200');
});

//router.get('/machine_learning/RapidMiner-output/gsp-rules-cluster0.res', function(req, res) {
router.get('/gsprules', function(req, res) {
    fs.readFile('machine_learning/RapidMiner-output/gsp-rules-cluster0.res', (err, data) => {
        if (err) throw err;
        res.send(data);
        return data;
    });
});

module.exports = router;
