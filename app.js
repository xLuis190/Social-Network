var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var mongoose = require('mongoose')
var router = express.Router();

var routes = require('./routes/index');
var users = require('./routes/users');
mongoose.connect('mongodb://localhost/users')

var Schema = mongoose.Schema;
var userSchema = new Schema({
  Username: String,
  Password: String,
  Email: String,
  FullName: String
});
var User = mongoose.model('User', userSchema);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// setting the port
app.set('port', process.env.PORT || 80);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  cookieName: 'session',
  secret: 'OFIFKALFODINJU846586',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.post('/login',function(){
  User.findOne({Username:req.body.username},function(err,user){
    if(!user){
      console.log("shut the fuck up!")
      res.end()
    }
    else{
      if(req.body.password ==  user.Password){
        console.log("You passed my test");
        res.end();
      }else{
        console.log("Shut the fuck up again!")
        res.end()
      }
    }
  })
})
app.route('/profile').get(function(req,res,next){
  res.render("profile")
})
app.route('/register').get(function(req,res,next){
  res.render('register');
})
.post(function(req,res,next){
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var fullname = req.body.fullName;
  var newUser = new User({
    Username:username,
    Password: password,
    Email: email,
    FullName:fullname
  });
    newUser.save(function(err,result){
      if(err) console.log(err)
      else{
        res.render('homepage',{user:result})
      }
    })
})

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(app.get('port'),() =>{
  console.log("App running on port "+ app.get('port'))
})
module.exports = app;
