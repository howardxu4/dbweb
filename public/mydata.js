
function showmsg(msg) {
    if (tobj) {
        clearTimeout(tobj)
        tobj = null
    }
    $("#msg").html(msg)
    tobj = setTimeout(()=>{$("#msg").html('');}, 11000)
}
// global variable
var tobj = null
var cdesc = null
var crecd = null
var ckeyv = null
var colst = null
var tblst = null
var dbs = {'Mysql': null,
        'Sqlit3': null }

function getdb(dbnm) {
    getdata('/'+dbnm, function(stat, data){
        if (stat == 200) {
            tblst = JSON.parse(data)
            dbs[dbnm] = {}
            for (i in tblst)
                dbs[dbnm][tblst[i]]= null
            dblst()
        }
        else
            showmsg("error: " + stat)
    })       
}
function getbl(dbnm, tblnm) {
    getdata('/' + dbnm + '/' + tblnm, (stat, data) => {
        if (stat == 200) {
            dbs[dbnm][tblnm] = {"schema" : data.replace(/\\r\\n/g, "<br>").replace(/\\t/g, "&nbsp;")}
            dbs[dbnm][tblnm]["cols"] = getcols(dbs[dbnm][tblnm]["schema"])
            $('#schema').html(dbs[dbnm][tblnm]["schema"])
            cdesc = dbs[dbnm][tblnm]["cols"]
            colst = Object.keys(cdesc)
        }
        else
            showmsg("error: " + stat)
    })    
}
function getdefs(line)
{
    s = ""
    u = ""
    Object.keys(line).forEach( (key, index) => {
        switch (key) {
            case "Field":
            break;
            case "Type":
            s += line[key].toUpperCase()
            break;
            case "Null":
            if (line[key] == "NO") u = " NOT NULL"
            break;
            case "Key":
            if (line[key]) s += " " + line[key].toUpperCase() + " KEY"
            break;
            default:
            if (line[key]) s += " " + line[key].toUpperCase()
            break;
        }
    })
    return s + u
}
function getcols(colstr) {
    colobj = {}
    jcol=JSON.parse(colstr)
    if (jcol[0]['sql']) {
        flst = jcol[0]['sql'].split('<br>')
        if (flst.length == 1) {
            l = flst[0].split('(')[1]
            cols = l.substr(0,l.length-1).split(",")
            for (k in cols) colobj[cols[k]] = null
        }
        else {
            for(i in flst) {
                l = flst[i].trim()
                if (l[0] == '[') {
                    cols = l.split(']')
                    colobj[cols[0].substring(1)] = cols[1].replace(',', '')
                }
            }
        }
    }
    else {
        for (i in jcol)
            colobj[jcol[i]['Field']] = getdefs(jcol[i])
    }
    //console.log(JSON.stringify(colobj))
    return colobj
}
function buildlst(lst, funcstr, tb0str=null){
    var s = ""
    for (var i in lst) {
        if(i == 0 && tb0str)
            s+= "<li><a id='" + tb0str + "' href='#' onclick=\"" + funcstr + "('" + lst[i] + "')\">" + lst[i] + "</a></li>"
        else               
            s+= "<li><a href='#' onclick=\"" + funcstr + "('" + lst[i] + "')\">" + lst[i] + "</a></li>"
    }
    return s
}
function buildresp(data) {
    var s = "<table border=1>"
    if (Array.isArray(data)) {
        for (i in data) {
            var line = data[i]
            if (i == 0) {
                s +='<tr>'
                Object.keys(line).forEach( (key, index) => {
                    s += "<th>" + key + "</th>"
                })
                s += "</tr>"
            }
            s += "<tr>"
            Object.values(line).forEach( (value, index) =>{
                s += "<td>" + value + "</td>"
            })
            s += "</tr>"
        }
    }
    else {
        s += "<tr><th>Name</th><th>Value</th></tr>"
        Object.keys(data).forEach( (key, index) => {
            s += "<tr><td>" + key + "</td><td>" + data[key] + "</td></tr>"
        })
    } 
    return s + "</table>"
}
function buildfield(key, value) {
    ftype = cdesc[key]
    s = "<tr><td>" + key + "</td>"
    s += "<td> " + ftype + "</td>"
    s += "<td>" + value + "</td>"
    if (ftype && ftype.includes('KEY') && ftype.includes('PRI')) {
        ckeyv = {}
        ckeyv[key] = value
        if (ftype.includes('AUTO'))
            return s += "<td></td></tr>"
    }
    return s += "<td> <input type='text' value='" + value + "'></input></td></tr>"
}
function buildedit() {
    ckeyv = null
    $("#upt").attr("disabled", !crecd)
    $("#del").attr("disabled", !crecd)
    var s = "<table id='recd' border=1>"
    s += "<tr><th> Name </th><th> Desc</th><th> Value</th><th> New Value</th></tr>"
    var line = crecd
    if (line)
        Object.keys(line).forEach((key, index) => {
            s += buildfield(key, line[key])
        })
    else 
        Object.keys(cdesc).forEach((key, index) => {
            s += buildfield(key, "")
        })
    return s + "</table>"
}
function showdb(dbnm) {
    $('#dbs').html (dbnm)
    if (dbs[dbnm] == null){
        getdb(dbnm)
    }
    else {
        tblst = Object.keys(dbs[dbnm])
        dblst()
    }
}
function dblst() {
    var s = "<p>Select Table</p><ul>"
    s += buildlst(tblst, "showtbl", "tb0")
    $('#dblist').html(s+"</ul>")
    $('#tb0').trigger('click');
}
function showcol() {
    $('#clst').html(buildlst(colst, "append")) 
}
function chgtbl(tblnm) {
    $('#tbl').html(tblnm)
    dbnm = $('#dbs').html() 
    if (dbs[dbnm][tblnm] == null)
        getbl(dbnm, tblnm)
    else {
        $('#schema').html(dbs[dbnm][tblnm]["schema"])
        cdesc = dbs[dbnm][tblnm]["cols"]
        colst = Object.keys(cdesc)
    }
}
function showtbl(tblnm){
    chgtbl(tblnm)
    setTimeout(showcol, 500)
}
function setbl(tblnm){
    chgtbl(tblnm)
    setTimeout(showctl(-1), 500)
}
function swtbl(){
    $("#mlst").html( buildlst(tblst, "setbl"))
    $("#elst").html( buildlst(tblst, "setbl"))
    showctl(-1)
}
function setctl(d){
    const page = parseInt($("#pgn").val())
    t = parseInt($('#ttl').html())
    c = parseInt($('#cnm').val())
    c += d * page 
    if (c >= t) c = t-1
    if (c < 0) c = 0
    showctl(c)
}
function setrec(d){
    t = parseInt($('#ettl').html())
    c = parseInt($('#ecnm').val())
    c += d
    if (c >= t) c = t-1
    if (c < 0) c = 0
    $('#ecnm').val(c)
    showrec(c)
}
function swedit() {
    swtbl()
}
function cancel(){
    var st = $("#st").val().split(' ')
    st.pop()
    $("#st").val(st.join(' '))
}
function append(s) {
    var v = $("#st").val()
    $("#st").val(v + " " + s)           
}
function seltb(tblnm) {
    showtbl(tblnm)
    append(tblnm)
}
function swsql(){
    $("#tlst").html(buildlst(tblst, "seltb"))
    $('#clst').html(buildlst(colst, "append"))  
}
function showctl(n) {
    if (n == -1) {
        var url = '/' + $('#dbs').html() + '/' + $('#tbl').html() + '/cnt' + '/*'
        getdata(url, (stat, data) => {
            if (stat == 200) {
                data = JSON.parse(data)
                t = data[0]['count(*)']
                $('#ttl').html(t)
                $('#bgn').html("<input type='number' value='0' id='cnm' min='0' max='" + (t-1) + "'></input>")
                $("#ettl").html(t)
                $('#ebgn').html("<input type='number' value='0' id='ecnm' min='0' max='" + (t-1) + "'></input>")
                showcont(0)
                showrec(0)
            }
            else
                showmsg("error; " + stat)
        })
    }
    else {
        $("#cnm").val(n)
        showcont(n)
    }
}
function showrec(n){
    var url = '/' + $('#dbs').html() + '/' + $('#tbl').html() + '/' + n + '/1'
    getdata(url, (stat, data) => {
        if (stat == 200) {
            crecd = JSON.parse(data)[0]
            $('#edit').html(buildedit())
        }
        else
            showmsg("error; " + stat)
    })
}
function showcont(n){
    var url = '/' + $('#dbs').html() + '/' + $('#tbl').html() + '/' + n + '/' + $('#pgn').val()
    getdata(url, (stat, data) => {
        if (stat == 200) {
            data = JSON.parse(data)
            $('#content').html(buildresp(data))
        }
        else
            showmsg("error; " + stat)
    })
}
function chkeyw(sql) {
    SQL = sql.toUpperCase()
    keywords = ['INSERT','UPDATE','DELETE','CREATE','ALTER','DROP']
    for ( i in keywords) 
        if (SQL.includes( keywords[i])) 
            return true
    return false
}
function showquery(dbnm, st) {
    var st = $("#st").val()
    if (chkeyw(st))
        if (!confirm("Your SQL statement may change the DB, Are you sure you want to take this risk?")) return
    var url = '/' + $('#dbs').html() + '/query/' + st.replace(/ /g, '_') 
    postdata(url, '', function(stat, data){
        if (stat == 200) {
            data = JSON.parse(data)
            $('#result').html(buildresp(data))
        }
        else
            showmsg("error; " + stat)             
    })  
}
function getnrec() {
    nrecd = {}
    $('#recd tr').each(function() {
        v = $(this).find('input').val()
        if (v != undefined) 
            nrecd[$(this).find('td').html()] = v
    });
    return nrecd
}
function getdiff(nrecd){
    drecd = {}
    if (crecd)
        Object.keys(crecd).forEach((key, index)=>{
            if(nrecd[key]) 
                if (crecd[key] != nrecd[key]) 
                    if (!(crecd[key] == null && nrecd[key] == 'null'))
                        drecd[key] = nrecd[key]
    })
    return drecd
}
function preprecd(recd) {
    Object.keys(recd).forEach( (key, index) => {
        ftype = cdesc[key]
        if (ftype)
            if (ftype.includes('INT') || ftype.includes('NUM') || ftype.includes('DECI'))
                ;
            else if (recd[key] != null && recd[key] != 'null') {
                if (ftype.includes('DATE')) recd[key] = recd[key].split('T')[0]
                recd[key] = "'" + recd[key] + "'";
            }
    })
    return recd
}
function realcall(func, url, recd) {
    func(url, recd, (stat, data) => {
        if(stat == 200) {
            $("#resp").html(data)
            showctl(-1)
        }
        else
            showmsg("error: " + stat)
    })       
}
function calladd() {
    var url = '/myadd/' + $('#dbs').html() + '/' + $('#tbl').html()
    nrecd = getnrec()
    drecd = getdiff(nrecd)
    if(Object.keys(drecd).length == 0) 
        showmsg("Warning: Same data as current")
    else 
        realcall(postdata, url, preprecd(nrecd))
}
function callupt() {
    var url = '/myupt/' + $('#dbs').html() + '/' + $('#tbl').html()
    nrecd = getnrec()
    drecd = getdiff(nrecd)
    if (Object.keys(drecd).length == 0) 
        showmsg("Warning: Nothing changed")
    else {
        uptkey = ckeyv?ckeyv:crecd
        urecd = {"keys": preprecd(uptkey), "data": preprecd(drecd)}
        realcall(putdata, url, urecd)
    }
}
function calldel() {
    var url = '/mydel/' + $('#dbs').html() + '/' + $('#tbl').html()
    delkey = ckeyv?ckeyv:crecd
    realcall(deletedata, url, preprecd(delkey))
}
function disp(n) {
    messages = ['This is a SQL database browser web application',
        'The configuration of database: provide sql3.conf or msql.conf to server',
        'Database view: select database and table to show the table schema',
        'Table view: select table in current database to show table content',
        'Record view: create, read, update, delete row data in selected table',
        'SQL view: using SQL key words to construct query statement and show result',
        'About this web application: simple demo for using bootstrap, nodejs, SQL modules']
    showmsg(messages[n])
}
$(document).ready(function() {
    $("#db0").trigger('click');
    $("#resp").dblclick(()=>{$("#resp").html('')})
    $("#cmdlst").html(buildlst(['UPDATE','DELETE','INSERT INTO','VALUES','GROUP BY','HAVING','ORDER BY','JOIN','INNER','LEFT','RIGHT','FULL','UNION'],"append"))
    $("#fnclst").html(buildlst(['LIMIT','OFFSET','MAX','COUNT','AVG','SUM','DATE','TIME','NOW'],"append"))
    $("#oplst").html(buildlst(['(','*',')','=','<>','>','<','>=','<=','BETWEEN','LIKE','IN','OR','AND','NOT'],"append"))
    $("#admlst").html(buildlst(['CREATE','ALTER','DROP','DATABASE','TABLE','INDEX'],"append"))
})
