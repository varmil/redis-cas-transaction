var app = require('express')();
var	client = require('redis').createClient();
var sleep = require('sleep');

var	initialValue = 0;
var REDIS_KEY = 'requests';

var tryUpdate = function(cb) {
	client.watch(REDIS_KEY);

	var sleepMilliseconds = Math.random() * 10 | 0;
	sleep.usleep(sleepMilliseconds);

	client.get(REDIS_KEY, function(err, result) {
		if (err) return cb(err);

		console.log('[SLEEP]::', sleepMilliseconds, '[CURRENT VALUE]::', result, '  [PID]::', process.pid);

		var nextValue = (result * 1) + 1;
		var multi = client.multi();
		multi.set(REDIS_KEY, nextValue);
		multi.exec(function(err, replies) {
			if (err) return cb(err);
			cb(null, replies);
		});
	});
};

// redisを初期化
client.set(REDIS_KEY, initialValue, function(err) {
	if (err) console.error('Fail to initialize');
	console.log('READY');
});

app.get('/', function(req, res) {
	tryUpdate(function(err, result) {
		if (err) {
			console.error(err);
			res.end(err + '\n');
		} else {
			res.end(result + '\n');
		}
	});
});

app.listen(6666, function() {
	console.log('Running at PORT 6666');
});
