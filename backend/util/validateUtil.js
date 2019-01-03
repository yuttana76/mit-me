

exports.validStr = (val) =>{
  if (val !== undefined && val !== null) {
    // v has a value
    return val;
  } else {
    // v does not have a value
    return '';
  }
}


/**
*	Usage: 	number_format(123456.789, 2);
*	result:	123,456.79
**/

// *************************************
exports.number_format = (number, decimals) =>{

  if( !number){
    return '';
  }

  number = Number(number).toFixed(decimals);
  var parts = number.toString().split(".");
  number = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");


  return number;
}
