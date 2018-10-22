
var express = require('express');
var router = express.Router();
const m=require("./msql")
const sq=require("./sql3")

TABLE_LIST="SELECT name FROM sqlite_master WHERE type='table'"
TABLE_SQL="SELECT sql FROM sqlite_master WHERE name=?"
TABLE_QUERY="SELECT * FROM ?"

router.get('/sqlit3', (req, res) => {
    sql = TABLE_LIST
    qdb = sq.Sqdb.getInstance()
    qdb.query('all', sql, [], (err, msg) => {
        if (err)
            res.send(err)
        else {
            r = []
            for(i in msg)
                r.push(Object.values(msg[i])[0])
            res.send(r)
        }})
    })

router.get('/sqlit3/:tblnm', (req, res) => {
    sql = TABLE_SQL
    qdb = sq.Sqdb.getInstance()
    qdb.query('all', sql, [req.params.tblnm], (err, msg) => {
        if (err)
            res.send(err)
        else
            res.send(msg)})
    })

router.get('/sqlit3/:tblnm/:offset/:page', (req, res) => {
    opt = req.params.offset
    ppg = req.params.page
    if (opt == 'cnt')
        sql = "select count(*) from " + req.params.tblnm
    else 
        sql = "select * from " + req.params.tblnm + " limit " + ppg + " offset " + opt
    qdb = sq.Sqdb.getInstance()
    qdb.query('all', sql, [], (err, msg) => {
        if (err)
            res.send(err) 
        else
            res.send(msg)})
    })
 
router.post('/sqlit3/query/:st', (req, res) => {
    sql = req.params.st.replace(/_/g, ' ')
    qdb = sq.Sqdb.getInstance()
    qdb.query('all', sql, [], (err, msg) => {
        if (err) {
            console.log(err)
            console.log(JSON.stringify(err))
            res.send(err)
        }
        else
            res.send(msg)
        })
    })

function run_sqlt3(sql, res) {
    qdb = sq.Sqdb.getInstance()
    console.log(sql)
    qdb.run(sql, [], (err, msg) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        else
            res.send(msg)
        })
    }

/**************************************/

router.get('/mysql', (req, res) => {
    sql = "show tables"
    mdb = m.Msdb.getInstance()
    mdb.run(sql, [], (err, msg) => {
        r = []
        for(i in msg)
            r.push(Object.values(msg[i])[0])
        res.send(r)
        })
    })

router.get('/mysql/:tblnm', (req, res) => {
    sql = "desc " + req.params.tblnm
    mdb = m.Msdb.getInstance()
    mdb.run(sql, [], (err, msg) => {   
        res.send(msg)})
    })

router.get('/mysql/:tblnm/:offset/:page', (req, res) => {
    opt = req.params.offset
    ppg = req.params.page
    if (opt == "cnt")
        sql = "select count(*) from " + req.params.tblnm
    else { 
        sql = "select * from " + req.params.tblnm + " limit " + ppg + " offset " + opt
    } 
    mdb = m.Msdb.getInstance()
    mdb.query(sql, [], (err, msg) => {   
        res.send(msg)
        })
    })

router.post('/mysql/query/:st', (req, res) => {
    sql = req.params.st.replace(/_/g, ' ')
    mdb = m.Msdb.getInstance()
    mdb.query(sql, [], (err, msg) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        else
            res.send(msg)
        })
    })

function run_mysql(sql, res) {
    mdb = m.Msdb.getInstance()
    console.log(sql)
    mdb.run(sql, [], (err, msg) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        else
            res.send(msg)
        })
    }

/***************************************/

router.post('/myadd/:dbnm/:tblnm', (req, res) => {
    body = req.body
    names = " ("
    values = ""
    Object.keys(body).forEach( (key, index) => {
        if (body[key] != 'null') {
            names += key + " ,"
            values += body[key] + " ,"
        }
        })
    sql = "INSERT INTO " + req.params.tblnm + names.substr(0, names.length-1) 
        + ") VALUES (" + values.substr(0, values.length-1) + ")"
    if (req.params.dbnm == 'Mysql')
        run_mysql(sql, res)
    else
        run_sqlt3(sql, res)
    })

router.put('/myupt/:dbnm/:tblnm', (req, res) => {
    data = req.body['data']
    keys = req.body['keys']
    sql = "UPDATE " + req.params.tblnm + " SET "
    Object.keys(data).forEach( (key, index) => {
        if (index > 0) sql += ","
        sql += key + " = " + data[key]
        })
    sql += " WHERE "
    Object.keys(keys).forEach((key, index) => {
        if (index > 0) sql += " AND "
        sql += key + " = " + keys[key]
        })
    if (req.params.dbnm == 'Mysql')
        run_mysql(sql, res)
    else
        run_sqlt3(sql, res)
    })

router.delete('/mydel/:dbnm/:tblnm', (req, res) => {
    body = req.body
    sql = "DELETE FROM " + req.params.tblnm + " WHERE "
    Object.keys(body).forEach( (key, index) => {
        if (index > 0) sql += " AND "
        sql += key + " = " + body[key]
        })
    if (req.params.dbnm == 'Mysql')
        run_mysql(sql, res)
    else
        run_sqlt3(sql, res)
    })

module.exports = router;