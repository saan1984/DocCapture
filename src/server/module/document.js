var request = require('request'),
	redis = require("redis"),
	documentsDB = redis.createClient();

	documentsDB.on("error", function (err) {
		console.log("Error " + err);
	});

module.exports ={
	saveDocument: function(documentID,imageArray){
		documentsDB.set(documentID, imageArray);
	}
};


