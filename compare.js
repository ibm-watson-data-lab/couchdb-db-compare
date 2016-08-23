'use strict';

const accounting = require('accounting');
const od = require('obj_diff');

//
// process command line parameters:
// compare.js <db1_file_dump> <db2_file_dump>
//

const db1_file_dump = process.argv[2];
const db2_file_dump = process.argv[3];

// verify command line parameters were provided
if((!db1_file_dump) || (!db2_file_dump)) {
	console.error('Invalid invocation. node compare.js <db1_file_dump> <db2_file_dump>');
	process.exit(1);
}

// try to load the database files
var file1 = null;
var file2 = null;

console.log('Loading ...');

try {
	console.time('Loaded data file 1');
	file1 = require(db1_file_dump);	
	console.timeEnd('Loaded data file 1');
}
catch(err) {
	console.error(db1_file_dump + ' cannot be loaded: ' + err);
}

try {
	console.time('Loaded data file 2');
	file2 = require(db2_file_dump);
	console.timeEnd('Loaded data file 2');
}
catch(err) {
	console.error(db2_file_dump + ' cannot be loaded: ' + err);	
}

if((! file1) || (! file2)) {
	process.exit(1);
}

// prepare internal data structure

var db1_docs = {};
var db2_docs = {};

var id = null;

file1.rows.forEach(function(row) {
	id = row.doc._id;
 	db1_docs[id] = row.doc;
});

file2.rows.forEach(function(row) {
	id = row.doc._id;
 	db2_docs[id] = row.doc;
});

var stats = {
				only_in_one : 0,
				only_in_two : 0,
				identical: 0,
				identical_different_rev: 0,
				different: 0
			};

var diff = null;

//
// compare
//
console.time('Compared data file 1 with data file 2');

Object.keys(db1_docs).forEach(function(doc_id) {
	if(db2_docs[doc_id]) {
		diff = od(db1_docs[doc_id], db2_docs[doc_id]);
		if(diff.atmost()) {
			stats.identical++;
		}
		else {
			if(diff.atmost('_rev', od.ANY, od.ANY)) {
				stats.identical_different_rev++;
			}
			else {
				console.error('[--------- Difference for _id: ' + doc_id + ' ---------]');
				console.error(diff);
				stats.different++;
			}
		}

		delete db2_docs[doc_id];
	}
	else {
		console.error('[--------- Document missing in file 2 ---------]');
		console.error(JSON.stringify(db1_docs[doc_id]));
		stats.only_in_one++;	
	}
});

Object.keys(db2_docs).forEach(function(doc_id) {
	console.error('[--------- Document missing in file 1 ---------]');
	console.error(JSON.stringify(db2_docs[doc_id]));
	stats.only_in_two++;	

});

console.log();
console.timeEnd('Compared data file 1 with data file 2');
console.log();
console.log('[############# Summary ############]');
console.log('Identical                 : ' + accounting.formatNumber(stats.identical));
console.log('Identical (different _rev): ' + accounting.formatNumber(stats.identical_different_rev));
console.log('Different                 : ' + accounting.formatNumber(stats.different));
console.log('Only in 1                 : ' + accounting.formatNumber(stats.only_in_one));
console.log('Only in 2                 : ' + accounting.formatNumber(stats.only_in_two));