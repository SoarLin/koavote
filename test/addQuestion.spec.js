var app = require('./../app');
var request = require('supertest').agent(app.listen());
var testHelpers = require('./testHelpers');

describe("Adding questions", function () {
    beforeEach(function (done) {
        testHelpers.removeAllDocs();
        done();
    });

    afterEach(function (done) {
        testHelpers.removeAllDocs();
        done();
    });

    var a_question_form = {
        questionTitle: "A question?",
        tagString: "tag1, tag2, tag3"
    }

    it("has nice page too add questions", function (done) {
        request
            .get("/question")
            .expect(200)
            .expect("Content-Type", /html/)
            .end(done);
    });

    it("stores correct formatted forms as new question", function (done) {
        request
            .post("/question")
            .send(a_question_form)
            .expect(302)
            .expect("location", /^\/question\/[0-9a-fA-F]{24}$/) // /question/:id
            .end(done);
    });
});