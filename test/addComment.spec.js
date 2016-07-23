var app = require('./../app');
var request = require('supertest').agent(app.listen());

var db = require('./../lib/db');
var co = require('co');
var should = require('should');
var testHelpers = require('./testHelpers');

describe("Adding comment", function () {
    beforeEach(function (done) {
        a_test_vote = {
            tags: ["tag1", "tag2", "tag3"],
            voteValue: 3,
            questionId: 0
        };
        done();
    });

    afterEach(function (done) {
        testHelpers.removeAllDocs();
        done();
    });

    it('has a page to add comment', function (done) {
        co(function *(){
            var vote = yield db.votes.insert(a_test_vote);

            request
                .get('/vote/' + vote._id + '/comment')
                .expect("Content-Type", /html/)
                .expect(function (res) {
                    res.text.should.containEql(vote.voteValue);
                })
                .expect(200, done);
        }).catch(function(err){
            console.error(err.stack);
        });
    });

    it('adds a comment to existing vote', function (done) {
        co(function *(){
            var vote = yield db.votes.insert(a_test_vote);

            request
                .post('/vote/' + vote._id + '/comment')
                .send({comment: 'A nice litten comment'})
                .expect(302)
                .expect('location', '/vote?questionId=' + vote.questionId)
                .end(done);
        }).catch(function(err){
            console.error(err.stack);
        });
    });
});