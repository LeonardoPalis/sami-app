function validatorRequestSensor(con, sensorId){
  return new Promise((resolve)=>{
    con.query("SELECT route FROM sensors WHERE id =\'" + sensorId + "\'", function (err, result, fields) {
      if (err){
        resolve(404);
      }else if(result.length > 0){
        resolve(200);
      }else{
        resolve(403);
      }
    });
  })
}

function validatorCreateSensor(con, sensorId){
  return new Promise((resolve)=>{
    con.query("SELECT route FROM sensors WHERE id =\'" + sensorId + "\'", function (err, result, fields) {
      if (err){
        resolve(404);
      }else if(result.length == 0){
        resolve(403);
      }else{
        resolve(409);
      }
    });
  })
}


exports.validatorRequestSensor = validatorRequestSensor;
exports.validatorCreateSensor = validatorCreateSensor;
