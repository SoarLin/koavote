var koa = require('koa');
var route = require('koa-route');
var app = module.exports = koa();
var serve = require('koa-static');

// App configuration
app.use(serve(__dirname + '/public'));

// routes
var homeRoutes = require('./routes/homeRoutes');
app.use(route.get('/', homeRoutes.showHome));

var questionRoutes = require('./routes/questionRoutes');
app.use(route.get('/question', questionRoutes.showNewQuestion));
app.use(route.post('/question', questionRoutes.addQuestion));
app.use(route.get('/question/:id', questionRoutes.showQuestion));
app.use(route.post('/question/:id', questionRoutes.updateQuestion));

var voteRoutes = require('./routes/voteRoutes');
app.use(route.get('/vote', voteRoutes.showAddVote));
app.use(route.post('/vote', voteRoutes.addVote));
app.use(route.get('/vote/:id/comment', voteRoutes.showAddComment));
app.use(route.post('/vote/:id/comment', voteRoutes.addComment));

var resultRoutes = require('./routes/resultRoutes');
app.use(route.get('/results', resultRoutes.showResultPage));
app.use(route.post('/results', resultRoutes.renderResultsFile));

// Start app up
app.listen(3000);
console.log('The app is listening on port 3000.');