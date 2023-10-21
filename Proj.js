const oneDay = 1000 * 60 * 60 * 24;
const express = require("express");
const lodash = require('lodash');
const mysql = require('mysql');
const request = require('request');
const bodyParser = require('body-parser');
const session = require("express-session");
const cors = require("cors");
const flash = require("connect-flash");
const validator = require("email-validator");
let { validationResult } = require("express-validator");
const { check } = require("express-validator");
const passport = require("passport");
const { Strategy } = require("passport-local");
const app = express();

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",   
    database: "project"
});

app.use(session({secret: "duckdeeptry", resave: false, saveUninitialized: true, cookie: ({ maxAge: oneDay })}));
app.use(express.static("public"));
app.use(flash());
app.use(cors());
app.use(require('cookie-parser')('keyboard cat'))
app.use(express.json());
app.use(passport.session());
app.use(passport.initialize())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set("view engine", "ejs");


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
            return done(null, result[0], null);
        }
    });
}));

passport.serializeUser((user, done) => {
    console.log("serializeUser: " + JSON.stringify(user));
    done(null, user.userID);
});

passport.deserializeUser((id, done) => {
    con.query("SELECT * FROM users WHERE userID = " + id, (err, result) =>{
        console.log("deserializeUser: " + JSON.stringify(result[0]));
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
    failureFlash: true,
    session: true
}),
(req, res) =>{
    con.query("UPDATE cart SET cartContent = null", (err, result)=>{
        if (err) throw err;
    });
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
        if (result.length === 0) {
            let cartID = 0;
            con.query('INSERT INTO users SET ?', newAccount , function(err, data, field) {
                if (err) throw err;
                con.query('INSERT INTO cart (userID) VALUE (' + data.insertId + ');', (err,data) =>{
                    if (err) throw err;
                });
            });
            res.redirect("/login");
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
        res.render("homepage");
        console.log(req.session);
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
    console.log(req.session);
});

app.post("/add-to-cart-from-part-list", (req, res) =>{
    console.log(req.body.productCode);
    console.log(req.session.passport.user);
    con.query("SELECT cartContent FROM cart WHERE userID = " + req.session.passport.user + ";", (err, result)=>{
        if (err) throw err;
        if (result[0].cartContent != null) {
            con.query("UPDATE cart SET cartContent = ? WHERE userID = " + req.session.passport.user + ";", result[0].cartContent + req.body.productCode + ",",
            (err, result=>{
                if (err) throw err;
            }));
        }
        else{
            con.query("UPDATE cart SET cartContent = ? WHERE userID = " + req.session.passport.user + ";", req.body.productCode + ",",
            (err, result=>{
                if (err) throw err;
            }));
        }
    });
    res.redirect("/PartList");
});

app.listen(3000, function() {  
    console.log("Website successfully launched on port 3000");
});