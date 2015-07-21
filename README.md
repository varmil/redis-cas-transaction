# [Experimental] Redis CAS Behavior

### Install
```
npm i
```

### Usage
```
Server:
node cluster.js

Client:
ab -n 1000 -c 50 localhost:6666/

Monitor:
redis-cli monitor
```

### Requirement
* nodejs
* redis