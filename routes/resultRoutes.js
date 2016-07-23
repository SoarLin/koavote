var render = require('./../lib/render');
var parse = require('co-body');
var db = require('./../lib/db');
var utils = require('./utils');

module.exports.showResultPage = function *() {
    var questionList = yield db.questions.find({});
    this.body = yield render('result', {questions: questionList});
};

module.exports.renderResultsFile = function *() {
    var postedData = yield parse(this);
    // console.log(postedData);
    postedData.tags = utils.splitAndTrimTagString(postedData.tagString);

    var vm = { votes: yield getVotesForCriteria(postedData) };

    this.set("content-type", "application/vnd.ms-excel");
    this.set("content-disposition", "attachment;filename=result.xls");

    this.body = yield render('showResults', vm);
};

function *getVotesForCriteria(postedCriteria) {
    var filter = {};
    if (postedCriteria.questionTitle != '') {
        filter.questionTitle = postedCriteria.questionTitle;
    }

    if (postedCriteria.tags.length > 0) {
        filter.tags = { $in: postedCriteria.tags };
    }

    if (postedCriteria.from.length > 0) {
        filter.created_at = {
            $gte: utils.yyyymmdd_to_date(postedCriteria.from),
            $lt: utils.yyyymmdd_to_date(postedCriteria.to)
        };
    }
    // console.log('filter', filter);
    return yield db.votes.find(filter);
}