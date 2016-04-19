var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../skillsharing_server.js');
var should = chai.should();

chai.use(chaiHttp);

describe('Skill Sharing talks', function() {
  it('should list ALL talks on /talks GET', function(done) {
  	chai.request(server)
  		.get('/talks')
  		.end(function(err, res) {
  			res.should.have.status(200);
  			done();
  		});
  });
  
  it('should list a SINGLE talk on /talk/<title> GET');
  it('should add a SINGLE talk on /talks/<title> POST');
  it('should update a SINGLE talk on /talk/<title> PUT');
  it('should delete a SINGLE talk on /talk/<title> DELETE');
  it('should add a SINGLE comment to a specific talk on /talks/<title>/comments POST');
});