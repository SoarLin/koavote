var app = require('./../app');
var request = require('supertest').agent(app.listen());

var db = require('./../lib/db');
var co = require('co');
var should = require('should');
var testHelpers = require('./testHelpers');

describe("Showing results", function () {
    // beforeEach(function (done) {
    //     testHelpers.removeAllDocs();
    //     done();
    // });

    // afterEach(function (done) {
    //     testHelpers.removeAllDocs();
    //     done();
    // });

    var filterPostData = {
        questionTitle: '',
        tagString: '',
        from: '',
        to: ''
    };


    it("has a page to filter results from", function (done) {
        co(function *(){
            yield [
                db.questions.insert({title: "Question 1?"}),
                db.questions.insert({title: "Question 2?"}),
                db.questions.insert({title: "Question 3?"})
            ];

            request
                .get('/results')
                .expect(function (res){
                    res.text.should.containEql("Question 1?");
                    res.text.should.containEql("Question 2?");
                    res.text.should.containEql("Question 3?");
                })
                .expect(200, done);
        }).catch(function(err){
            console.error(err.stack);
        })
    });

    it("return a excel file", function (done){
        request
            .post('/results')
            .send(filterPostData)
            .expect("content-type", "application/vnd.ms-excel")
            .expect("content-disposition", "attachment;filename=result.xls")
            .expect(200, done);
    });

    it("filters the result by question", function (done){
        co(function *(){
            yield [
                db.votes.insert({value: 1, tags: ["tag 1"], questionTitle: 'Question 1?'}),
                db.votes.insert({value: 2, tags: ["tag 2"], questionTitle: 'Question 2?'}),
                db.votes.insert({value: 3, tags: ["tag 2", "tag 1"], questionTitle: 'Question 3?'})
            ];

            filterPostData.questionTitle = 'Question 1?';

            request
                .post('/results')
                .send(filterPostData)
                .expect(function (res){
                    res.text.should.containEql('<td>1</td>');
                    res.text.should.not.containEql('<td>2</td>');
                    res.text.should.not.containEql('<td>3</td>');
                })
                .expect(200, done);
        }).catch(function(err){
            console.error(err.stack);
        });
    });

    it("filters the result by from and to date", function (done){
        co(function *(){
            yield [
                db.votes.insert({value: 1, tags: ["tag 1"], created_at: new Date(), questionTitle: 'Question 1?'}),
                db.votes.insert({value: 2, tags: ["tag 2"], created_at: new Date(), questionTitle: 'Question 1?'}),
                db.votes.insert({value: 3, tags: ["tag 2", "tag 1"], created_at: new Date(), questionTitle: 'Question 1?'})
            ];

            filterPostData.from = '01/07/2010';
            filterPostData.to   = '30/06/2018';

            request
                .post('/results')
                .send(filterPostData)
                .expect(function (res){
                    // console.log(res.text);
                    res.text.should.containEql('<td>1</td>');
                    res.text.should.containEql('<td>2</td>');
                    res.text.should.containEql('<td>3</td>');
                    res.text.should.not.containEql('<td>4</td>');
                    res.text.should.not.containEql('<td>Q2</td>');
                })
                .expect(200, done);
        }).catch(function(err){
            console.error(err.stack);
        });
    });

    it("filters the result by tag", function (done){
        co(function *(){
            yield [
                db.votes.insert({value: 1, tags: ["tag 1"], questionTitle: 'Question 1?'}),
                db.votes.insert({value: 2, tags: ["tag 2"], questionTitle: 'Question 1?'}),
                db.votes.insert({value: 3, tags: ["tag 2", "tag 1"], questionTitle: 'Question 1?'}),
                db.votes.insert({value: 4, tags: ["tag 3", "tag 4"], questionTitle: 'Question 1?'})
            ];

            filterPostData.tagString = 'tag 1';

            request
                .post('/results')
                .send(filterPostData)
                .expect(function (res){
                    res.text.should.containEql('<td>1</td>');
                    res.text.should.containEql('<td>3</td>');
                    res.text.should.not.containEql('<td>2</td>');
                    res.text.should.not.containEql('<td>Q2</td>');
                })
                .expect(200, done);
        }).catch(function(err){
            console.error(err.stack);
        });
    });

    it("filters the results by several tags", function (done){
        co(function *(){
            yield [
                db.votes.insert({value: 1, tags: ["tag 1"], questionTitle: 'Question 1?'}),
                db.votes.insert({value: 2, tags: ["tag 2"], questionTitle: 'Question 2?'}),
                db.votes.insert({value: 3, tags: ["tag 2", "tag 1"], questionTitle: 'Question 3?'}),
                db.votes.insert({value: 4, tags: ["tag 3", "tag 4"], questionTitle: 'Question 4?'}),
            ];

            filterPostData.tagString = 'tag 1, tag 2';

            request
                .post('/results')
                .send(filterPostData)
                .expect(function (res){
                    // console.log(res.text)
                    res.text.should.containEql('<td>1</td>');
                    res.text.should.containEql('<td>2</td>');
                    res.text.should.containEql('<td>3</td>');
                    res.text.should.not.containEql('<td>4</td>');
                    res.text.should.not.containEql('<td>Q2</td>');
                })
                .expect(200, done);
        }).catch(function(err){
            console.error(err.stack);
        });
    });

});