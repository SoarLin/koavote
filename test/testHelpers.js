var db = require('./../lib/db');
var co = require('co');

module.exports.removeAllDocs = function() {
    co(function *(){
        yield db.questions.remove({});
        yield db.votes.remove({});
    }).catch(function(err){
        console.error(err.stack);
    });
}