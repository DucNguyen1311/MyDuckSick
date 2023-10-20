const express = require("express");
const lodash = require('lodash');
const mysql = require('mysql');
const request = require('request');
const bodyParser = require('body-parser');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const flash = require("connect-flash");
const validator = require("email-validator");
let { validationResult } = require("express-validator");
const { check } = require("express-validator");
const passport = require("passport");
const { Strategy } = require("passport-local");

const app = express();

app.use(flash());
app.use(cors());
app.use(cookieParser());
app.use(session({secret: "duckdeeptry", resave: true, saveUninitialized: true}));
app.use(express.json());
app.use(passport.initialize())
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: false}));
app.set("view engine", "ejs");
app.use(express.static("public"));

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "project"
});

passport.use(new Strategy({
    usernameField: 'email',
    userPassword: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    con.query("SELECT * FROM users WHERE userEmail = ?;", email, (err, result) => {
        if (err) {
            console.log("[mysql error]",err);
            return done(err);
        }
        if (result.length === 0) {
            return done(null, false, req.flash("errors", "This email " + email + " is not registered"));
        }
        var data = JSON.parse(JSON.stringify(result));
        if (data[0].userPassword != password) {
            return done(null, false, req.flash("errors", "Wrong password!"))
        }
        else{ 
            console.log(data);
            return done(null, result[0], null);
        }
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.userID);
});

passport.deserializeUser((id, done) => {
    con.query("SELECT * FROM users WHERE userID = " + id, (err, result) =>{
        done(err, result[0]);
    });
});

app.get("/login", (req,res) => {
    res.render("login",{errors : req.flash("errors")});
});

app.post("/login",passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login",
    successFlash: true,
    failureFlash: true
}
),(req, res) =>{
    console.log(req.session);
});


app.get("/register", (req,res) => {
    res.render("register", {errors : req.flash("errors")});
});

app.post("/register" ,
check("userEmail", "Invalid Email!" ).isEmail().trim(), 
check("userPassword", "Password too short!").isLength({ min: 2}), 
check("passwordCF", "Password confirmation does not match password!").custom((value, {req}) => {return value === req.body.userPassword;}), 
(req, res) => {
    let data = req.body;
    let errorsArr = [];
    let queryData = null;
    let valid = true;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       let validErrors = Object.values(errors.mapped());
       validErrors.forEach((item) => {
            errorsArr.push(item.msg);
       });
        req.flash("errors", errorsArr);
        res.redirect("/register");
    }
    let newAccount = {userName: data.userName, userEmail: data.userEmail.toLowerCase(), userAddress: data.userAddress, userNumber: data.userNumber, userPassword:data.userPassword}
    con.query("SELECT * FROM users WHERE userEmail = ?;", newAccount.userEmail , (err, result)=>{
        if (err) throw err;
        test = result;
        if (result.length === 0) {
            con.query('INSERT INTO users SET ?', newAccount , function(err, data) {
                if (err) throw err;        
                res.redirect('/login');
                res.end();
            });
        }
        else {
            req.flash("errors", "Email already in use, please try again");
            res.redirect("/register");
        }
    });
    console.log(newAccount);
});

app.get("/AddPart", function(req,res) {
    res.render("AddPart");
});

app.post("/AddPart", function(req, res) {
    var data = req.body;
       let newProduct = { productCode:data.productCode, productName:data.productName, productLine:data.productLine, productBrand:data.productBrand, productDescription: data.productDescription ,quantityInStock: data.quantityInStock, buyPrice:data.buyPrice, imageLink:data.imageLink};
       con.query('INSERT INTO products SET ?', newProduct , function(err, data) {
        if (err) throw err;        
        res.redirect('/');
        res.end();
        }); 
});

app.get("/", function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    }
    else {
        console.log(session.user);
        res.render("homepage");
    }
});

app.get("/PartList", function(req, res) {
        var sql = " SELECT * FROM products;"
        con.query(sql, function(err, result) {
            if (err) throw err;
            res.render('PartList', {
                PartList: result
            });
    });
});

app.get("*", function(req, res) {
    res.send("That route is not exist!, you are lost");
});

app.listen(3000, function() {  
    console.log("Website successfully launched on port 3000");
});