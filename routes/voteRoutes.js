var render = require('./../lib/render');
var parse = require('co-body');
var db = require('./../lib/db');
var utils = require('./utils');

module.exports.showAddVote = function *() {
    var questionId = this.query.questionId;

    if (!utils.exists(this.query.questionId)) {
        this.set("ErrorMessage", "No questionId passed to page");
        this.redirect('/');
        return;
    }

    var question = yield db.questions.findOne({ _id: questionId });

    if (!utils.exists(question)) {
        this.set("ErrorMessage", "No question found for id: '" + questionId +"'");
        this.redirect('/');
        return;
    }

    var vm = {
        tagString: question.tags.join(','),
        questionTitle: question.title,
        questionId: questionId
    };

    this.body = yield render('newVote', vm);
};

module.exports.addVote = function *() {
    var postedData = yield parse(this);

    // !Validate
    if (!utils.exists(postedData.questionId)) {
        this.set('ErrorMessage', 'QuestionId required');
        this.redirect('/');
        return;
    }

    // Create it
    var vote = {
        tags: utils.splitAndTrimTagString(postedData.tagString),
        created_at: new Date,
        questionId: postedData.questionId,
        questionTitle: postedData.questionTitle,
        value: postedData.voteValue
    };

    // Store it
    var v = yield db.votes.insert(vote);
    this.redirect('/vote/' + v._id + '/comment');
};

module.exports.showAddComment = function *(id) {
    var vote = yield db.votes.findOne({ _id: id });
    this.body = yield render('comment', { voteId: id });
};

module.exports.addComment = function *(id) {
    var postedData = yield parse(this);

    var vote = yield db.votes.findOneAndUpdate(
            { _id: id },
            { $set: { comment: postedData.comment }}
        );

    this.redirect('/vote?questionId=' + vote.questionId);
};