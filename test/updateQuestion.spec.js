var app = require('./../app');
var request = require('supertest').agent(app.listen());

var db = require('./../lib/db');
var co = require('co');
var should = require('should');
var testHelpers = require('./testHelpers');

describe("Updating questions", function () {
    beforeEach(function (done) {
        testHelpers.removeAllDocs();
        done();
    });

    afterEach(function (done) {
        testHelpers.removeAllDocs();
        done();
    });

    it("shows a nice page for existing questions", function (done) {
        co(function *() {
            var q = yield db.questions.insert({
                title: "A question?",
                tags: ["tag1", "tag2"]
            });

            request
                .get('/question/' + q._id)
                .expect("Content-Type", /html/)
                .expect(function (res) {
                    res.text.should.containEql(q.title);
                    res.text.should.containEql("tag1", "tag2");
                })
                .expect(200, done);
        }).catch(function(err){
            console.error(err.stack);
        });
    });

    it("updated an existing question", function (done) {
        co(function *() {
            var q = yield db.questions.insert({
                title: "A question?",
                tags: ["tag1", "tag2"]
            });

            request
                .post('/question/' + q._id)
                .send({
                    questionTitle: "An updated question",
                    tagString: "tag3, tag4"
                })
                .expect("location", "/question/" + q._id)
                .expect(302, done);
        }).catch(function(err){
            console.error(err.stack);
        });
    });
});
