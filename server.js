var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

var AccountRoutes = require('./controllers/account_controller');
var HomeRoutes = require('./controllers/home_controller');

var port = process.env.PORT || 2200;

app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({secret: 'randomstringsessionsecret'}));

app.use('/',AccountRoutes.AccountRoutes);

app.use(function(req,res,next){
    if(req.session.email == null || req.session.email.length ==0 ){
        res.redirect('/login');
    }
    else{
        next();
    }
});

app.use('/',HomeRoutes.HomeRoutes);

app.listen(port, () => {
    console.log(`server is running ${port}`);
    console.log('server is running ${port}');
});
