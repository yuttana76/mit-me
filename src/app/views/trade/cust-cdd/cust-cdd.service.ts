import { Injectable } from '@angular/core';
import { Question } from '../model/question.model';
import { Choice } from '../model/choice.model';
// import { Choice, Question } from '../suit-tree-view/questionBAK';


@Injectable({
  providedIn: 'root'
})
export class CustCddFormService {

  from_title = 'CDD Information';

  // Action response
  SAVE_COMPLETE = ' Save complete';
  SAVE_INCOMPLETE = ' Save incomplete';

  // Label
  REQ_MODIFY = 'ต้องการแก้ไขข้อมูล';
  LABEL_PERSON_INFO = 'ข้อมูลส่วนบุคคล (Personal Information)';
  LABEL_BACKGROUND = 'ข้อมูลเพิ่มเติม';
  LABEL_thai= 'ภาษาไทย';
  LABEL_eng = 'English';

  label_idType = 'ประเภทบัตร';
  label_passCountry = 'ประเทศที่ออก';

label_idNumber = 'เลขที่ บัตรประชาชน';
label_title = 'คำนำหน้า Title';
label_firstName_th = 'ชื่อ';
label_lastName_th = 'นามสกุล';
label_firstName_eng = 'Name';
label_lastName_eng = 'Surname';
label_DOB = 'วันเดือนปีเกิด(ค.ศ.) Date of Birth(A.D.)';
label_PIDExpDate = 'วันหมดอายุ(ค.ศ.) Expiry Date(A.D.)';
label_mobile = 'มือถือ (Mobile)';
label_email = 'อีเมล์ E-mail';
label_typeBusiness = 'ประเภทธุรกิจ Business Type';
label_other = 'อื่นๆ Other';
label_occupation = 'อาชีพ Occupation';
label_position = 'ตำแหน่ง Position';
label_incomeLevel = 'รายได้ต่อเดือน(บาท) Monthly Income(Baht)';
label_incomeSource = 'แหล่งที่มาของรายได้ Source of Income';
label_workPlace = 'บริษัท company name';



}
