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


  it('should add a SINGLE talk on /talks/<title> POST', function(done) {
    chai.request(server)
      .put('/talks/testpost')
      .send({'presenter': 'Testy', 'summary': 'testScript', 'comments': '[]'})
      .end(function(err, res){
        res.should.have.status(202);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('SUCCESS');
        res.body.SUCCESS.should.be.a('object');
        res.body.SUCCESS.should.have.property('presenter');
        res.body.SUCCESS.should.have.property('summary');
        res.body.SUCCESS.should.have.property('comments');
        res.body.SUCCESS.presenter.should.equal('Testy');
        res.body.SUCCESS.summary.should.equal('testScript');
        done();
      });
  });


  it('should update a SINGLE talk on /talk/<title> PUT');
  it('should delete a SINGLE talk on /talk/<title> DELETE');
  it('should add a SINGLE comment to a specific talk on /talks/<title>/comments POST');
});