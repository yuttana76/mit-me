import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RegisterModel } from '../model/sitRegister.model';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';
import { StreamingService } from '../services/streaming.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-set-regis2',
  templateUrl: './set-regis2.component.html',
  styleUrls: ['./set-regis2.component.scss']
})
export class SetRegis2Component implements OnInit {

  register = new RegisterModel();
  regisCount=0;
  regisFail=false;

  OTPCount=0;
  OTPFail=false;

  firstFormGroup: FormGroup;
  verifyFormGroup: FormGroup;
  myRecaptcha = new FormControl(false);

  isStepperLinear = true;
  spinnerLoading = false;

  public MPAM_WEALTH_CONTACT="บริษัทหลักทรัพย์จัดการกองทุน เมอร์ชั่น พาร์ทเนอร์ จำกัด โทร. 02-660 6689";

  public ST_TermCondition = [
    '1.ข้าพเจ้าตกลงว่าจะใช้บริการธุรกรรมทางอินเตอร์เน็ตต่อเมื่อข้าพเจ้าได้เปิดบัญชีซื้อขายกองทุนกับ บลจ. เมอร์ชั่น พาร์ทเนอร์ จำกัด (บริษัทจัดการ) เรียบร้อยแล้ว',
    '2.ในการใช้บริการธุรกรรมทางอินเตอร์เน็ตนี้ ข้าพเจ้าจะใช้รหัสผู้ใช้และรหัสผ่านของข้าพเจ้าที่บริษัทจัดการมอบให้ หรือรหัสผ่านที่ข้าพเจ้าได้เป็นผู้กำหนดหรือเปลี่ยนแปลงขึ้นเองในระบบบริการธุรกรรมทางอินเตอร์เน็ตดังกล่าว ทั้งนี้ การมีคำสั่งซื้อขายหน่วยลงทุนหรือการกระทำใด ๆ ผ่านอินเตอร์เน็ตดังกล่าวเป็นการกระทำที่ถูกต้องตามกฎหมาย โดยข้าพเจ้าไม่ต้องลงลายมือชื่อไว้เป็นหลักฐานอีก',
    '3.ข้าพเจ้าตกลงจะเก็บรักษารหัสผู้ใช้และรหัสผ่านไว้เป็นความลับ และจะใช้เพื่อการบันทึกคำสั่งซื้อขาย และ/หรือคำสั่งอื่นใดเกี่ยวกับหน่วยลงทุนและเงินในบัญชีซื้อขายหน่วยลงทุนของข้าพเจ้าภายใต้คำรับรองและคำยืนยันฉบับนี้ โดยตนเองและเพื่อตนเองเท่านั้น ข้าพเจ้าจะไม่ให้บุคคลอื่นนำรหัสผู้ใช้และรหัสผ่านไปใช้ หากมีผู้ใดนำรหัสผู้ใช้และรหัสผ่านของข้าพเจ้าไปใช้การดูข้อมูล และ/หรือส่งคำสั่งซื้อหรือขายหน่วยลงทุนไม่ว่ากรณีใด ๆ ข้าพเจ้าจะรับผิดชอบและผูกพันในการกระทำดังกล่าวนั้นเอง',
    '4.ข้าพเจ้ารับทราบว่าการซื้อขายหน่วยลงทุนโดยตัดเงินจากบัญชีธนาคารต่าง ๆ ผ่านบริการธุรกรรมทางอินเตอร์เน็ตนั้น จะต้องลงนามในแบบแสดงความยินยอมให้หักเงินในบัญชีธนาคาร เพื่อเป็นค่าซื้อหน่วยลงทุน ซึ่งข้าพเจ้าได้ลงนามในแบบแสดงความยินยอมให้หักเงินดังกล่าวเรียบร้อยแล้ว และรับทราบว่าจะต้องทำรายการซื้อภายในเวลาที่กำหนด ทั้งนี้ ข้าพเจ้ารับทราบและเข้าใจดีว่าเวลาของแต่ละธนาคารอาจแตกต่างกันได้หรือเปลี่ยนแปลงได้ แล้วแต่กรณี',
    '5.ข้าพเจ้ารับทราบและยินยอมผูกพันตนเองตามเงื่อนไข ข้อกำหนด และข้อความใด ๆ ที่ระบุไว้ในหนังสือชี้ชวนเสนอขายหน่วยลงทุนของแต่ละกองทุน และที่ระบุอยู่บนระบบบริการธุรกรรมทางอินเตอร์เน็ตของบริษัทจัดการ',
    '6.ข้าพเจ้าเข้าใจและรับทราบถึงความเสี่ยงอันเกิดจากการทำรายการผ่านบริการธุรกรรมทางอินเตอร์เน็ต เช่น การสูญหายของข้อมูลระหว่างการรับ-ส่ง การส่งข้อมูลเป็นไปอย่างเชื่องช้า หรือไม่สามารถส่งข้อมูลได้ ตลอดจนกรณีที่ระบบเครือข่ายขัดข้องไม่สามารถทำงานได้ตามปกติ เกิดความผิดพลาดและคลาดเคลื่อนของข้อมูลที่ได้รับเนื่องจากข้อจำกัดในการใช้บริการธุรกรรมทางอินเตอร์เน็ต รวมถึงความเสียหายของอุปกรณ์ต่อพ่วงใด ๆ และข้อมูลหรือสิ่งต่าง ๆ ที่อยู่ในอุปกรณ์นั้น ๆ อันเนื่องมาจากการเข้ามาใช้บริการธุรกรรมทางอินเตอร์เน็ต รวมถึงความเสี่ยงจากการใช้บริการซื้อขายหน่วยลงทุนผ่านอินเตอร์เน็ต ซึ่งอาจได้รับไวรัสเข้ามาสู่ระบบ หรืออุปกรณ์คอมพิวเตอร์ หรือมีความเสี่ยงในการถูกขัดขวาง หรือรบกวนการใช้บริการโดยบุคคลภายนอกที่อยู่นอกเหนือการควบคุมของบริษัทจัดการ ซึ่งหากมีความเสียหายเกิดขึ้นจากเหตุดังกล่าวข้างต้น หรือเหตุใด ๆ อันเนื่องมาจากการทำรายการผ่านบริการธุรกรรมทางอินเตอร์เน็ตนี้ ข้าพเจ้าตกลงจะไม่เรียกร้องค่าเสียหายใด ๆ จากทางบริษัทจัดการโดยยินดีรับความเสี่ยงนี้ด้วยตนเองทุกประการ',
    '7.ข้าพเจ้ารับทราบว่าสามารถเพิกถอนรายการสั่งซื้อหรือสั่งขายหรือสับเปลี่ยนหน่วยลงทุนของข้าพเจ้าผ่านทางอินเตอร์เน็ตของบริษัทจัดการได้ภายในเวลาที่กำหนดเท่านั้น ทั้งนี้ ขึ้นอยู่กับเวลาของแต่ละธนาคาร หากการเพิกถอนรายการได้เกิดขึ้นหลังจากเวลาที่กำหนด ข้าพเจ้าจะยอมรับว่าข้าพเจ้าไม่สามารถเพิกถอนรายการได้ และให้ถือว่าการทำรายการสั่งซื้อ หรือสั่งขาย หรือสับเปลี่ยนหน่วยลงทุนดังกล่าวได้เสร็จสิ้นสมบูรณ์แล้ว',
    '8.บริษัทจัดการมีสิทธิระงับมิให้ข้าพเจ้าทำรายการซื้อขายหน่วยลงทุนผ่านอินเตอร์เน็ตได้ไม่ว่าในเวลาใด ๆ ทั้งนี้ ข้าพเจ้าจะไม่เรียกร้องค่าเสียหายหรือค่าใช้จ่ายใด ๆ จากบริษัทจัดการ',
    '9.ในกรณีที่ข้าพเจ้ากระทำการหรืองดเว้นกระทำการตามคำรับรองและคำยืนยันต่อบริษัทจัดการนี้ และเป็นเหตุให้บริษัทจัดการต้องชดใช้ค่าเสียหาย ค่าปรับ หรือเงินอื่นใดให้แก่คณะกรรมการกำกับหลักทรัพย์และตลาดหลักทรัพย์ สำนักงานคณะกรรมการกำกับหลักทรัพย์และตลาดหลักทรัพย์ คณะกรรมการกำกับตลาดทุน ตลาดหลักทรัพย์ หน่วยงานที่กำกับดูแล องค์กร หรือหน่วยงานอื่นใดของรัฐ รวมถึงสำนักหักบัญชีหรือบุคคลใด ๆ ข้าพเจ้ายินยอมรับผิดชอบชดใช้ค่าเสียหาย ค่าปรับ หรือเงินอื่นใดที่บริษัทจัดการต้องจ่ายไปคืนแก่บริษัทจัดการทันที พร้อมดอกเบี้ยที่บริษัทจัดการจะเรียกเก็บในอัตราที่บริษัทจัดการกำหนดนับแต่วันที่ได้ชำระเงินดังกล่าวไปจนกว่าวันที่ข้าพเจ้าชำระให้แก่บริษัทจัดการครบถ้วน'
  ];

  constructor(private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    private streamingService:StreamingService
    ) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      idCard: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', Validators.email]
    });
  }

  onRegister(stepper:MatStepper){
    const REGIS_FAIL_ATTEMP = 5;

    if(this.firstFormGroup.valid){

      // this.spinnerLoading = true; //Not work in stepper

      this.streamingService.addRegister(this.register,this.regisCount) .subscribe(data =>{

        this.regisCount = 0;
        stepper.next();

      } , rs => {

        console.log("Regis ERROR>" + JSON.stringify(rs));

        this.spinnerLoading = false;

        if (this.regisCount===REGIS_FAIL_ATTEMP){
          this.regisFail=true;
        }

        this.regisCount++;

        var warn_msg = "ข้อมูลไม่ถูกต้องในระบบของบริษัท";

        this.toastr.error(rs.error.data, "Error", {
          timeOut: 6000,
          closeButton: true,
          positionClass: "toast-top-center"
        });

      }, () => {
        this.spinnerLoading = false;
      });

    }

  }

  onProcData(stepper:MatStepper){
    if(this.firstFormGroup.valid){

      this.streamingService.regisAccept(this.register) .subscribe(data =>{

        console.log('onProcData() result' + JSON.stringify(data));
        let _dataObj = JSON.parse(JSON.stringify(data));

        console.log("regisAccept()>" + JSON.stringify);

        if(_dataObj.code === '000'){
          stepper.next();
        }else{
          this.toastr.error("Stremaing registration process was error. " + _dataObj.msg, "Error", {
            timeOut: 6000,
            closeButton: true,
            positionClass: "toast-top-center"
          });
        }


      } , error => {
        console.log("Stremaing registration process was error." + JSON.stringify(error));
        this.toastr.error("Stremaing registration process was error. ", "Error", {
          timeOut: 6000,
          closeButton: true,
          positionClass: "toast-top-center"
        });
      });
    }

  }

  onScriptLoad() {
    console.log('Google reCAPTCHA loaded and is ready for use!')
}

  onScriptError() {
      console.log('Something went long when loading the Google reCAPTCHA')
  }

  OnConditionChange() {

    // if(this.register.acceptFlag){
    //   // Auto  request OTP
    // }

}

requestOTP(){
  if(this.register.acceptFlag){

    // console.log("Call requestOTP");

    this.streamingService.requestOTP(this.register) .subscribe(data =>{
      this.toastr.success("Already send OTP" , "Successful", {
        timeOut: 3000,
        closeButton: true,
        positionClass: "toast-top-center"
      });

    }, error => {
      console.log("WAS ERR>>" + JSON.stringify(error) );

      this.spinnerLoading = false;
      this.toastr.error("Send OTP error "   , "Error", {
        timeOut: 6000,
        closeButton: true,
        positionClass: "toast-top-center"
      });
    },
    () => {
     this.spinnerLoading = false;
    });
  }

  }
}
