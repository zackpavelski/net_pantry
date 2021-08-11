// Curent Tables lhsOrders, gibsOrders, hollinsOrders, lhsInventory, gibsInventory, hollinsInventory
var mysql = require('mysql');
var bcrypt = require('bcrypt');

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


    console.log('Connected!');
    var username = 'zack88690';
    var fullName = 'Zachary Pavelski';
    var password = 'goldhouse3232';
    var email = 'zack88690@gmail.com';
    var zipCode = '33712';
    var numPeople = '7';
    var minors = '3';

    var username = 'zack88690';
    var password = 'goldgouse9';
    var saltRounds = 4;

    var sqlq = "SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`='pantrydb' AND `TABLE_NAME`='orders';";
    var selectquery = "SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`='pantrydb' AND `TABLE_NAME`='orders';";
    var sql2 = "CREATE TABLE orders (id VARCHAR(100) NOT NULL AUTO INCREMENT, name VARCHAR(255), items VARCHAR(255), PRIMARY KEY(id))";
    var sql = "CREATE TABLE orders (id INT, name VARCHAR(255), items VARCHAR(255))";
    var add = "CREATE TABLE orders (id int(11) NOT NULL AUTO_INCREMENT, name VARCHAR(100), items VARCHAR(255), date VARCHAR(255), PRIMARY KEY(id))"

    connection.query("SELECT * FROM feedback", function(err, result){
        if(err) throw err;
        console.log(result);
    });

    /*connection.query("CREATE TABLE feedback (id int(11) NOT NULL AUTO_INCREMENT, paragraph VARCHAR(1000), date VARCHAR(50), PRIMARY KEY(id))", function(err, result){
        if (err) throw err
        console.log(result);
    })*/

    /*connection.query("Drop TABLE orders", function(err, result){
        if (err) throw err
        console.log(result);
    });*/

    /*connection.query("DESCRIBE lhsOrders", function(err, result){
        if (err) throw err
        console.log(result);
    });

    connection.query("DESCRIBE lhsInventory", function(err, result){
        if (err) throw err
        console.log(result);
    });




    connection.query(" ALTER table pantryUsers add column (school varchar(50));", function(err, result){
        if (err) throw err
        console.log(result);
    })

    */

    /*connection.query("SELECT * FROM gibsInventory", function(err, result){
        if (err) throw err
        console.log(result);
    });*/

 


});
