import { Injectable } from '@angular/core';
import { Question } from '../model/question.model';
import { Choice } from '../model/choice.model';
// import { Choice, Question } from '../suit-tree-view/questionBAK';


@Injectable({
  providedIn: 'root'
})
export class CustAddrFormService {

  from_title = 'Address Information';

  // Action response
  SAVE_COMPLETE = ' Save complete';
  SAVE_INCOMPLETE = ' Save incomplete';

  // Label
  // REQ_MODIFY = 'ต้องการแก้ไขข้อมูล';

  label_no = 'เลขที่ Address No.';
  label_Moo = 'หมู่ที่ Moo No.';
  label_Place = 'อาคาร/หมู่บ้าน Building/Mooban';
  label_Floor = 'ชั้น Floor';
  label_Soi = 'ซอย Soi';
  label_Road = 'ถนน Road';
  label_Sub_District = 'ตำบล Sub-district/Tambon';
  label_District = 'อำเภอ District/Amphur';
  label_Province = 'จังหวัด Province';
  label_Postcode = 'รหัสไปรษณีย์ Postal Code';
  label_Country = 'ประเทศ Country';
  label_Pl_Choose = 'โปรดเลือก Please choose.';

  label_Tel ='โทรศัพท์ Telephone';
  label_Fax = 'Fax.';

}
