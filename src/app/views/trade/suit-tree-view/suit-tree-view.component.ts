import { Component, OnInit, Input } from '@angular/core';
import { Question } from './question';
import { FormGroup, FormControl, Validators } from '@angular/forms';



@Component({
  selector: 'app-suit-tree-view',
  templateUrl: './suit-tree-view.component.html',
  styleUrls: ['./suit-tree-view.component.scss']
})
export class SuitTreeViewComponent implements OnInit {

  @Input() questions: Array<Question>;

  form: FormGroup;
  suitScore = 0;

  public suitLevel = '';

  ngOnInit() {
    this._buildForm();
  }

  private _buildForm() {
    // Initial Form fields
    this.form = new FormGroup({
      // pid: new FormControl(null, {
      //   validators: [Validators.required]
      // })
    });
  }

  calSuit() {
    console.log('ON calSuit !');

    if (this.form.invalid) {
      return false;
    }


    for (let i = 0; i < this.questions.length - 1; i++) {

      if (this.questions[i].multilchoice ) {
        console.log(`multil `);
        for (let y = 0; y < this.questions[i].choices.length - 1; y++) {
          if (this.questions[i].choices[y].answer) {
            console.log(`** ${this.questions[i].id} : ${this.questions[i].choices[y].value}`);
            this.suitScore += this.questions[i].choices[y].value;
          }
        }

      } else {
        console.log(`* ${this.questions[i].id} : ${this.questions[i].answer}`);
        this.suitScore += Number(this.questions[i].answer);
      }
    }
    console.log(`*** Suit score : ${this.suitScore}`);
    console.log(JSON.stringify(this.questions));
  }
}
