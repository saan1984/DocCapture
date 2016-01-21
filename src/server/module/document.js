var request = require('request'),
	TinyDB = require('tinydb'),
	documentDB = new TinyDB('./documents.db');

module.exports ={
	saveDocument: function(req,res){
		documentDB.insertItem("Sandeep", "123", function(){
			console.log(".insertItem(item, idx, callback)");
		});
	}
};


