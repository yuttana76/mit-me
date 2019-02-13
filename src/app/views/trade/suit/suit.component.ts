import { Component, OnInit } from '@angular/core';
import { SuitFormService } from './suit.service';

import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Question, Choice } from '../suit-tree-view/question';
import { SuitTreeViewComponent } from '../suit-tree-view/suit-tree-view.component';


@Component({
  selector: 'app-suit',
  templateUrl: './suit.component.html',
  styleUrls: ['./suit.component.scss'],
})
export class SuitComponent implements OnInit {

  spinnerLoading = false;
  canDoSuit = false;

  private _hasData: string;

  questions: Array<Question>;

  constructor(
    public formService: SuitFormService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this._hasData = params['has'];
      console.log('**has>>' + this._hasData); // Print the parameter to the console. 

      // this.spinnerLoading = false;
    });

    this.loadQuestions();
  }

  ngOnInit() {
    // this.spinnerLoading = true;
  }

  loadQuestions() {

    const q1 = new Question('1', 'ปัจจุบันท่านอายุ', false, [],
      [
        new Choice('1', 'มากกว่า 55 ปี', 1),
        new Choice('2', '45 - 55 ปี', 2),
        new Choice('3', '35 - 44 ปี', 3),
        new Choice('4', 'น้อยกว่า 35 ปี', 4),
      ]);

    // tslint:disable-next-line:max-line-length
    const q2 = new Question('2', 'ปัจจุบันท่านมีภาระทางการเงินและค่าใช้จ่ายประจำ เช่น ค่าผ่อนบ้าน รถ ค่าใช้จ่ายส่วนตัว และค่าเลี้ยงดูครอบครัวเป็นสัดส่วนเท่าใด', false, [], 
    [
      new Choice('1', 'มากกว่าร้อยละ 75 ของรายได้ทั้งหมด', 1),
      new Choice('2', 'ระหว่างร้อยละ 50 ถึงร้อยละ 75 ของรายได้ทั้งหมด', 2),
      new Choice('3', 'ระหว่างร้อยละ 25 ถึงร้อยละ 50 ของรายได้ทั้งหมด', 3),
      new Choice('4', 'น้อยกว่าร้อยละ 25 ของรายได้ทั้งหมด', 4),
    ]);


    // tslint:disable-next-line:max-line-length
    const q3 = new Question('3', 'ท่านมีสถานภาพการเงินในปัจจุบันอย่างไร', false, [], 
    [
      new Choice('1', 'มีทรัพย์สินน้อยกว่าหนี้สิน', 1),
      new Choice('2', 'มีทรัพย์สินเท่ากับหนี้สิน', 2),
      new Choice('3', 'มีทรัพย์สินมากกว่าหนี้สิน', 3),
      new Choice('4', 'มีความมั่นใจว่ามีเงินออมหรือเงินลงทุนเพียงพอสำหรับการใช้ชีวิตหลังเกษียณอายุแล้ว', 4),
    ]);


    // tslint:disable-next-line:max-line-length
    const q4 = new Question('4', 'ท่านเคยมีประสบการณ์ หรือมีความรู้ในการลงทุนในทรัพย์สินกลุ่มใดต่อไปนี้บ้าง (เลือกได้มากกว่า 1 ข้อ)', true, [], 
    [
      new Choice('1', 'เงินฝากธนาคาร ', 1),
      new Choice('2', 'พันธบัตรรัฐบาล หรือกองทุนรวมพันธบัตรรัฐบาล ', 2),
      new Choice('3', 'หุ้นกู้ หรือกองทุนรวมตราสารหนี้ ', 3),
      new Choice('4', 'หุ้นสามัญ หรือกองทุนรวมหุ้น หรือสินทรัพย์อื่นที่มีความเสี่ยงสูง', 4),
    ]);

    // tslint:disable-next-line:max-line-length
    const q5 = new Question('5', 'ระยะเวลาที่ท่านคาดว่าจะไม่มีความจำเป็นต้องใช้เงินลงทุนนี้', false, [], 
    [
      new Choice('1', 'ไม่เกิน 1 ปี ', 1),
      new Choice('2', '1 ถึง 3 ปี', 2),
      new Choice('3', '3 ถึง 5 ปี', 3),
      new Choice('4', 'มากกว่า 5 ปี', 4),
    ]);

    const q6 = new Question('6', 'วัตถุประสงค์หลักในการลงทุนของท่าน คือ', false, [], 
    [
      new Choice('1', 'เน้นเงินต้นต้องปลอดภัยและได้รับผลตอบแทนสม่ำเสมอแต่ต่ำได้ ', 1),
      new Choice('2', 'เน้นโอกาสได้รับผลตอบแทนที่สม่ำเสมอ แต่อาจเสี่ยงที่จะสูญเสียเงินต้นได้บ้าง ', 2),
      new Choice('3', 'เน้นโอกาสได้รับผลตอบแทนที่สูงขึ้น แต่อาจเสี่ยงที่จะสูญเสียเงินต้นได้มากขึ้น', 3),
      new Choice('4', 'เน้นผลตอบแทนสูงสุดในระยะยาว แต่อาจเสี่ยงที่จะสูญเสียเงินต้นส่วนใหญ่ได้ ', 4),
    ]);

    // tslint:disable-next-line:max-line-length
    const q7 = new Question('7', 'เมื่อพิจารณารูปแสดงตัวอย่างผลตอบแทนของกลุ่มการลงทุนที่อาจเกิดขึ้นด้านล่าง ท่านเต็มใจที่จะลงทุนในกลุ่มการลงทุนใดมากที่สุด', false, [], 
    [
      new Choice('1', 'กลุ่มการลงทุนที่ 1 มีโอกาสได้รับผลตอบแทน 2.5% โดยไม่ขาดทุนเลย', 1),
      new Choice('2', 'กลุ่มการลงทุนที่ 2 มีโอกาสได้รับผลตอบแทนสูงสุด 7% แต่อาจมีผลขาดทุนได้ถึง 1%', 2),
      new Choice('3', 'กลุ่มการลงทุนที่ 3 มีโอกาสได้รับผลตอบแทนสูงสุด 15% แต่อาจมีผลขาดทุนได้ถึง 5% ', 3),
      new Choice('4', 'กลุ่มการลงทุนที่ 4 มีโอกาสได้รับผลตอบแทนสูงสุด 25% แต่อาจมีผลขาดทุนได้ถึง 15%', 4),
    ]);

     // tslint:disable-next-line:max-line-length
     const q8 = new Question('8', 'ถ้าท่านเลือกลงทุนในทรัพย์สินที่มีโอกาสได้รับผลตอบแทนมาก แต่มีโอกาสขาดทุนสูงด้วยเช่นกัน ท่านรู้สึกอย่างไร', false, [], 
     [
       new Choice('1', 'กังวลและตื่นตระหนกกลัวขาดทุน ', 1),
       new Choice('2', 'ไม่สบายใจแต่พอเข้าใจได้บ้าง ', 2),
       new Choice('3', 'เข้าใจและรับความผันผวนได้ในระดับหนึ่ง ', 3),
       new Choice('4', 'ไม่กังวลกับโอกาสขาดทุนสูง และหวังผลตอบแทนที่อาจจะได้รับสูงขึ้น ', 4),
     ]);


     // tslint:disable-next-line:max-line-length
     const q9 = new Question('9', 'ท่านจะรู้สึกกังวล/รับไม่ได้ เมื่อมูลค่าเงินทุนของท่านมีการปรับตัวลดลงในสัดส่วนเท่าใด', false, [], 
     [
       new Choice('1', '5% หรือน้อยกว่า ', 1),
       new Choice('2', 'มากกว่า 5%-10% ', 2),
       new Choice('3', 'มากกว่า 10%-20% ', 3),
       new Choice('4', 'มากกว่า 20% ขึ้นไป ', 4),
     ]);

     // tslint:disable-next-line:max-line-length
     const q10 = new Question('10', 'หากปีที่แล้วท่านลงทุนไป 100,000 บาท ปีนี้ท่านพบว่ามูลค่าเงินลงทุนลดลงเหลือ 85,000 บาท ท่านจะทำอย่างไร', false, [], 
     [
       new Choice('1', 'ตกใจ และต้องการขายการลงทุนที่เหลือทิ้ง', 1),
       new Choice('2', 'กังวลใจ และจะปรับเปลี่ยนการลงทุนบางส่วนไปในทรัพย์สินที่เสี่ยงน้อยลง ', 2),
       new Choice('3', 'อดทนถือต่อไปได้ และรอผลตอบแทนปรับตัวกลับมา ', 3),
       new Choice('4', 'ยังมั่นใจ เพราะเข้าใจว่าต้องลงทุนระยะยาว และจะเพิ่มเงินลงทุนในแบบเดิมเพื่อเฉลี่ยต้นทุน', 4),
     ]);

    // Special question
    // tslint:disable-next-line:max-line-length
    const s11 = new Question('11', 'หากการลงทุนในอนุพันธ์และหุ้นกู้อนุพันธ์ประสบความสำเร็จ ท่านจะได้รับผลตอบแทนในอัตราที่สูงมาก แต่หากการลงทุนล้มเหลว ท่านอาจจะสูญเงินลงทุนทั้งหมด และอาจต้องลงเงินชดเชยเพิ่มบางส่วน ท่านยอมรับได้เพียงใด', false, [],
      [
        new Choice('1', 'ไม่ได้', 1),
        new Choice('2', 'ได้', 2),
      ]);

    // tslint:disable-next-line:max-line-length
    const s12 = new Question('12', 'นอกเหนือจากความเสี่ยงในการลงทุนแล้ว ท่านสามารถรับความเสี่ยงด้านอัตราแลกเปลี่ยนได้เพียงใด', false, [], 
    [
      new Choice('1', 'ไม่ได้', 1),
        new Choice('2', 'ได้', 2),
    ]);

    this.questions = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, s11, s12];

  }

  public verify() {
    this.canDoSuit = !this.canDoSuit ;
  }
}