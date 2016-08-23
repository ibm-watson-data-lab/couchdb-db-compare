# couchdb-db-compare

Simple utility script that compares two unloaded couchdb databases using [obj_diff](https://github.com/iriscouch/obj_diff).

##### Unload database 1

```
$ curl -X GET "https://$USERNAME:$PASSWORD@$REMOTE_USERNAME.cloudant.com/$DATABASE_NAME_1/_all_docs?include_docs=true&attachments=true" -o db1.json
```

##### Unload database 2

```
$ curl -X GET "https://$USERNAME:$PASSWORD@$REMOTE_USERNAME.cloudant.com/$DATABASE_NAME_2/_all_docs?include_docs=true&attachments=true" -o db2.json
```

##### Compare documents

```
$ node compare db1.json db2.json 2> db1_db2_diff.log
Loading ...
Loaded data file 1: 2838ms
Loaded data file 2: 3501ms

Compared data file 1 with data file 2: 24309ms

[############# Summary ############]
Identical                 : 279,756
Identical (different _rev): 4,717
Different                 : 1
Only in 1                 : 1
Only in 2                 : 2
```

> Differences are written to STDERR.

```
[--------- Difference for _id: 000025cc528bc923de7f40c6bcdfe4c9 ---------]
Diff {
  application_name: 
   { from: 'something',
     to: 'something-else' } }
[--------- Document missing in file 2 ---------]
{"_id":"ffff7848f1916d80461345900f395304","_rev":"1-83950fa0d4ef8a8d8f70a36fb05b5594", ...}
[--------- Document missing in file 1 ---------]
{"_id":"0004aa2a30bff343df87515b098ead84","_rev":"1-2ad972fabaf2dc1c4c471d0be2affeca", ...}


```