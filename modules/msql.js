const mysql = require('mysql');
const fs = require('fs')
var conf = "msql.conf"

class Msql {
  constructor(_host,_user,_password, _db) {
    this.con = mysql.createConnection({
      host: _host,
      user: _user,
      password: _password,
      database: _db
    });
    this.conn = false
  }
  connect(clbk) {
    if(!this.conn){
      this.con.connect(function(err) {
        if (err) {
          console.log(this.conn)
        }
        this.conn = true;
      });
    }
  }
  run(_sql, paras, clbk) {
    this.connect(clbk);
    if(_sql)
      this.con.query(_sql, paras, function(err, result){
        if(clbk) clbk(err, result);
      })
  }
  query(_sql, paras, clbk) {
    this.connect();
    if (_sql)
      this.con.query(_sql, paras, function (err, result, fields) {
        if(clbk) clbk(err, result, fields);
      });
  }
}

exports.Msdb = (function () {
    var instance;
    function createInstance() {
      try {
        data = fs.readFileSync(conf, "utf8");
        conf = JSON.parse(data)
        object = new Msql(conf.host, conf.user, conf.password, conf.database)
        console.log("Conf Msql object ")
      }
      catch(err) {
        object = new Msql("localhost", "user", "password", "db");
        console.log("Default Msql object ")
      }
      return object
    }
    return {
        getInstance: function () {
            if (!instance) {
              instance = createInstance();
            }
            return instance;
        }
    };
})();
