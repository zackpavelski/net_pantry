var mysql = require('mysql');
var crpyto = require('crypto');
var bcrypt = require('bcrypt');
var LocalStorage = require('node-localstorage').LocalStorage;
const { Console } = require('console');
const { response } = require('express');
var nodemailer = require("nodemailer");
const { Decoder } = require('@nuintun/qrcode');
const internal = require('stream');

localStorage = new LocalStorage('./scratch');


function foo (array) {
    let a = [],
        b = [],
        arr = [...array], // clone array so we don't change the original when using .sort()
        prev;

    arr.sort();
    for (let element of arr) {
        if (element !== prev) {
        a.push(element);
        b.push(1);
        }
        else ++b[b.length - 1];
        prev = element;
    }

    return [a, b];
    }
    
exports.setRequestUrl=function(app){
    var user = require('./routes/user')
        ,indexObj = require('./routes/index');

    app.get('/', user.login);
    app.get('/dashboard', user.dashboard);
    app.get('/studentDash', user.studentDash);
    app.get('/inventory', user.inventory);
    app.get('/additem', user.additem);
    app.get('/scanner', user.scanner);
    app.get('/account', user.account);
    app.get('/signup', user.signup);
    app.get('/users', user.users);
    app.get('/feedback', user.feedback);
    app.get('/history', user.history);
    app.get('/switch', user.switch);
    app.get('/forgotPass', user.forgotPass);
    app.get('/thank', user.thank);
    app.get('/feedbackResponse', user.feedbackResponse)
    
    app.post('/getUser', function(req, response){
        response.send({success: true, message: localStorage.getItem('name')});
    });
    app.post('/insertInventory', function(req, response){
        var connection = mysql.createConnection({
            host: 'pantrydb.cvskfciqfnj6.us-east-1.rds.amazonaws.com',
            port: '3306',
            user: 'pantryAdmin',
            password: 'Pantry21!',
            database: 'pantrydb'
        });


     

        var school = req.body.school;
        var sqlquery;
        console.log(school);
        if(school.includes('Gib')){
            sqlquery = `INSERT INTO gibsInventory (item_name, item_quantity, school) VALUES ('${req.body.itemName}', '${req.body.itemQuantity}', '${school}');`;

        }else if(school.includes('Lakewood')){
            sqlquery = `INSERT INTO lhsInventory (item_name, item_quantity, school) VALUES ('${req.body.itemName}', '${req.body.itemQuantity}', '${school}');`;

        }else if(school.includes('Holl')){
            sqlquery = `INSERT INTO hollinsInventory (item_name, item_quantity, school) VALUES ('${req.body.itemName}', '${req.body.itemQuantity}', '${school}');`;
        }

        connection.query(sqlquery, function(err, result){
            if(err) throw err;
            console.log('1 row inserted');
        })
    });
    app.post('/loadOrders', function(req,response)
    {   
        
        var arr = '';
        var connection = mysql.createConnection({
            host: 'pantrydb.cvskfciqfnj6.us-east-1.rds.amazonaws.com',
            port: '3306',
            user: 'pantryAdmin',
            password: 'Pantry21!',
            database: 'pantrydb'
        });
        connection.query('SELECT * FROM lhsOrders', function(err, result){
            if (err) throw err;
            console.log(result);
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                arr += ('<tr> <td>'+row.name +'</td> <td>'+ row.items + ' </td> <td>'+ row.date +' </td> <td>'+ row.id +'</td> <td> '+row.school+'</td> </tr>');
            }
            
            //response.send({success: true, message: arr});
        })
        connection.query('SELECT * FROM hollinsOrders', function(err, result){
            if (err) throw err;
            console.log(result);
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                arr += ('<tr> <td>'+row.name +'</td> <td>'+ row.items + ' </td> <td>'+ row.date +' </td> <td>'+ row.id +'</td> <td> '+row.school+'</td> </tr>');
            }
            //response.send({success: true, message: arr});
        })
        connection.query('SELECT * FROM gibsOrders', function(err, result){
            if (err) throw err;
            console.log(result);
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                arr += ('<tr> <td>'+row.name +'</td> <td>'+ row.items + ' </td> <td>'+ row.date +' </td> <td>'+ row.id +'</td> <td> '+row.school+'</td> </tr>');
            }
            response.send({success: true, message: arr, message2: localStorage.getItem('name')});

        })
        
    });
    app.post('/loadUsers', function(req, response){
        var arr = '';
        var connection = mysql.createConnection({
            host: 'pantrydb.cvskfciqfnj6.us-east-1.rds.amazonaws.com',
            port: '3306',
            user: 'pantryAdmin',
            password: 'Pantry21!',
            database: 'pantrydb'
        });
        connection.query('SELECT * FROM pantryUsers', function(err, result){
            if(err) throw err;
            console.log(result);
            for(var i = 0; i<= result.length; i++){
                try{
                    var row = result[i];
                    console.log('name: ' + row.fullName);
                    if(row.fullName == undefined || row.fullName == '' || row.username == undefined || row.username == '') {
                        result.splice(i, 1);
                        continue;
                    }
                    arr += '<tr><td>'+row.fullName+'</td><td>'+row.username+'</td><td>'+row.numPeople+'</td><td>'+row.numMinors+'</td><td>'+row.zipCode+'</td><td>'+row.school+'</td></tr>';
                }catch(e){
                    console.log('Empty User');
                    continue;
            
                }
                
                //fullName, username, numPeople, numMinors, zipCode, school
            }
            console.log(arr);
            response.send({success: true, message: arr});
        })
    });;
    app.post('/loadSpecificUser', function(req, response){
        var arr = '';
        var connection = mysql.createConnection({
            host: 'pantrydb.cvskfciqfnj6.us-east-1.rds.amazonaws.com',
            port: '3306',
            user: 'pantryAdmin',
            password: 'Pantry21!',
            database: 'pantrydb'
        });
        var name = localStorage.getItem('name');
        var school = localStorage.getItem('school');
        var sql;
        
        if(school.includes('Lake')){
            sql = `SELECT * FROM lhsOrders WHERE name = '${name}'`;
        }else if (school.includes('Gib')){
            sql = `SELECT * FROM gibsOrders WHERE name = '${name}'`;
        }else if(school.includes('Holl')){
            sql = `SELECT * FROM hollinsOrders WHERE name = '${name}'`;
        }
        try{
            connection.query(sql, function(err, result){
                console.log(result[0].name + ': NAME');
                
                    for(var i = 0; i<= result.length; i++){
                        try{
                            var row = result[i];
                            console.log('name: ' + row.name);
                            if(row.name == undefined || row.name == '' || row.name == undefined || row.name == '') {
                                result.splice(i, 1);
                                continue;
                            }
                            arr+=`<tr><td>${row.name}</td><td>${row.date}</td><td>${(row.items).replace(',', ' ')}</td><td>${row.id}<td></tr>`;
                        }catch(e){
                            console.log('Empty User');
                            continue;
                        }
                        //fullName, username, numPeople, numMinors, zipCode, school
                    }
                    console.log(arr + ' ARRRRRRRRRRRRR');
                    response.send({success: true, message: arr});
                               
            })
        }catch(e){
            console.log('Empty Query');
            response.send({success: true, message: arr});
        }
    });;
    app.post('/loadFavorites', function(req, response){
        var arr = '';
        var connection = mysql.createConnection({
            host: 'pantrydb.cvskfciqfnj6.us-east-1.rds.amazonaws.com',
            port: '3306',
            user: 'pantryAdmin',
            password: 'Pantry21!',
            database: 'pantrydb'
        });
        connection.query('SELECT * FROM lhsOrders', function(err, result){
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                var results  = foo(row.items.split(','));
                var splits = row.items.split(',');
                for(var i = 0; i < results[0].length; i++){
                    arr += '<tr><td>'+splits[i]+':'+results[1][i]+'</td><td>'+row.school+'</td></tr>'

                }
            }
        })
        connection.query('SELECT * FROM hollinsOrders', function(err, result){
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                var results  = foo(row.items.split(','));
                var splits = row.items.split(',');
                for(var i = 0; i < results[0].length; i++){
                    arr += '<tr><td>'+splits[i]+':'+results[1][i]+'</td><td>'+row.school+'</td></tr>'

                }
            }
        })
        connection.query('SELECT * FROM gibsOrders', function(err, result){
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                var results  = foo(row.items.split(','));
                var splits = row.items.split(',');
                for(var i = 0; i < results[0].length; i++){
                    arr += '<tr><td>'+splits[i]+':'+results[1][i]+'</td><td>'+row.school+'</td></tr>'

                }
            }
            response.send({success: true, message: arr});

        })
    });
    app.post('/loadInventory', function(req,response)
    {   
        var arr = '';

        var connection = mysql.createConnection({
            host: 'pantrydb.cvskfciqfnj6.us-east-1.rds.amazonaws.com',
            port: '3306',
            user: 'pantryAdmin',
            password: 'Pantry21!',
            database: 'pantrydb'
        });
        connection.query('SELECT * FROM lhsInventory', function(err, result){
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                arr += (' <tr> <td> ' + String(row.id) + '</td> <td>'+ row.item_name + ' </td> <td>'+ row.item_quantity +' </td><td>'+row.school+'</td></tr>');
            }
        })
        connection.query('SELECT * FROM hollinsInventory', function(err, result){
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                arr += (' <tr> <td> ' + String(row.id) + '</td> <td>'+ row.item_name + ' </td> <td>'+ row.item_quantity +' </td><td>'+row.school+'</td></tr>');
            }
        })
        connection.query('SELECT * FROM gibsInventory', function(err, result){
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                var row = result[i];
                arr += (' <tr> <td> ' + String(row.id) + '</td> <td>'+ row.item_name + ' </td> <td>'+ row.item_quantity +' </td><td>'+row.school+'</td></tr>');
            }
            response.send({success: true, message: arr});

        })
    });
    app.post('/changeSchool', function(req, response){
        var connection = mysql.createConnection({
            host: 'pantrydb.cvskfciqfnj6.us-east-1.rds.amazonaws.com',
            port: '3306',
            user: 'pantryAdmin',
            password: 'Pantry21!',
            database: 'pantrydb'
        });
        var sql = `UPDATE pantryUsers SET school = '${req.body.school}' WHERE username = '${req.body.student}' `;  
        connection.query(sql, function(err, result){
            if(err) throw err;
            console.log("Updated.");
        })
    })
    app.post('/resetPassword', function(req, response){
        var connection = mysql.createConnection({
            host: 'pantrydb.cvskfciqfnj6.us-east-1.rds.amazonaws.com',
            port: '3306',
            user: 'pantryAdmin',
            password: 'Pantry21!',
            database: 'pantrydb'
        });
        
        var password;
            var saltRounds = 4;
            bcrypt.hash(req.body.pwd, saltRounds, function(err, hash) {
                password = hash;
              });
        var sql = `UPDATE pantryUsers SET password = '${password}' WHERE username = '${req.body.username}' AND numPeople = '${req.body.people}' `;  
        connection.query(sql, function(err, result){
            if(err) throw err;
            console.log("Updated.");
        })
    })
    app.post('/updateUser', function(req, response){
        var connection = mysql.createConnection({
            host: 'pantrydb.cvskfciqfnj6.us-east-1.rds.amazonaws.com',
            port: '3306',
            user: 'pantryAdmin',
            password: 'Pantry21!',
            database: 'pantrydb'
        });
        connection.connect(function(err){
            if(err){
                console.error('Db connection failed: ' + err.stack);
                return;
            }
            
            var username = req.body.username;
            var fullName = req.body.firstName + ' ' + req.body.lastName;
            var password;
            var saltRounds = 4;
            bcrypt.hash(req.body.new_password, saltRounds, function(err, hash) {
                console.log(hash);
                password = hash;
              });

            var sql = `UPDATE pantryUsers SET fullName = '${fullName}', username = '${username}', password = '${password}' WHERE username = '${username}'`;
            connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });  
            response.redirect('/');
        });
    });
    app.post('/createUser', function(req, response) {
    

        var connection = mysql.createConnection({
            host: 'pantrydb.cvskfciqfnj6.us-east-1.rds.amazonaws.com',
            port: '3306',
            user: 'pantryAdmin',
            password: 'Pantry21!',
            database: 'pantrydb'
        });
        connection.connect(function(err){
            if(err){
                console.error('Db connection failed: ' + err.stack);
                return;
            }
            
            var username = req.body.username;
            var fullName = req.body.fullName;
           
            var password;
            var saltRounds = 4;
            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                console.log(hash);
                password = hash;
              });
            var zipCode = req.body.zipCode;
            var numPeople = req.body.numPeople;
            var undereighteen = req.body.numMinors;
            var school = req.body.school;

            var sql = `INSERT INTO pantryUsers (fullName, username, numPeople, numMinors, zipCode, password, school) VALUES ('${fullName}', '${username}', '${numPeople}', '${undereighteen}',  '${zipCode}', '${password}', '${school}');`;   
            connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });  
            response.redirect('/');
        });
        
    
    });
    app.post('/getMaxID', function(req, response){
        var connection = mysql.createConnection({
            host: 'pantrydb.cvskfciqfnj6.us-east-1.rds.amazonaws.com',
            port: '3306',
            user: 'pantryAdmin',
            password: 'Pantry21!',
            database: 'pantrydb' 
        });
        connection.connect(function(err){
            if(err){
                console.error('Db connection failed: ' + err.stack);
                return;
            }
        });
        console.log(req.body.schoolName);
        console.log(req.body.itemName);
        connection.query(`SELECT * FROM ${req.body.schoolName} WHERE item_name = '${req.body.itemName}' LIMIT 1`, function(err, result){
            console.log(result[0]);
            if(err) throw err;
            response.send({success: true, message: String(result[0].id) + ' : ' + result[0].item_name});
        });
    });
    app.post('/loadzip', function(req, response){
        var connection = mysql.createConnection({
            host: 'pantrydb.cvskfciqfnj6.us-east-1.rds.amazonaws.com',
            port: '3306',
            user: 'pantryAdmin',
            password: 'Pantry21!',
            database: 'pantrydb'
        });
        connection.connect(function(err){
            if(err){
                console.error('Db connection failed: ' + err.stack);
                return;
            }
        });
        connection.query("SELECT * FROM pantryUsers", function(err, result){
            var zip = [];
            var zipNums = [];
            var strFinal = '';
            var avgInt = 0;
            if(err) throw err;
            for(var i = 0; i <= result.length - 1; i++){
    
                res = result[i];
                console.log(res.zipCode);
                if(zip.includes(res.zipCode)){
                    zipNums[zip.indexOf(res.zipCode)] += 1;
                }else{
                    zip.push(res.zipCode);
                    zipNums.push(1);
                }
            }
            strFinal+= 'var chart = new CanvasJS.Chart("chartContainer", {	backgroundColor: (0, 0, 0), animationEnabled: true, title: {text: "Popular Zip Codes" }, data: [{ type: "pie", startAngle: 240, yValueFormatString: "##0.00\"%\"", indexLabel: "{label} {y}", dataPoints: [';
            //{y: 79.45, label: "Google"},
            for(var i = 0; i <= zipNums.length - 1; i++){
                var num = zipNums[i];
                avgInt+= num;
                console.log(num);   
            } 
            for(var i = 0; i <= zip.length -1; i++){          
                        var elem = zip[i];
                        
                        if(!(elem === 333 || elem === '333' || elem === '' || elem === ' ')) strFinal += `{y: ${zipNums[i]/avgInt}, label: "${elem}"},`;

            }
            strFinal.replace(/_([^,]*)$/, ' ' + '$1');
            strFinal+=']}]}); chart.render();';
            response.send({success: true, message: strFinal});
        });
    });
    app.post('/loadFeedback', function(req, response){
        var arr = '';
        var connection = mysql.createConnection({
            host: 'pantrydb.cvskfciqfnj6.us-east-1.rds.amazonaws.com',
            port: '3306',
            user: 'pantryAdmin',
            password: 'Pantry21!',
            database: 'pantrydb'
        });
        connection.query('SELECT * FROM feedback', function(err, result){
            if(err) throw err;
            var arr = '';
            console.log(result);
            for(var i = 0; i<= result.length; i++){
                try{
                    var row = result[i];
                    
                    arr += `<tr><td>${row.date}</td><td>${row.paragraph}</td><td>${row.q1}</td><td>${row.q2}</td><td>${row.q3}</td><td>${row.q4}</td><td>${row.q5}</td><td>${row.q6}</td></tr>`
                }catch(e){
                    console.log('Empty User');
                    continue;
            
                }
                
                //fullName, username, numPeople, numMinors, zipCode, school
            }
            console.log(arr);
            response.send({success: true, message: arr});
        })
    });;
   
    app.post('/postFeedback', function(req, reqponse){
        var connection = mysql.createConnection({
            host: 'pantrydb.cvskfciqfnj6.us-east-1.rds.amazonaws.com',
            port: '3306',
            user: 'pantryAdmin',
            password: 'Pantry21!',
            database: 'pantrydb'
        });
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;

        //paragraph date q1-q7
        connection.query(`INSERT INTO feedback (paragraph, date, q1, q2, q3, q4, q5, q6) VALUES ('${req.body.q7}','${today}', '${req.body.q1}', '${req.body.q2}', '${req.body.q3}', '${req.body.q4}', '${req.body.q5}', '${req.body.q6}')`, function(err, result){
                if(err) throw err;
                else {
                    response.redirect('/dashboard');
                    
                }
          });
    });
 
    app.post('/postOrder', function(req, response){
        var connection = mysql.createConnection({
            host: 'pantrydb.cvskfciqfnj6.us-east-1.rds.amazonaws.com',
            port: '3306',
            user: 'pantryAdmin',
            password: 'Pantry21!',
            database: 'pantrydb'
        });
        connection.connect(function(err){
            if(err){
                console.error('Db connection failed: ' + err.stack);
                return;
            }
        });
        var itemList = req.body.items;
        if(itemList == ' ' || itemList == ''){
            itemList = 'empty order';
        }

        var name = localStorage.getItem('name');
        console.log("Items: " + itemList);
        var school = localStorage.getItem('school');
        console.log('School: ' +school);
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        var sql;
        var sql2;

        if(school.includes('Lake')){
            sql = `INSERT INTO lhsOrders (name, items, date, school) VALUES ('${name}', '${itemList}', '${today}', '${school}')`;
            //NEED TO UPDATE INVENTORY
            console.log(itemList.split(',')[0]);
            for(var i = 0; i<= itemList.split(',').length; i++){
                var elem = itemList.split(',')[i];
                if(elem == ' ' || elem == '') continue;
                sql2 = `UPDATE lhsInventory SET item_quantity = item_quantity - 1 WHERE item_name = '${elem}'`; 
                connection.query(sql2, function(error, result){
                    if(error) throw error;
                })
            }
        }else if (school.includes('Gib')){
            sql = `INSERT INTO gibsOrders (name, items, date, school) VALUES ('${name}', '${itemList}', '${today}', '${school}')`;
            //NEED TO UPDATE INVENTORY
            //item_name item_quantity school
            for(var i = 0; i<= itemList.split(',').length; i++){
                var elem = itemList.split(',')[i];
                if(elem == ' ' || elem == '') continue;
                sql2 = `UPDATE gibsInventory SET item_quantity = item_quantity - 1 WHERE item_name = '${elem}'`; 
                connection.query(sql2, function(error, result){
                    if(error) throw error;
                })
            }
        }else if(school.includes('Holl')){
            sql = `INSERT INTO hollinsOrders (name, items, date, school) VALUES ('${name}', '${itemList}', '${today}', '${school}')`;
            //NEED TO UPDATE INVENTORY
            for(var i = 0; i<= itemList.split(',').length; i++){
                var elem = itemList.split(',')[i];
                if(elem == ' ' || elem == '') continue;
                sql2 = `UPDATE hollinsInventory SET item_quantity = item_quantity - 1 WHERE item_name = '${elem}'`; 
                connection.query(sql2, function(error, result){
                    if(error) throw error;
                })
            }
        }
        connection.query(sql, function(error, results){
            if(error) throw error;
            response.send({success: true, message: 'Success'});

        });

        // now check for inventory
        var mysql1 = "SELECT * FROM lhsInventory";
        var mysql2 = "SELECT * FROM gibsInventory";
        var mysql3 = "SELECT * FROM hollinsInventory";
        var arr = 'The following items are running low on quantity at Lakewood: ';
        var lowCounter = 0;
        connection.query(mysql1, function(error, results){
            if(err) throw err;
            for(var i = 0; i<= results.length; i++){
                var row = results[i];
                if(row.item_quantity <= 10){
                    lowCounter++;
                    if(i< results.length) arr+= row.item_name + ', ';
                    else arr += row.item_name;
                }
            }
        });
        var arr = ' \n The following items are running low on quantity at Gibbs: ';
        connection.query(mysql2, function(error, results){
            if(err) throw err;
            for(var i = 0; i<= results.length; i++){
                var row = results[i];
                if(row.item_quantity <= 10){
                    lowCounter++;
                    if(i< results.length) arr+= row.item_name + ', ';
                    else arr += row.item_name;
                }
            }
        });
        var arr = '\n The following items are running low on quantity at Hollins: ';
        connection.query(mysql3, function(error, results){
            if(err) throw err;
            for(var i = 0; i<= results.length; i++){
                var row = results[i];
                if(row.item_quantity <= 10){
                    lowCounter++;
                    if(i< results.length) arr+= row.item_name + ', ';
                    else arr += row.item_name;
                }
            }
        });

        if(lowCounter>=1){
            // SEND EMAIL
            if(Number(yyyy) == 2021){
                if(Number(mm) >= 9){
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: 'food4allkidspantry@gmail.com', // generated ethereal user
                          pass: 'Pantry21!', // generated ethereal password
                        },
                      });
                      let info = transporter.sendMail({
                        from: 'food4allkidspantry@gmail.com', // sender address
                        to: "kdiazserrano@jhmi.edu", // list of receivers
                        subject: "Pantry Alerts", // Subject line
                        text: arr , // plain text body
                      });
                }
            }
            if(Number(yyyy) > 2021){
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'food4allkidspantry@gmail.com', // generated ethereal user
                      pass: 'Pantry21!', // generated ethereal password
                    },
                  });
                  let info = transporter.sendMail({
                    from: 'food4allkidspantry@gmail.com', // sender address
                    to: "kdiazserrano@jhmi.edu", // list of receivers
                    subject: "Pantry Alerts", // Subject line
                    text: arr , // plain text body
                  });
            }
            
            
        }

    });

    app.post('/auth', function(req, response) {
        var connection = mysql.createConnection({
            host: 'pantrydb.cvskfciqfnj6.us-east-1.rds.amazonaws.com',
            port: '3306',
            user: 'pantryAdmin',
            password: 'Pantry21!',
            database: 'pantrydb'
        });
        connection.connect(function(err){
            if(err){
                console.error('Db connection failed: ' + err.stack);
                return;
            }
        });
        
        var username = req.body.username;
        var password;
        var saltRounds = 4;
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            password = hash;
          });

        //'SELECT * FROM pantryUsers WHERE username="zack88690" AND password="goldhouse9"'
        var querstring = `SELECT * FROM pantryUsers WHERE username="${username}" AND password="${password}"`;
        connection.query(querstring, function(error, results) {
        
            if (results.length > 0) {
                //REDIRECT TO DASHBOARD
                console.log('RESULT SCHOOL: '+ results[0].school);
                console.log('RESULT NAME: '+ localStorage.getItem('name'));
                localStorage.setItem('name', req.body.username);
                localStorage.setItem('school', results[0].school);
                if(!(req.body.username == 'admin' &&((req.body.username.includes('adm'))))){
                    response.redirect('/studentDash');
                }
                if(req.body.username == 'admin' || req.body.username.includes('adm')){
                    response.redirect('/dashboard');    
                }

            } else {
            
            }			
            response.end();
        });
    
    });

    

  

  


}
