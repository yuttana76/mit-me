

export  function validStr(val){
  if (val !== undefined && val !== null) {
    // v has a value
    return val;
  } else {
    // v does not have a value
    return '';
  }
}
