// Initializing the application
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var connection = mysql.createConnection({
  host: '35.226.99.157',
  user: 'root',
  password: 'dreamToStream',
  database: 'dreamToStream'
});
connection.connect;

var app = express();

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

/* GET home page, respond by rendering index.ejs */
app.get('/', function (req, res) {
  res.render('index', { title: 'Home' });
});

/* GET create user page, respond by rendering create-user.ejs */
app.get('/create-user', function (req, res) {
  res.render('create-user', { title: 'Create User' });
});

/* POST request to create user, redirect to success page if successful, show error message if unsuccessful */
app.post('/create-user', function (req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var dob = req.body.dob;
  var country = req.body.country;

  connection.query('SELECT MAX(id) AS max_id FROM Users', function (err, result) {
    if (err) {
      res.send(err);
      return;
    }

    // Get the next id to create a new user
    var max_id = result[0].max_id;
    var next_id = max_id ? max_id + 1 : 1;

    var sql = `INSERT INTO Users VALUES (${next_id}, '${firstName}', '${lastName}', '${dob}', '${country}')`;
    connection.query(sql, function (err, result) {
      if (err) {
        res.send(err);
        return;
      }
      console.log('New user inserted with id: ' + next_id);
      res.redirect('/success');
    });
  });
});

// Create a new GET route for the sign-in page
app.get('/sign-in', function (req, res) {
  res.render('sign-in', { title: 'Sign In' });
});

// Handle sign-in form submissions
app.post('/sign-in', function (req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;

  connection.query(`SELECT * FROM Users WHERE firstName='${firstName}' AND lastName='${lastName}'`, function (err, results, fields) {
    if (err) {
      res.send(err);
      return;
    }

    if (results.length > 0) {
      res.render('signinsuccess', { users: results });
    } else {
      res.render('sign-in', { title: 'Sign In', error: 'Invalid credentials' });
    }
  });
});

// Handle sign in to homepage for users based on their given id
app.get('/home/:id', function (req, res) {
  var userId = req.params.id;
  // Fetch user data based on the userId from the database
  connection.query('SELECT * FROM Users WHERE id = ?', [userId], function (err, results) {
    if (err) {
      res.send(err);
      return;
    }
    // Render the home page with the user data
    res.render('home', { user: results[0] });
  });
});

app.listen(80, function () {
  console.log('Node app is running on port 80');
});

/* GET success page, respond by rendering success.ejs */
app.get('/success', function (req, res) {
  res.render('success', { title: 'Success' });
});

app.get('/put-rating', function (req, res) {
  var userId = req.query.id;; // Get the user ID from the URL parameter
  res.render('put-rating', { title: 'Update a Rating', userId: userId });
});

/* POST request to create user, redirect to success page if successful, show error message if unsuccessful */
app.post('/put-rating', function (req, res) {
  var userId = req.query.id; // Retrieve user ID from URL parameter
  var media = req.body.media;
  var rating = req.body.rating;
  var type = req.body.type;
  var change = req.body.change;
  var comments = req.body.comments;
  var currentDate = new Date().toISOString().substring(0, 10);

  if (change == 'Add') {
    if (type == 'Movie') {
      var type = 'MovieRating';
      var sql2 = `INSERT INTO MovieRating (id, name, date, value, comments) VALUES (${userId}, '${media}', '${currentDate}', ${rating}, '${comments}')`;
    }
    else {
      var type = 'ShowRating';
      var sql2 = `INSERT INTO ShowRating (id, name, date, value, comments) VALUES (${userId}, '${media}', '${currentDate}', ${rating}, '${comments}')`;
    }
  }
  else if (change == 'Update') {
    if (type == 'Movie') {
      var type = 'MovieRating';
      var sql2 = `UPDATE MovieRating SET value = ${rating}, comments = '${comments}' WHERE id = ${userId} AND name = '${media}'`;
    }
    else {
      var type = 'ShowRating';
      var sql2 = `UPDATE ShowRating SET value = ${rating}, comments = '${comments}' WHERE id = ${userId} AND  name = '${media}'`;
    }
  } else if (change == 'Delete') {
    if (type == 'Movie') {
      var type = 'MovieRating';
      var sql2 = `DELETE FROM MovieRating WHERE id = ${userId} AND name = '${media}'`;
    }
    else {
      var type = 'ShowRating';
      var sql2 = `DELETE FROM ShowRating WHERE id = ${userId} AND name = '${media}'`;
    }
  }

  connection.query(sql2, function(err, result) {
    if (err) {
      res.send(err);
      return;
    }
    console.log('Rating Updated');
    res.redirect(`/rating-success?type=${type}&id=${userId}`);
  });
});

// GET request for rating success page
app.get('/rating-success', function (req, res) {
  // Determine the appropriate table to query based on the 'type' parameter
  var tableName = req.query.type;
  var userID = req.query.id;

  // Perform a SELECT query to retrieve the updated data from the database
  var sql = `SELECT * FROM ${tableName} WHERE id = ${userID}`;

  connection.query(sql, function (err, results) {
    if (err) {
      res.send(err);
      return;
    }

    // Render the rating success page with the retrieved data
    res.render('rating-success', { ratings: results, req: req});
  });
});

//GET request for shows
app.get('/shows', function (req, res) {
  res.render('shows', { title: 'Shows' });
});

//GET request for search
app.get('/search', (req, res) => {
  var title = req.query.title
  var genre = req.query.genre;

  let sql = `SELECT * FROM Shows WHERE  (name like '${title}%' OR name like '${title}%') AND genre LIKE '%${genre}%' LIMIT 15`

  connection.query(sql, (err, result) => {
    if (err) {
      res.send(err);
      return;
    }
    res.send(result)
  });
});

//Generated Data for Advanced Queries -- REPLACE with sql outputs
var dataQuery1 = [
  ["Shows", '2021', '23'],
  ["Movies ", '2021', '432'],
  ["Shows", '2020', '98'],
  ['Movies', '2020', '435']
];

var dataQuery2 = [
  ["Divya", 'Manirajan', '23', '11-02-1999'],
  ["John ", 'Smith', '43', '1-04-1949'],
  ["boe", 'jonnson', '98', '3-0-3333'],
  ['hadf', 'adsf', '435', '2-2-2220']
];


//GET request to set up advanced queries
app.get('/AdvQueriesSubmit', function (req, res) {
  res.render('AdvQueriesSubmit');
});

//POST request for Advanced Query 1
app.post('/Query1', function (req, res) {
  res.render('AdvQuery1Table', { sampleData: dataQuery1 })
}
);

//POST request for Advanced Query 2
app.get('/Query2', function (req, res) {

  var platform = req.query.Platform;

  var sql = "SELECT name, firstName, lastName, value FROM Users NATURAL JOIN MovieRating WHERE country IN (SELECT country FROM Platform WHERE platform = '" + platform + "')ORDER BY name;";

  connection.query(sql, function (err, dataQuery2) {
    if (err) throw err;
    res.render('AdvQuery2Table', { sampleData: dataQuery2 });
  });
});

//GET request for Top movies
app.get('/topMovies', function (req, res) {
  var genre = req.query.genre;
  var sYear = req.query.sYear;
  var eYear = req.query.eYear;

  let sql = `SELECT name, m.releaseYear, value, genre 
    FROM Movies as m Natural JOIN MovieRating as mr JOIN (
      SELECT MAX(value) as mxs, releaseYear
      FROM Movies Natural JOIN MovieRating
      GROUP by releaseYear
    ) as maxs ON maxs.releaseYear=m.releaseYear
    WHERE genre LIKE '%${genre}%' and mr.value=maxs.mxs and m.releaseYear between ${sYear} and ${eYear}
    ORDER BY name`

  connection.query(sql, (err, result) => {
    if (err) {
      res.send(err);
      return;
    }
    res.send(result)
  });
});


// GET route for the user-mesh page
app.get('/user-mesh', (req, res) => {
  res.render('user-mesh');
});

// GET to runs a mesh for two queries to get movie and show ratings
app.get('/user-mesh-query', (req, res) => {
  const userId1 = req.query.userId1;
  const userId2 = req.query.userId2;

  const meshSQL = `CALL get_ratings(${userId1}, ${userId2})`;


  connection.query(meshSQL, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    } else {
      res.render('user-mesh-success', { 
        userId1: userId1,
        userId2: userId2,
        ratings: results,
      });
    }
  });

});

