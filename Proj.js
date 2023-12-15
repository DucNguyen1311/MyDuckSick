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
const orderid = require('order-id')('key');
const app = express();
const util = require('util');
const generateUniqueId = require('generate-unique-id');
var nodemailer = require("nodemailer");

var transporter =  nodemailer.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
        user: 'uettechnologicalshop@gmail.com',
        pass: 'uxpe snyi lnhg myso'
    }
});



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
    failureRedirect: "/login",
    successFlash: true,
    failureFlash: true,
    session: true
}), (req, res) => {
    con.query("DELETE FROM cart WHERE userID = ?", req.session.passport.user , (err, result)=>{
        if (err) throw err;
        console.log("cart DELETED");
    });
    res.redirect("/");
});

app.get('/logout',  function (req, res, next)  {
        con.query("DELETE FROM cart WHERE userID = ?", req.session.passport.user , (err, result)=>{
            if (err) throw err;
            console.log("cart DELETED");
        });
        req.session.destroy((err) => {
            if (err) throw err;
        });
        console.log("logged out");
        res.redirect('/');
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
    let newAccount = {userName: data.userName, userEmail: data.userEmail.toLowerCase(), userAddress: data.userAddress, userNumber: data.userNumber, userPassword:data.userPassword, IsAdmin: 0}
    con.query("SELECT * FROM users WHERE userEmail = ?;", newAccount.userEmail , (err, result)=>{
        if (err) throw err;
        if (result.length === 0) {
            con.query('INSERT INTO users SET ?', newAccount , function(err, data, field) {
                if (err) throw err;
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

app.get("/DeletePart", (req,res) => {
    res.render("delete");
});

app.post("/DeletePart", (req,res) => {
    con.query("DELETE FROM products WHERE productCode = ? ", req.body.deleteItem, (err, result) => {
        if (err) throw err
        console.log("Successful!");
    })
    res.redirect("/DeletePart");
});

app.get("/", function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect("/login");
    }
    else {
        con.query("SELECT * FROM users where userID = ?", req.session.passport.user, (err, result) => {
            if (err) throw err
            let admin = JSON.parse(JSON.stringify(result[0])).IsAdmin;
            console.log(admin + " hey check me!");
            if (admin === 0) {
                res.render("homepage");
                console.log(req.session);
            }
            if (admin === 1) {
                res.render("adminHomepage");
                console.log("An admin logged in");
            }
        });
    }
});

app.post("/PartList", (req,res)=>{
    console.log(req.body.partType);
    console.log(req.body.minPrice + "-" + req.body.maxPrice)
    var check = Number(req.body.minPrice) > Number(req.body.maxPrice);
    if (check === true) {
        req.flash("errors", "Minimum Price cannot be bigger than Maximum Price!!!");
        res.redirect("/PartList");
    }
    else {
        res.redirect("/PartList/" + req.body.partType + "+" + req.body.minPrice + "+" + req.body.maxPrice);
    }
});

app.get("/PartList", function(req, res) {
        var sql = " SELECT * FROM products;"
        con.query(sql, function(err, result) {
            if (err) throw err;
            res.render('PartList', {
                PartList: result,
                errors : req.flash("errors")
            });
    });
    console.log(req.session);
});

app.get("/PartList/:code", (req,res) => {
    let arr = req.params.code.split("+");
    let type = "%" + arr[0] + "%";
    let minP = arr[1];
    let maxP = arr[2];
    if (type === "%ALL%") {
        type = "%%";
    }
    console.log(type + " " + minP + " " + maxP);
    con.query("SELECT * FROM products WHERE buyPrice BETWEEN ? AND ? AND productCode LIKE ?", [minP,  maxP, type], (err, result) => {
        res.render('PartList', {
            PartList: JSON.parse(JSON.stringify(result)),
            errors : req.flash("errors")
        });
    });
});

app.post("/add-to-cart-from-part-list", (req, res) =>{
    console.log(req.body.productCode);
    console.log(req.session.passport.user);
    con.query("SELECT * FROM cart WHERE userID = ? AND productCode = ? " , [req.session.passport.user,  req.body.productCode] , (err, result) => {
        if (err) throw err;
        if (result.length === 0 ) {
            con.query("INSERT INTO cart (userID, productCode, productQuantity) VALUES (? , ?, 1);",[req.session.passport.user, req.body.productCode], (err, result) => {
                if (err) throw err;
            })
        }
        if (result.length !== 0) {
                let quantity = JSON.parse(JSON.stringify(result));
                console.log(quantity[0].productQuantity);
                con.query("UPDATE cart SET productQuantity = ? WHERE userID = ? AND productCode = ?;" ,
                [quantity[0].productQuantity + 1,req.session.passport.user, req.body.productCode , req.session.passport.user], 
                (err, result) => {
                    if (err) throw err;
                });
            };
        });
        res.redirect("/PartList");
    });

app.post("/check-detail-from-part-list", (req, res) => {
    console.log("abc123");
    console.log(req.body.productCode)
    res.redirect("/");
});

app.post("/searchPart", (req,res) => {
    console.log("something happened");
    res.redirect("/searchPart/" + req.body.searchResult);
});

app.get("/details/:productCode",  (req,res) => {
    console.log(req.params.productCode);
    function resDetail(query, imageLink, productName) {
        con.query(query, req.params.productCode, (err,result) => {
            if (err) throw err;
            let detail = JSON.parse(JSON.stringify(result[0]));
            imageLink = "/" + imageLink
            console.log(JSON.stringify(detail) + " " + imageLink);
            res.render("details", {
                detail : JSON.stringify(detail),
                imageLink : imageLink,
                productName : productName
            })
        })
    }
    con.query("SELECT productName, imageLink FROM products WHERE productCode = ?", req.params.productCode, (err, result) => {
        if (err) throw err
        let link = JSON.parse(JSON.stringify(result[0])).imageLink;
        let name = JSON.parse(JSON.stringify(result[0])).productName;
        console.log(link);
        if (req.params.productCode.toLowerCase().includes("cpu")) {
            resDetail("SELECT * FROM cpudetail WHERE productCode = ?", link, name);
        }
        if (req.params.productCode.toLowerCase().includes("gpu")) {
            resDetail("SELECT * FROM gpudetail WHERE productCode = ?", link, name);
        }
        if (req.params.productCode.toLowerCase().includes("aio")) {
            resDetail("SELECT * FROM aiodetail WHERE productCode = ?", link, name);
        }
        if (req.params.productCode.toLowerCase().includes("ram")) {
            resDetail("SELECT * FROM ramdetail WHERE productCode = ?", link, name);
        }
        if (req.params.productCode.toLowerCase().includes("mobo")) {
            resDetail("SELECT * FROM mobodetail WHERE productCode = ?", link, name);
        }
        if (req.params.productCode.toLowerCase().includes("psu")) {
            resDetail("SELECT * FROM psudetail WHERE productCode = ?", link, name);
        }
        if (req.params.productCode.toLowerCase().includes("drive")) {
            resDetail("SELECT * FROM drivedetail WHERE productCode = ?", link, name);
        }
    });
});

app.get("/searchPart/:searchResult", (req,res) => {
    let result = "%" + req.params.searchResult + "%";
    console.log(result);
    con.query("SELECT * FROM products WHERE productDescription LIKE ?", result, (err, result) => {
        if (err) throw err;
        res.render("partSearch", {
            PartList : result,
            Keyword : req.params.searchResult
        });
    });
});

app.post("/searchPart/add-to-cart-from-search", (req, res) =>{
    console.log(req.body.productCode);
    console.log(req.session.passport.user);
    con.query("SELECT * FROM cart WHERE userID = ? AND productCode = ? " , [req.session.passport.user,  req.body.productCode] , (err, result) => {
        if (err) throw err;
        if (result.length === 0 ) {
            con.query("INSERT INTO cart (userID, productCode, productQuantity) VALUES (? , ?, 1);",[req.session.passport.user, req.body.productCode], (err, result) => {
                if (err) throw err;
            })
        }
        if (result.length !== 0) {
                let quantity = JSON.parse(JSON.stringify(result));
                console.log(quantity[0].productQuantity);
                con.query("UPDATE cart SET productQuantity = ? WHERE userID = ? AND productCode = ?;" ,
                [quantity[0].productQuantity + 1,req.session.passport.user, req.body.productCode , req.session.passport.user], 
                (err, result) => {
                    if (err) throw err;
                });
            };
        });
    });

app.post("/add-one-more-item-to-cart", (req,res) => {
    con.query("SELECT * FROM cart WHERE userID = ? AND productCode = ? " , [req.session.passport.user,  req.body.productCode] , (err, result) => {
        if (err) throw err;
        let quantity = JSON.parse(JSON.stringify(result));
        console.log(quantity[0].productQuantity);
        con.query("UPDATE cart SET productQuantity = ? WHERE userID = ? AND productCode = ?;" ,
        [quantity[0].productQuantity + 1,req.session.passport.user, req.body.productCode , req.session.passport.user], 
        (err, result) => {
            if (err) throw err;
        });

    });
    res.redirect("/shoppingCart");
});

app.post("/delete-one-item-from-cart", (req,res) => {
    con.query("SELECT * FROM cart WHERE userID = ? AND productCode = ? " , [req.session.passport.user,  req.body.productCode] , (err, result) => {
        if (err) throw err;
        let quantity = JSON.parse(JSON.stringify(result));
        console.log(quantity[0].productQuantity);
        if (quantity[0].productQuantity - 1 === 0) {
            con.query("DELETE  FROM cart WHERE userID = ? AND productCode = ?", [req.session.passport.user,  req.body.productCode], (req,res) =>{
                if (err) throw err;
            });
        }

        if (quantity[0].productQuantity - 1 != 0) {
            con.query("UPDATE cart SET productQuantity = ? WHERE userID = ? AND productCode = ?;" ,
            [quantity[0].productQuantity - 1,req.session.passport.user, req.body.productCode , req.session.passport.user], 
            (err, result2) => {
                if (err) throw err;
            });
        }
    });
    res.redirect("/shoppingCart");
});

app.post("/remove-item-from-cart", (req,res) => {
    con.query("DELETE FROM cart WHERE userID = ? AND productCode = ? " , [req.session.passport.user,  req.body.productCode] , (err, result) => {
        if (err) throw err;
    });
    res.redirect("/shoppingCart");
});

app.post("/place-order", (req,res)=>{
    con.query("SELECT * FROM cart WHERE userID = ?", req.session.passport.user, (err, result)=>{
        if ( err ) throw err;
        console.log(result.length);
        if (result.length != 0) {
            const id = generateUniqueId({
                length: 20,
                useLetter: true
            });
            const date = new Date();
            const orderDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const requiredDate = new Date(date.setMonth(date.getMonth()+3)).toISOString().slice(0, 19).replace('T', ' ');;
            const shippedDate = null;
            const status = "unshipped";
            comments = null;
            userID = req.session.passport.user;
            console.log(id + " " + orderDate + " " + requiredDate + " " + shippedDate + " " + status + " " + comments + " " + userID);
            var databaseObj = {orderNumber : id, orderDate : orderDate, requiredDate : requiredDate, shippedDate : shippedDate, status : status, comments : comments, userID : userID};
            con.query("INSERT INTO orders SET " + con.escape(databaseObj), (err, result)=>{
                if (err) throw err;
                con.query("SELECT p.productCode, productQuantity, buyPrice FROM products p INNER JOIN cart c WHERE p.productCode = c.productCode AND c.userID = ?", req.session.passport.user, (err, result) => {
                    console.log(JSON.parse(JSON.stringify(result[0])));
                    let data = JSON.parse(JSON.stringify(result));
                    for (let i = 0; i < result.length; i++) {
                        let cart = JSON.parse(JSON.stringify(result[i]));
                        let orderObj = {orderNumber: id, productCode: cart.productCode, quantityOrdered: cart.productQuantity, priceEach: cart.buyPrice};
                        con.query("INSERT INTO orderdetails SET" + con.escape(orderObj), (err, result)=>{
                            if (err) throw err;
                            con.query("DELETE FROM CART WHERE userID = ?", req.session.passport.user, (err, result) => {
                                if (err) throw err;
                            });
                        })
                    }
                    con.query("SELECT * FROM users where userID = ?", req.session.passport.user, (err, result) => {
                        let email = JSON.parse(JSON.stringify(result[0])).userEmail;
                        console.log(email);
                        con.query("SELECT productName, quantityOrdered, priceEach FROM project.orderdetails a JOIN products b on a.productCode = b.productCode WHERE orderNumber = ?", id, (err, result) => {
                            let orderData = JSON.parse(JSON.stringify(result));
                            let totalPrice = 0;
                            console.log(orderData);
                            let message = " <p>Greetings from UET Technological Shop<br><br>We would like to inform you that you have made a purchase on our website<br><br>Time:" + date + "<br><br>Order Code: " + id +"<br><br>Order content: <br>";
                            for (let i = 0; i < orderData.length; i++ ) {
                                let pName = orderData[i].productName;
                                let qOrdered = orderData[i].quantityOrdered;
                                let price = orderData[i].priceEach * qOrdered;
                                totalPrice += price;
                                message += "* " + qOrdered + " " + pName + " : " + price + "$<br>"
                            }
                            message += "<br>Total Price : " + Math.round(totalPrice) + "$<br><br>";
                            message += " DO NOT REPLY TO THIS EMAIL! IT WAS AUTO SENT!<br>If you did not make this purchase, please inform us at 0932812931!<br>Thank you for choosing us!<br></p>"
                            console.log(message);
                            var mailOptions = { // thiết lập đối tượng, nội dung gửi mail
                                from: 'no-reply@gmail.com',
                                to: email,
                                subject: "Order notification!",
                                html: message
                            }
                            transporter.sendMail(mailOptions, (err, result) => {
                                if (err){
                                console.log(err)
                                    res.json('Opps error occured')
                                } else{
                                    res.json('thanks for e-mailing me');
                                }
                            })
                            res.redirect("/shoppingCart");
                        }); 
                    });
                });
            })
        }
    })
});

app.get("/shoppingCart", (req,res) => {
    con.query("SELECT cart.productCode, productName, buyPrice, productQuantity, userID FROM products INNER JOIN cart ON products.productCode = cart.productCode WHERE userID = ?;", req.session.passport.user, (err, result) => {
        if (err) throw err;
        res.render("shoppingCart", {cart:result});
    });
});

app.get("/orderHistory", (req,res) => {
    con.query("SELECT orders.orderdate, orders.status ,orders.userID, orders.orderNumber, SUM( quantityOrdered * priceEach) as totalPrice FROM orderdetails JOIN orders ON orderdetails.orderNumber = orders.orderNumber WHERE userID = ? GROUP BY orderNumber;", req.session.passport.user, (err, result) => {
        if (err) throw err;
        res.render("orderHistory.ejs", {history : result});
    });
});

app.get("/allOrders", (req,res) => {
    con.query("SELECT orders.orderdate, orders.status ,orders.userID, orders.orderNumber, SUM( quantityOrdered * priceEach) as totalPrice FROM orderdetails JOIN orders ON orderdetails.orderNumber = orders.orderNumber GROUP BY orderNumber;", (err, result) => {
        if (err) throw err;
        res.render("allOrders.ejs", {history : result});
    });
});

app.listen(3000,"0.0.0.0", function() {  
    console.log("Website successfully launched on port 3000");
});