var output = require('../../util/Output.js');
var validator = require('../validator.js');

function saveSensor(con, vId, vName, vRoute, vRole, vType, vHubId){
  return new Promise((resolve, callbackError)=>{
    validator.validatorCreateSensor(con, vId).then((result)=>{
      if(result == 403){
        let sqlTable = "INSERT INTO sensors (id, name, route, role, type, hub_id) VALUES (\'" + vId + "\', \'" + vName + "\' ,\'" + vRoute + "\' ,\'" + vRole + "\' ,\'" + vType + "\' ,\'" + vHubId + "\')";
        con.query(sqlTable, function (err, result) {
          if (err) resolve(404);
          output.db("1 record inserted");
          resolve(200);
        });
      }else{
        resolve(result);
      }
    })
  })
}

function deleteElement(con, column){
  return new Promise((resolve, callbackError)=>{
    let sqlDrop = "DELETE FROM " + "sensors" + " WHERE id = \'" + column + "\'";
    con.query(sqlDrop, function (err, result) {
      if (err) {
        resolve(500);
        console.log(err);
      }else{
        if(result.affectedRows > 0){
          resolve(200);
        }else{
          resolve(403);
        }
      }
    });
  })
}

exports.saveSensor = saveSensor;
exports.deleteElement = deleteElement;
