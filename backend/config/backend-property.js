const resp_msg = {
  "000": "successful",
  "001": "Update สำเร็จ",
  "101": "Login ไม่สำเร็จ  Auth failed",
  "102": "ระบบล็อค กรุณาทำการเปลี่ยนรหัสผ่านใหม่ และ login อีกครั้ง User lock cause login fail serveral time",
  "103": "Login fail by system",
  "104": "Update fail",

  "201": "กรุณาเปลี่ยนรหัสผ่านใหม่",
  "202": "เนื่องจากเป็นการทำรายการครั้งแรก กรุณาเปลี่ยนรหัสผ่านใหม่ โดยคลิ๊กลิงค์ ลืมรหัสผ่าน",
  "203": "รหัสผ่านหมดอายุ กรุณาเปลี่ยนรหัสผ่านใหม่",

  "204": "Incorrect user",

  "901": "Reset password	"
};

exports.getRespMsg = (_code)=>{
  return resp_msg[_code];
}
