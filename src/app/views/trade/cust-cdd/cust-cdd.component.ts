import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CDDModel } from '../model/cdd.model';
import { CddService } from '../services/cdd.service';

@Component({
  selector: 'app-cust-cdd',
  templateUrl: './cust-cdd.component.html',
  styleUrls: ['./cust-cdd.component.scss']
})
export class CustCDDComponent implements OnInit {

  @Input() custCode: string;

  cddFormGroup: FormGroup;
  public cddData = new CDDModel() ;

  constructor(private _formBuilder: FormBuilder,
    private cddService: CddService
    ) { }

  ngOnInit() {

    // this.cddFormGroup = this._formBuilder.group({
    //   firstCtrl: ['', Validators.required],
    //   dobDate2:['', Validators.required],
    // });

   this.cddFormGroup = new FormGroup({
    // firstCtrl: new FormControl(null, {
    //   validators: [Validators.required]
    // }),
    pid: new FormControl(null, {
      validators: [Validators.required]
    }),
    firstName: new FormControl(null, {
      validators: [Validators.required]
    }),
    lastName: new FormControl(null, {
      validators: [Validators.required]
    }),
    dob: new FormControl(null, {
      validators: [Validators.required]
    }),
    mobile: new FormControl(null, {
      validators: [Validators.required]
    }),
    email: new FormControl(null, {
      validators: [Validators.required]
    }),
    typeBusiness: new FormControl(null, {
      validators: [Validators.required]
    }),
    occupation: new FormControl(null, {
      validators: [Validators.required]
    }),

    position: new FormControl(null, {
      validators: [Validators.required]
    }),
    incomeLevel: new FormControl(null, {
      validators: [Validators.required]
    }),
    incomeSource: new FormControl(null, {
      validators: [Validators.required]
    }),
  });

     //Load CDD
     this.cddService.getCustCDDInfo(this.custCode).subscribe(data => {
      console.log('CDD >>' +JSON.stringify(data));

      this.cddData.pid = data[0].pid;
      this.cddData.firstName = data[0].firstName;
      this.cddData.lastName = data[0].lastName;
      this.cddData.dob = data[0].dob;
      this.cddData.mobile = data[0].mobile;
      this.cddData.email = data[0].email;
      this.cddData.typeBusiness = data[0].typeBusiness;
      this.cddData.occupation = data[0].occupation;
      this.cddData.position = data[0].position;
      this.cddData.incomeLevel = data[0].incomeLevel;
      this.cddData.incomeSource = data[0].incomeSource;

      // this.cddFormGroup.setValue(pid:{});

      this.cddFormGroup.patchValue({
        pid: 'XXX',
        // formControlName2: myValue2 (can be omitted)
      });


    }, error => () => {
        console.log('Was error', error);
    }, () => {
      console.log('Loading complete');

    });

  }

}
