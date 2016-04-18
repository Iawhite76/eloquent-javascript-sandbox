const Helpers = {
	respond(response, status, data, type) {
	  response.writeHead(status, {
	    "Content-Type": type || "text/plain"
	  });
	  response.end(data);
	},

	respondJSON(response, status, data) {
	  Helpers.respond(response, status, JSON.stringify(data),
	          "application/json");
	},

	readStreamAsJSON(stream, callback) {
	  var data = "";
	  stream.on("data", function(chunk) {
	    data += chunk;
	  });
	  stream.on("end", function() {
	    var result, error;
	    try { result = JSON.parse(data); }
	    catch (e) { error = e; }
	    callback(error, result);
	  });
	  stream.on("error", function(error) {
	    callback(error);
	  });
	},


	sendTalks(talks, response) {
	  this.respondJSON(response, 200, {
	    serverTime: Date.now(),
	    talks: talks
	  });
	}
}

module.exports = Helpers;