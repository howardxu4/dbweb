function getdata(url, clbk) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4)
      clbk( this.status, this.responseText );
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}
function sendata(method, url, str, clbk) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4)
      clbk( this.status, this.responseText );
  };
  xhttp.open(method, url, true);
  if (typeof str === 'object') {
    str = JSON.stringify(str);
    xhttp.setRequestHeader("Content-type", "application/json");
    console.log(str)
  }
  xhttp.send(str);
}
function postdata(url, str, clbk) {
  sendata('POST', url, str, clbk)
}
function putdata(url, str, clbk) {
  sendata('PUT', url, str, clbk)
}
function deletedata(url, str, clbk) {
  sendata('DELETE', url, str, clbk)
}