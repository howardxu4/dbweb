const sqlite3 = require('sqlite3').verbose();
const fs = require('fs')
var conf = "sql3.conf"

class Sql3 {
  constructor(_dbt) {
    this.db = new sqlite3.Database(_dbt, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Connected to the ' + _dbt + ' SQlite database.');
    });
  }
  getdb() {
    return this.db;
  }
  run(_sql, _paras, clbk) {
    if (_sql)
    this.db.run(_sql, _paras, function(err) {
      if(clbk) clbk(err, this);
    })
  }
  query(_type, _sql,  _paras, clbk) {
    if (_sql) {
      if (_type == 'get')
        this.db.get(_sql, _paras, (err, row) => {
          if (clbk) clbk(err, row)
        })
      else if (_type == 'each')
        this.db.each(_sql, _paras, (err, row) => {
          if (clbk) clbk(err, row)
        })
      else
        this.db.all(_sql, _paras, (err, row) => {
          if (clbk) clbk(err, row)
        })
    }  
  }
  close() {
    this.db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Close the database connection.');
    });
  }
}

exports.Sqdb = (function () {
    var instance;
    function createInstance() {
      try {
        data = fs.readFileSync(conf, "utf8");
        conf = JSON.parse(data)
        object = new Sql3(conf.db)
        console.log("Conf Sql3 object ")
      }
      catch(err) {
        object = new Sql3(":memory:");
        console.log("Default Sql3 object ")
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
