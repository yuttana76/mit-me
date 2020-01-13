import { Injectable } from '@angular/core';
import { Question } from '../../model/question.model';
import { Choice } from '../../model/choice.model';
// import { Choice, Question } from '../suit-tree-view/questionBAK';


@Injectable({
  providedIn: 'root'
})
export class KycFormService {

  STEPER_INFO = 'ข้อมูลส่วนบุคคล';
  STEPER_ADDR = 'ที่อยู่';
  STEPER_FATCA = 'FATCA';
  fatca_desc = 'แบบแจ้งสถานะความเป็นบุคคลอเมริกัน/ไม่เป็นบุคคลอเมริกัน';
  register_addr_title ='ที่อยู่ตามทะเบียนบ้าน';
  register_addr_title_ENG ='Residence Registration Address/Address in home country';
  work_addr_title ='ที่อยู่ที่ทำงาน';
  work_addr_title_ENG ='Workplace Address';
  contact_addr_title = 'ที่อยู่ที่ติดต่อได้ ';
  contact_addr_title_ENG = 'Contact Address';
  mail_addr_title = 'ที่อยู่สำหรับจัดส่งเอกสาร';
  mail_addr_title_ENG = 'Mailing Address';
  label_addrAs_reg = 'ตามทะเบียนบ้าน'
  label_addrAs_reg_ENG = 'Same as Residence Registration Address'
  label_addrAs_work = 'ตามที่่ทำงาน'
  label_addrAs_work_ENG = 'Same as Workplace Address'
  label_addrAs_curr = 'ตามที่อยู่ที่ติดต่อได้ '
  label_addrAs_curr_ENG = 'Same as Contact Address'
  label_addr_oth = 'อื่นๆ (โปรดระบุ)'
  label_addr_oth_ENG = 'Other (Please specify)'
  label_Email = 'อีเมล์'
  label_Email_ENG = 'E-mail'



}
