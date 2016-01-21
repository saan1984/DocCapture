var request = require('request'),
	redis = require("redis"),
	documentsDB = redis.createClient({
		host:"pppdc9prdaak.corp.intuit.net",
		port:6379
	});

	documentsDB.on("error", function (err) {
		console.log("Error " + err);
	});

module.exports ={
	saveDocument: function(documentID, documentContent){
		documentsDB.set(documentID, documentContent);
	}
};


