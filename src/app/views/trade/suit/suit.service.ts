import { Injectable } from '@angular/core';
import { Question } from '../model/question.model';
import { Choice } from '../model/choice.model';
// import { Choice, Question } from '../suit-tree-view/questionBAK';


@Injectable({
  providedIn: 'root'
})
export class SuitFormService {

  from_title = 'Customer Infomation';
  from_suit_title = 'แบบมาตราฐานในการประเมินความเหมาะสมในการลงทุน';
  from_fatca_title = 'U.S. National Identification';
  fatca_desc = 'แบบแจ้งสถานะความเป็นบุคคลอเมริกัน/ไม่เป็นบุคคลอเมริกัน';


  addNewBtn = 'New survey';
  suitSerieId = '2019-01';

  setSuitSerieId(val){
    this.suitSerieId = val;
  }
  STEPER_1 = 'ข้อมูลส่วนบุคคล';
  STEPER_2 = 'ที่อยู่';
  STEPER_FATCA = 'FATCA';
  STEPER_3 = 'Suitability';
  STEPER_4 = 'Done';


  register_addr_title ='ที่อยู่ตามทะเบียนบ้าน';
  register_addr_title_ENG ='Residence Registration Address/Address in home country';

  work_addr_title ='ที่อยู่ที่ทำงาน';
  work_addr_title_ENG ='Workplace Address';
  contact_addr_title = 'ที่อยู่ที่ติดต่อได้ ';
  contact_addr_title_ENG = 'Contact Address';

  mail_addr_title = 'ที่อยู่สำหรับจัดส่งเอกสาร';
  mail_addr_title_ENG = 'Mailing Address';

  label_Email = 'อีเมล์'
  label_Email_ENG = 'E-mail'

  label_addrAs_reg = 'ตามทะเบียนบ้าน'
  label_addrAs_reg_ENG = 'Same as Residence Registration Address'

  label_addrAs_work = 'ตามที่่ทำงาน'
  label_addrAs_work_ENG = 'Same as Workplace Address'

  label_addrAs_curr = 'ตามที่อยู่ที่ติดต่อได้ '
  label_addrAs_curr_ENG = 'Same as Contact Address'

  label_addr_oth = 'อื่นๆ (โปรดระบุ)'
  label_addr_oth_ENG = 'Other (Please specify)'

  SUIT_ANS_INCOMPLETE = ' Suit survery incomplete !';
  STEPPER_FINAL_CONFIRM= 'โปรดตรวจสอบและ บันทึกข้อมูล \n Please review and save your data.';
  // STEPPER_FINAL_THANK= ' Thank you, For you infomation.';
  FINAL_MSG = '';

  STEPPER_FINAL_THANK= ' ขอขอบคุณสำหรับข้อมูล และความไว้วางใจที่เลือกใช้บริการจากเรา.';

  SAVE_INFO = 'Information';
  SAVE_COMPLETE = 'Save complete';
  SAVE_INCOMPLETE = 'Save  incomplete';
  SUIT_SAVE_COMPLETE = ' Save suitability complete';
  SUIT_SAVE_INCOMPLETE = ' Save suitability incomplete';
  FATCA_SAVE_COMPLETE = ' Save FATCA complete';
  FATCA_SAVE_INCOMPLETE = ' Save FATCA incomplete';

  DATA_INCOMPLETE = 'กรอกข้อมูลไม่สมบูรณ์ ';
  DATA_INCOMPLETE_MSG = 'กรุณากรอกข้อมูลสำคัญ(*)  Please fill require (*) data';

  DO_SUIT_MSG='กรุณาทำแบบประเมินความเสี่ยง';
  NO_SUIT_MSG='ไม่พบข้อมูลการทำประเมินความเสียง. กรุณาทำแบบประเมินความเสี่ยง';
  EXP_SUIT_MSG='ข้อมูลประเมินความเสี่ยงใกล้ครบกำหนดเวลาต้องประเมินใหม่  กรุณาทำแบบประเมินความเสี่ยง';
  SUIT_EXP_DAY = 700;

  // Label
  REQ_MODIFY = 'ต้องการแก้ไขข้อมูล';
  label_idCard = 'ID Card';
  label_Welcome = 'Welcome';
  label_verify_dob = 'ยืนยันโดย วันเดือนปีเกิด ';
  label_verify_dob_ENG = '- Verify by date of birth';

  label_verify_otp = 'ยืนยันโดย OTP';
  label_verify_otp_ENG = 'Verify by OTP';

  label_Request_otp = 'ส่ง OTP';
  label_input_verify_dob =  'วันเดือนปีเกิด - Your date of birth';
  label_verify_dob_Format = 'รูปแบบ ddmmyyyyy  (ตัวอย่าง = 01012019)';
  label_input_verify_OTP =  'OTP';
  label_RiskLevel = 'ผลประเมินความเสี่ยงระดับ';
  label_EvaluatedDate = 'วันที่ประเมิน';



    // Button
    LABEL_SEARCH = 'ค้นหา ';
    LABEL_SEARCH_ENG = 'Search';

    LABEL_EXIT = 'ออกจากระบบ Logout';
    LABEL_Verify = 'ยืนยัน Verify';
    LABEL_BACK = 'กลับ Back';
    LABEL_NEXT = 'ต่อไป Next';
    LABEL_SAVE = 'บันทึก Save';
    LABEL_CALCULATE = 'ประเมินผล Calculate';
    LABEL_CANCEL = 'ยกเลิก Cancel';
    LABEL_OK = 'ตกลง OK';
    label_NewSurvey = 'ทำประเมิน ความเสี่ยง New Survey';
    LABEL_EVA_AGAIN = 'ประเมินใหม่ Do again';
    LABEL_EVA_CONF = 'ยืนยันการประเมิน';


  //Dialog
  label_Confirm = 'โปรดยืนยัน Confirmation'
  label_Confirm_logout = 'ยืนยันออกจากระบบกด OK  ยกเลิกกด Cancel  '

  // SUITABILITY QUESTIONS (START)
  suit_q1 = new Question('1', 'ปัจจุบันท่านอายุ', '',''
  , false,true,true,
    [
      new Choice('1', 'มากกว่า 55 ปี', 1),
      new Choice('2', '45 - 55 ปี', 2),
      new Choice('3', '35 - 44 ปี', 3),
      new Choice('4', 'น้อยกว่า 35 ปี', 4),
    ]
    );

  // tslint:disable-next-line:max-line-length
  suit_q2 = new Question('2', 'ปัจจุบันท่านมีภาระทางการเงินและค่าใช้จ่ายประจำ เช่น ค่าผ่อนบ้าน รถ ค่าใช้จ่ายส่วนตัว และค่าเลี้ยงดูครอบครัวเป็นสัดส่วนเท่าใด', '',''
  , false,true,true,
    [
      new Choice('1', 'มากกว่าร้อยละ 75 ของรายได้ทั้งหมด', 1),
      new Choice('2', 'ระหว่างร้อยละ 50 ถึงร้อยละ 75 ของรายได้ทั้งหมด', 2),
      new Choice('3', 'ระหว่างร้อยละ 25 ถึงร้อยละ 50 ของรายได้ทั้งหมด', 3),
      new Choice('4', 'น้อยกว่าร้อยละ 25 ของรายได้ทั้งหมด', 4),
    ]
    );


  // tslint:disable-next-line:max-line-length
  suit_q3 = new Question('3', 'ท่านมีสถานภาพการเงินในปัจจุบันอย่างไร', '',''
  , false,true,true,
    [
      new Choice('1', 'มีทรัพย์สินน้อยกว่าหนี้สิน', 1),
      new Choice('2', 'มีทรัพย์สินเท่ากับหนี้สิน', 2),
      new Choice('3', 'มีทรัพย์สินมากกว่าหนี้สิน', 3),
      new Choice('4', 'มีความมั่นใจว่ามีเงินออมหรือเงินลงทุนเพียงพอสำหรับการใช้ชีวิตหลังเกษียณอายุแล้ว', 4),
    ]);


  // tslint:disable-next-line:max-line-length
  suit_q4 = new Question('4', 'ท่านเคยมีประสบการณ์ หรือมีความรู้ในการลงทุนในทรัพย์สินกลุ่มใดต่อไปนี้บ้าง (เลือกได้มากกว่า 1 ข้อ)', '',''
  , true,true,true,
    [
      new Choice('1', 'เงินฝากธนาคาร ', 1),
      new Choice('2', 'พันธบัตรรัฐบาล หรือกองทุนรวมพันธบัตรรัฐบาล ', 2),
      new Choice('3', 'หุ้นกู้ หรือกองทุนรวมตราสารหนี้ ', 3),
      new Choice('4', 'หุ้นสามัญ หรือกองทุนรวมหุ้น หรือสินทรัพย์อื่นที่มีความเสี่ยงสูง', 4),
    ]);

  // tslint:disable-next-line:max-line-length
  suit_q5 = new Question('5', 'ระยะเวลาที่ท่านคาดว่าจะไม่มีความจำเป็นต้องใช้เงินลงทุนนี้', '',''
  , false,true,true,
    [
      new Choice('1', 'ไม่เกิน 1 ปี ', 1),
      new Choice('2', '1 ถึง 3 ปี', 2),
      new Choice('3', '3 ถึง 5 ปี', 3),
      new Choice('4', 'มากกว่า 5 ปี', 4),
    ]);

  suit_q6 = new Question('6', 'วัตถุประสงค์หลักในการลงทุนของท่าน คือ', '',''
  , false,true,true,
    [
      new Choice('1', 'เน้นเงินต้นต้องปลอดภัยและได้รับผลตอบแทนสม่ำเสมอแต่ต่ำได้ ', 1),
      new Choice('2', 'เน้นโอกาสได้รับผลตอบแทนที่สม่ำเสมอ แต่อาจเสี่ยงที่จะสูญเสียเงินต้นได้บ้าง ', 2),
      new Choice('3', 'เน้นโอกาสได้รับผลตอบแทนที่สูงขึ้น แต่อาจเสี่ยงที่จะสูญเสียเงินต้นได้มากขึ้น', 3),
      new Choice('4', 'เน้นผลตอบแทนสูงสุดในระยะยาว แต่อาจเสี่ยงที่จะสูญเสียเงินต้นส่วนใหญ่ได้ ', 4),
    ]);

  // 'assets/img/mpam/S7.png'
  // 'assets/img/avatars/7.jpg'
  // tslint:disable-next-line:max-line-length
  suit_q7 = new Question('7', 'เมื่อพิจารณารูปแสดงตัวอย่างผลตอบแทนของกลุ่มการลงทุนที่อาจเกิดขึ้นด้านล่าง ท่านเต็มใจที่จะลงทุนในกลุ่มการลงทุนใดมากที่สุด', 'assets/img/mpam/S7.png',''
  , false,true,true,
    [
      new Choice('1', 'กลุ่มการลงทุนที่ 1 มีโอกาสได้รับผลตอบแทน 2.5% โดยไม่ขาดทุนเลย', 1),
      new Choice('2', 'กลุ่มการลงทุนที่ 2 มีโอกาสได้รับผลตอบแทนสูงสุด 7% แต่อาจมีผลขาดทุนได้ถึง 1%', 2),
      new Choice('3', 'กลุ่มการลงทุนที่ 3 มีโอกาสได้รับผลตอบแทนสูงสุด 15% แต่อาจมีผลขาดทุนได้ถึง 5% ', 3),
      new Choice('4', 'กลุ่มการลงทุนที่ 4 มีโอกาสได้รับผลตอบแทนสูงสุด 25% แต่อาจมีผลขาดทุนได้ถึง 15%', 4),
    ]);

  // tslint:disable-next-line:max-line-length
  suit_q8 = new Question('8', 'ถ้าท่านเลือกลงทุนในทรัพย์สินที่มีโอกาสได้รับผลตอบแทนมาก แต่มีโอกาสขาดทุนสูงด้วยเช่นกัน ท่านรู้สึกอย่างไร', '',''
  , false,true,true,
    [
      new Choice('1', 'กังวลและตื่นตระหนกกลัวขาดทุน ', 1),
      new Choice('2', 'ไม่สบายใจแต่พอเข้าใจได้บ้าง ', 2),
      new Choice('3', 'เข้าใจและรับความผันผวนได้ในระดับหนึ่ง ', 3),
      new Choice('4', 'ไม่กังวลกับโอกาสขาดทุนสูง และหวังผลตอบแทนที่อาจจะได้รับสูงขึ้น ', 4),
    ]);


  // tslint:disable-next-line:max-line-length
  suit_q9 = new Question('9', 'ท่านจะรู้สึกกังวล/รับไม่ได้ เมื่อมูลค่าเงินทุนของท่านมีการปรับตัวลดลงในสัดส่วนเท่าใด', '',''
  , false,true,true,
    [
      new Choice('1', '5% หรือน้อยกว่า ', 1),
      new Choice('2', 'มากกว่า 5%-10% ', 2),
      new Choice('3', 'มากกว่า 10%-20% ', 3),
      new Choice('4', 'มากกว่า 20% ขึ้นไป ', 4),
    ]);

  // tslint:disable-next-line:max-line-length
  suit_q10 = new Question('10', 'หากปีที่แล้วท่านลงทุนไป 100,000 บาท ปีนี้ท่านพบว่ามูลค่าเงินลงทุนลดลงเหลือ 85,000 บาท ท่านจะทำอย่างไร', '',''
  , false,true,true,
    [
      new Choice('1', 'ตกใจ และต้องการขายการลงทุนที่เหลือทิ้ง', 1),
      new Choice('2', 'กังวลใจ และจะปรับเปลี่ยนการลงทุนบางส่วนไปในทรัพย์สินที่เสี่ยงน้อยลง ', 2),
      new Choice('3', 'อดทนถือต่อไปได้ และรอผลตอบแทนปรับตัวกลับมา ', 3),
      new Choice('4', 'ยังมั่นใจ เพราะเข้าใจว่าต้องลงทุนระยะยาว และจะเพิ่มเงินลงทุนในแบบเดิมเพื่อเฉลี่ยต้นทุน', 4),
    ]);

  // Special question
  // tslint:disable-next-line:max-line-length
  suit_s11 = new Question('11', 'หากการลงทุนในอนุพันธ์และหุ้นกู้อนุพันธ์ประสบความสำเร็จ ท่านจะได้รับผลตอบแทนในอัตราที่สูงมาก แต่หากการลงทุนล้มเหลว ท่านอาจจะสูญเงินลงทุนทั้งหมด และอาจต้องลงเงินชดเชยเพิ่มบางส่วน ท่านยอมรับได้เพียงใด', '',''
  , false,true,false,
    [
      new Choice('1', 'ไม่ได้', 1),
      new Choice('2', 'ได้', 2),
    ]);

  // tslint:disable-next-line:max-line-length
  suit_s12 = new Question('12', 'นอกเหนือจากความเสี่ยงในการลงทุนแล้ว ท่านสามารถรับความเสี่ยงด้านอัตราแลกเปลี่ยนได้เพียงใด', '',''
  , false,true,false,
    [
      new Choice('1', 'ไม่ได้', 1),
      new Choice('2', 'ได้', 2),
    ]);
// SUITABILITY QUESTIONS (END)


// FATCA QUESTIONS (START)
fatca_q1 = new Question('1', 'ท่านเป็นพลเมืองอเมริกัน ใช่หรือไม่', '',''
  , false,true,false,
    [
      new Choice('1', 'ใช่', 1),
      new Choice('2', 'ไม่ใช่', 2),
    ]);

fatca_q2 = new Question('2', 'ท่านเป็นผู้ถือบัตรประจำตัวผู้มีถิ่นที่อยู่ถาวรอย่างถูกต้องตามกฎหมายในสหรัฐอเมริกา (เช่น กรีนการ์ด) ใช่หรือไม่', '',''
    , false,true,false,
      [
        new Choice('1', 'ใช่', 1),
        new Choice('2', 'ไม่ใช่', 2),
      ]);

  fatca_q3 = new Question('3', 'ท่านมีสถานะเป็นผู้มีถิ่นที่อยู่ในสหรัฐอเมริกาเพื่อวัตถุประสงค์ในการเก็บภาษีอากรของสหรัฐอเมริกา ใช่หรือไม่', '',''
  , false,true,false,
    [
      new Choice('1', 'ใช่', 1),
      new Choice('2', 'ไม่ใช่', 2),
    ]);


        fatca_q4 = new Question('4', 'ท่านเกิดในสหรัฐอเมริกา (หรือดินแดนที่เป็นของสหรัฐอเมริกา) แต่ได้สละความเป็นพลเมืองอเมริกันอย่างสมบูรณ์ตามกฎหมายแล้ว ใช่หรือไม่', '',''
        , false,true,false,
          [
            new Choice('1', 'ใช่', 1),
            new Choice('2', 'ไม่ใช่', 2),
          ]);

          fatca_q5 = new Question('5', 'ท่านมีที่อยู่อาศัยในปัจจุบัน หรือที่อยู่เพื่อการติดต่อในสหรัฐอเมริกา สำหรับบัญชีที่เปิดไว้หรือมีอยู่กับ บริษัทจัดการ ใช่หรือไม่', '',''
          , false,true,false,
            [
              new Choice('1', 'ใช่', 1),
              new Choice('2', 'ไม่ใช่', 2),
            ]);

            fatca_q6 = new Question('6', 'ท่านมีหมายเลขโทรศัพท์ในสหรัฐอเมริกา เพื่อการติดต่อท่าน หรือบุคคลอื่นที่เกี่ยวข้องกับบัญชีที่เปิดไว้หรือมีอยู่กับ บริษัทจัดการ ใช่หรือไม่', '',''
          , false,true,false,
            [
              new Choice('1', 'ใช่', 1),
              new Choice('2', 'ไม่ใช่', 2),
            ]);

            fatca_q7 = new Question('7', 'ท่านมีที่อยู่สำหรับรับไปรษณีย์แทน หรือที่อยู่สำหรับการส่งต่อเพียงที่อยู่เดียว ในสหรัฐอเมริกา เพื่อการติดต่อหรือดำเนินการเกี่ยวกับบัญชีที่เปิดไว้หรือมีอยู่กับ บริษัทจัดการ ใช่หรือไม่', '',''
            , false,true,false,
              [
                new Choice('1', 'ใช่', 1),
                new Choice('2', 'ไม่ใช่', 2),
              ]);

              fatca_q8 = new Question('8', 'ท่านมีคำสั่งทำรายการโอนเงินเป็นประจำโดยอัตโนมัติ จากบัญชีที่เปิดไว้หรือที่มีอยู่กับ บริษัทจัดการ ไปยังบัญชีในสหรัฐอเมริกา ใช่หรือไม่', '',''
              , false,true,false,
                [
                  new Choice('1', 'ใช่', 1),
                  new Choice('2', 'ไม่ใช่', 2),
                ]);

                fatca_q9 = new Question('9', 'ท่านมีการมอบอำนาจหรือให้อำนาจในการลงลายมือชื่อแก่บุคคลที่มีที่อยู่ในสหรัฐอเมริกา เพื่อการใด ๆ ที่เกี่ยวข้องกับบัญชีที่เปิดไว้หรือมีอยู่กับ บริษัทจัดการ ใช่หรือไม่', '',''
                , false,true,false,
                  [
                    new Choice('1', 'ใช่', 1),
                    new Choice('2', 'ไม่ใช่', 2),
                  ]);
// FATCA QUESTIONS (END)

}
