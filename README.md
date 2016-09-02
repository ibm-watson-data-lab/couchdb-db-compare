# couchdb-db-compare

Simple utility script that compares the content of two unloaded couchdb databases using [obj_diff](https://github.com/iriscouch/obj_diff).

### Getting started

To compare the content ...

#### Download and install the utility

```
$ git clone https://github.com/ibm-cds-labs/couchdb-db-compare.git
$ cd couchdb-db-compare
$ npm install
```

#### Unload database 1

```
$ curl -X GET "https://$USERNAME:$PASSWORD@$REMOTE_USERNAME.cloudant.com/$DATABASE_NAME_1/_all_docs?include_docs=true&attachments=true" -o db1.json
```

#### Unload database 2

```
$ curl -X GET "https://$USERNAME:$PASSWORD@$REMOTE_USERNAME.cloudant.com/$DATABASE_NAME_2/_all_docs?include_docs=true&attachments=true" -o db2.json
```

#### Compare documents

```
$ node compare.js ./db1.json ./db2.json 2> db1_db2_diff.log
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
...

```

### License 

Copyright 2016 IBM Cloud Data Services

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
