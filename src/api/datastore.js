var mysql = require('mysql');
var output = require('../util/Output.js');
var datastoreSensors = require('./sensors/datastore.js');
var datastoreRequestIn = require('./request_in/datastore.js');
var constants = require('../../constants.js')
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var con = mysql.createConnection({
  host: "localhost",
  user: global.DATABASE_USER,
  password: global.DATABASE_PSW
});

con.connect(function(err) {
  try {
    con.query("CREATE DATABASE " + global.DATABASE_NAME, function (err, result) {
      if (err.code == "ER_DB_CREATE_EXISTS") {
        con = setDatatable();
        startTables();
        output.sys("DATABASE CREATED", "OK");
        output.sys("DATABASE SET IN " + global.DATABASE_NAME, "OK");
      }else if(err){
        console.error(err);
      }else{
        startTables();
        output.sys("DATABASE CREATED", "OK");
      }
    });
  } catch (err) {
      console.log(err);
  }
});

function setDatatable(){
  return con = mysql.createConnection({
    host: "localhost",
    user: global.DATABASE_USER,
    password: global.DATABASE_PSW,
    database: global.DATABASE_NAME
  });
}

function startTables(){
    var sensors_sql = "CREATE TABLE sensors (id VARCHAR(255), name VARCHAR(255), route VARCHAR(255), role VARCHAR(255), type VARCHAR(255), hub_id VARCHAR(255))";
    var online_sensors_sql = "CREATE TABLE online_sensors (id VARCHAR(255), ip VARCHAR(255), status int, type VARCHAR(255)) ";
    var users = "CREATE TABLE users (name VARCHAR(255), email VARCHAR(255)) ";
    var request_in = "CREATE TABLE request_in (id VARCHAR(255), type VARCHAR(255), date_request DATETIME, value VARCHAR(255)) ";

    // createTable(sensors_sql, "sensors");
    // createTable(online_sensors_sql, "online_sensors");
    // createTable(users, "users");
    // createTable(request_in, "request_in");
}

function deleteSensor(tableName, column){
  return datastoreSensors.deleteElement(con, column);
}

function saveSensor(vId, vName, vRoute, vRole, vType, vHubId){
  return datastoreSensors.saveSensor(con, vId, vName, vRoute, vRole, vType, vHubId);
}

function setRequest(id, type, date_request, value){
  return datastoreRequestIn.setRequest(con, id, type, date_request, value);
}

function deleteRequest(tableName, column){
  return datastoreRequestIn.deleteElement(con, column);
}

function createTable(sqlTable, tableName){
  con.query(sqlTable, function (err, result) {
    if(err){
      rl.question('Table ' + tableName + ' is already created. Do you wanna drop to update (Y/n)? ', (response) => {
        existsDatatable(response, tableName, sqlTable);
        rl.close();
      });
    }else{
      output.sys("CREATING DATATABLE " + tableName, "OK");
    }
  });
}

function dropTable(table, update, sqlTable){
  var sql = "DROP TABLE " + table;
  con.query(sql, function (err, result) {
    if (err){
      output.db("Is not possible delete table " + table);
    }else{
      output.db("Table " + table + " deleted");
      if(update){
        createTable(sqlTable, table);
      }
    }
  });
}

function insertInTable(tableName, sqlTable){
  con.connect(function(err) {
    if (err) throw err;
    con.query(sqlTable, function (err, result) {
      if (err) throw err;
      output.db("1 record inserted");
    });
  });
}

function getAllInTable(tableName){
  return new Promise((resolve, callbackError)=>{
    con.query("SELECT * FROM " + tableName, function (err, result, fields) {
      if (err) callbackError(err);
      resolve(result);
    });
  })

}


function existsDatatable(response, table, sqlTable){
  switch (response) {
    case 'Y':
        output.db("Dropping datatable...");
        dropTable(table,true,sqlTable);
      break;
    case 'y':
        output.db("Dropping datatable...");
        dropTable(table,true,sqlTable);
      break;
    case 'yes':
        output.db("Dropping datatable...");
        dropTable(table,true,sqlTable);
      break;
    case 'YES':
        output.db("Dropping datatable...");
        dropTable(table,true,sqlTable);
      break;
    case 'n':
        output.db("Database was not created!");
      break;
    case 'N':
        output.db("Database was not created!");
      break;
    case 'no':
      output.db("Database was not created!");
      break;
    case 'NO':
        output.db("Database was not created!");
      break;
    default:
      output.sys("Command not found", "IGNORED");
    break;
  }
}

exports.getAllInTable = getAllInTable;
exports.saveSensor = saveSensor;
exports.deleteSensor = deleteSensor;
exports.setRequest = setRequest;
exports.deleteRequest = deleteRequest;
