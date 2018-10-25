// Get our dependencies
var express = require('express');
var app = express();
var mysql = require("mysql");
var exposePort = process.env.API_PORT || 3000;
var connection = mysql.createConnection({
 host     : process.env.DB_HOST || 'mysql-test.cxrpknmq0hfi.us-west-2.rds.amazonaws.com',
 user     : process.env.DB_USER || 'applicationuser',
 password : process.env.DB_PASS || 'applicationuser',
 database : process.env.DB_NAME || 'movie_db'
});

connection.connect();

function getMovies(callback) {    
  connection.query("SELECT * FROM movie_db.movies",
      function (err, rows) {
          callback(err, rows); 
      }
  );
}

//Testing endpoint
app.get('/', function(req, res){
  var response = [{response : 'hello'}, {code : '200'}]
  res.json(response);
})

// Implement the movies API endpoint
app.get('/movies', function(req, res){
  connection.query("select m.title, m.release, m.score, r.name as reviewer, p.name as publication from movie_db.moviereview m, movie_db.reviewers r, movie_db.publications p where r.publication=p.name and m.reviewer=r.name",function(err, rows){
    res.json(rows);
  });
})

// Implement the reviewers API endpoint
app.get('/reviewers', function(req, res){
  connection.query("select r.name, r.publication, r.avatar from movie_db.reviewers r",function(err, rows){
    res.json(rows);
  });
})

// Implement the publications API endpoint
app.get('/publications', function(req, res){
  connection.query("select * from movie_db.publications",function(err, rows){
    res.json(rows);
  });
})

// Implement the pending reviews API endpoint
app.get('/pending', function(req, res){
  var pending = [
    {title : 'Superman: Homecoming', release: '2017', score: 10, reviewer: 'Chris Harris', publication: 'International Movie Critic'},
    {title : 'Wonder Woman', release: '2017', score: 8, reviewer: 'Martin Thomas', publication : 'TheOne'},
    {title : 'Doctor Strange', release : '2016', score: 7, reviewer: 'Anthony Miller', publication : 'ComicBookHero.com'}
  ]
  res.json(pending);
})
console.log("server listening through port: " + exposePort);
// Launch our API Server and have it listen on port 3000.
app.listen(exposePort);
module.exports = app;
