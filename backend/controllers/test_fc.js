
function test_fc() {
  // var str  = "005441 - 2 รัชดาวรรณ สวัสดิมานนท์"
  var str  = "005441 - รัชดาวรรณ สวัสดิมานนท์"
  // var str  = "รัชดาวรรณ สวัสดิมานนท์"

  str = str.replace(/\s/g, '');
  var acceptBy_splited = str.split("-");

  // console.log("[1] " + _splited[1][0]);

  // if[_splited[1] ]

  var IT_SAcode_external =""

  if(acceptBy_splited.length>1){
  IT_SAcode_external = acceptBy_splited[0]

  if (Number(acceptBy_splited[1][0])) {
    IT_SAcode_external = IT_SAcode_external+"-"+acceptBy_splited[1][0]
  }

}

  // if(_splited[1][0]){
  //    console.log("EXT >>" +_splited[1][0])
  //   IT_SAcode_external = IT_SAcode_external+"-"+_splited[1][0]
  // }

  console.log(">> " + IT_SAcode_external);

}

test_fc();
