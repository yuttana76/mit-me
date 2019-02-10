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

    this.loadDirectories();
  }

  ngOnInit() {
    // this.spinnerLoading = true;
  }

  loadDirectories() {

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

    this.questions = [q1, q2, q3];
  }
}
