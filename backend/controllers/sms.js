const readline = require('readline');
const fs = require('fs');
const dbConfig = require('../config/db-config');
var request = require("request");
var logger = require("../config/winston");
const smsConfig = require('../config/sms-conf');

/*
  smsCust.txt
*/
exports.smsDeb = (req, res, next) =>{

  // first msg
  // let msg = `หุ้นกู้ระยะยาวของบริษัท เนชั่นแนล เพาเวอร์ ซัพพลาย จำกัด (มหาชน) (NPS)
  // Credit Rating : BBB- (Stable) by TRIS

  // ระยะเวลา : 3.5 ปี
  // อัตราดอกเบี้ย : 5.50% ต่อปี
  // จ่ายดอกเบี้ยทุกสามเดือน
  // หลักประกัน : ไม่มี
  // วันจอง : 23-26 กันยายน 2562

  // สนใจติดต่อ 02-6606689
  // บล. เมอร์ชั่น พาร์ทเนอร์ (ผู้ร่วมจัดจำหน่าย)
  // `;

  // let msg = `หุ้นกู้มีประกันของบริษัท แมกโนเลีย ควอลิตี้ ดีเวล็อปเม้นต์ คอร์ปอเรชั่น จำกัด
  // อายุ  :  2.5 ปี
  // อัตราดอกเบี้ย  :  6.90% ต่อปี
  // งวดการจ่ายดอกเบี้ย  :  ทุก ๆ 3 เดือน
  // ระยะเวลาการเสนอขาย  :  13-14, 17 กุมภาพันธ์ 2563
  // ผู้ค้ำประกัน  :  บริษัท ดีทีจีโอ คอร์ปอเรชั่น จำกัด
  // สอบถามเพิ่มเติมได้ที่ 02-660-6646
  // `;

  // let msg = `หุ้นกู้ MJD ชนิดไม่ด้อยสิทธิ ไม่มีประกัน
  // อายุ  :  2 ปี 9 เดือน
  // อัตราดอกเบี้ย  :  6.80% ต่อปี
  // จ่ายดอกเบี้ย  :  ทุก ๆ 3 เดือน
  // ระยะเวลาการเสนอขาย  :  20 และ 23-24 มีนาคม 2563
  // การจัดอันดับความน่าเชื่อถือ  :  ของบริษัท BB+/Stable โดยบริษัท ทริส เรทติ้ง จำกัด
  // สอบถามเพิ่มเติมได้ที่
  // เมอร์ชั่น พาร์ทเนอร์
  // 02-660-6689
  // `;

  let msg = `ขอเชิญร่วมสัมมนา Online ผ่าน Zoom Webinar
หัวข้อ Second half 2020 : Post-pandemic investment outlook
วันที่ 30 มิ.ย. 63 เวลา 14.00 – 15.30 น.
ลงทะเบียนร่วมงาน https://us02web.zoom.us/webinar/register/WN_3KqRhboaTmmf3IrDV4c55w
หรือโทร. 02-6606644

  `;


  var today = new Date();
  var date = today.getFullYear()+""+(today.getMonth()+1)+""+today.getDate();
  var time = today.getHours() +""+  today.getMinutes()
  // var time = today.getHours() + "-" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+''+time;

  const readPath = __dirname + '/readFiles/sms/';
  const readFile = 'smsCust.txt';

  const bakPath = __dirname + '/readFiles/smsBackup/';
  const bakFile =  dateTime+'-'+readFile;

  let checkFile = readline.createInterface({
    input: fs.createReadStream(readPath+readFile)
  });

  checkFile.on('error', function(){ /*handle error*/
    res.status(400).json({ message: `${readFile} File not found` });
  });

  // Check data is correct
  let line_no = 0;
  let numData = 0;

  checkFile.on('line', function(line) {
    line_no++;

    //Get number of data in line #1
    if (line_no == 1){
      numData = line;
    }
  });

  // end

  checkFile.on('close', function(line) {

      if(((line_no-1) == numData) && (numData != 0) ){

        line_no = 0;
        let rFile = readline.createInterface({
          input: fs.createReadStream(readPath+readFile)
        });

        rFile.on('line', function(line) {
            line_no++;
            // console.log('line_no >>:' + line_no);
            if(line_no >1){
              var array = line.split("|");
              // console.log('ARRAY >> ID:' + array[1] + ' ;Mobile:' + array[2] );
              logger.info('Call smsStreamingCustFile API  to ' + array[2]);

              // // SMS
              smsStreaming(array[2],msg).then(data=>{
                // logger.info('Complete SMS  ' + array[2]);

              },err=>{
                res.status(400).json({
                  message: err,
                  code:"999",
                });
              });

            }
        });

        // end
        rFile.on('close', function(line) {
          console.log('Total lines : ' + line_no);

          //Move file to Backup
          fs.rename(readPath+readFile, bakPath+bakFile,  (err) => {
            if (err) throw err;
            console.log('Rename/Move complete!');
          });

        });

        res.status(200).json('Send SMS completed');
      }else{
        console.log('Data incorrect ; data lines =' + (line_no-1) + ' ;Header =' + numData );
        res.status(501).json({ message: 'Data incorrect' });
      }
   });

}


function smsStreaming(mobile,msg){

  return new Promise(function(resolve, reject) {
    var _url = smsConfig.SMSCompleteURL2(mobile,msg);

    var options = {
      url: _url,
      headers: {
          'User-Agent': 'request'
      }
    };

        request.get(options, function(err, resp, body) {
          if (err) {
            console.log("SMS ERR>" + JSON.stringify(err));
              reject(err);
          } else {
            console.log("SMS RS>" + JSON.stringify(body));
              resolve(body);
          }
      });

  });
}
