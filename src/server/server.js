var fs = require('fs');
var hskey = fs.readFileSync(__dirname+'/hacksparrow-key.pem');
var hscert = fs.readFileSync(__dirname+'/hacksparrow-cert.pem');
var options = {
	key: hskey,
	cert: hscert
};
var https = require('https'),
	express = require('express'),
	path = require('path'),
	app = express(),
    router = require('./router');

//Resolves memory leak detection error
process.setMaxListeners(0);
//Set the view location directory, which will be shared to client browser
app.use(express.static(path.join(__dirname,'../client')));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use('/',router);

https.createServer({
	key: hskey,
	cert: hscert
}, app).listen(9000);
//Creates an express server
