var express = require('express'),
	path = require('path'),
	app = express(),
    router = require('./router');


//Resolves memory leak detection error
process.setMaxListeners(0);
//Set the view location directory, which will be shared to client browser
app.use(express.static(path.join(__dirname,'../client')));
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded())
app.use(bodyParser.json());
app.use('/',router);

//Creates an express server
var server = app.listen(9000,function () {
		var os = require('os'),
			host = os.hostname(),
			port = server.address().port;
	console.log('> Track1 app listening at http://%s:%s' + host + port);
});