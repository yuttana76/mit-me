import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MitLedMas } from '../../model/mitLedMas.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MasterDataService } from '../../services/masterData.service';
import { ShareDataService } from '../../services/shareData.service';
import { LEDService } from '../../services/led.service';
import { AuthService } from '../../../services/auth.service';
import { forkJoin } from 'rxjs';
import { mitLedMasHis } from '../../model/mitLedMasHis.model';
import { AuthorityService } from '../../services/authority.service';
import { Authority } from '../../model/authority.model';

@Component({
  selector: 'app-led-mas-detail',
  templateUrl: './led-mas-detail.component.html',
  styleUrls: ['./led-mas-detail.component.scss']
})
export class LedMasDetailComponent implements OnInit, AfterViewInit {

  form: FormGroup;
  addHistForm: FormGroup;

  public authority: Authority = new Authority();
  private appId = 'LEDMasterSearch';
  public YES_VAL = 'Y';

  insertMode: boolean;
  public codeLookupList:CodeLookup[]=[];
  masHistory:mitLedMasHis[]=[];

  new_mitLedMasHis:mitLedMasHis;

  constructor(
    public dialogRef: MatDialogRef<LedMasDetailComponent> ,
    @Inject(MAT_DIALOG_DATA) public mitLedMas: MitLedMas ,
    private toastr: ToastrService,
    private masterDataService: MasterDataService,
    public shareDataService: ShareDataService,
    private ledService:LEDService,
    private authService: AuthService,
    private authorityService: AuthorityService,
  ) { }

  ngOnInit() {
    // console.log("LedMasDetailComponent>>" + JSON.stringify(this.mitLedMas));

    if(this.mitLedMas.twsid){
          this.insertMode = false;
    }else{
      this.insertMode = true;
    }

    // Initial data
    const observables = [];
    observables.push(this.masterDataService.getCodeLookup("LEDCODE"));
    observables.push(this.ledService.getLedMasterHis(this.mitLedMas.twsid));

    const example = forkJoin(observables);
    const subscribe = example.subscribe((result:any) => {

      // console.log("LEDCODE->" + JSON.stringify(result[0]));
      if(result[0]){
        this.codeLookupList = result[0];
      }

      if(result[1]){
        // console.log("HIS->" + JSON.stringify(result[1]));
        this.masHistory = result[1].result;
      }

    });

    // Build form
    this.form = new FormGroup({
      twsid: new FormControl(null, {
        validators: [Validators.required]
      }),
      cust_code: new FormControl(null, {
        validators: [Validators.required]
      }),
      firstName: new FormControl(null, {
        validators: [Validators.required]
      }),
      lastName: new FormControl(null, {
        validators: [Validators.required]
      }),

      // status: new FormControl(null, {
      //   // validators: [Validators.required]
      // }),
    });

    this.addHistForm = new FormGroup({
      led_state: new FormControl(null, {
        // validators: [Validators.required]
      }),
      memo: new FormControl(null, {
        // validators: [Validators.required]
      }),
      resourceRef: new FormControl(null, {
        // validators: [Validators.required]
      }),
    });

     // PERMISSION
     this.authorityService.getPermissionByAppId(this.authService.getUserData(), this.appId).subscribe( (auth: Authority[]) => {
      auth.forEach( (element) => {
        this.authority = element;
      });
    });

  }

  ngAfterViewInit(): void {

    if(!this.insertMode){
      this.form.get('twsid').disable();
      this.form.get('cust_code').disable();
      this.form.get('firstName').disable();
      this.form.get('lastName').disable();
    }
  }

  onSave(): void {
    // this.dialogRef.close('close');
    const _actionBy = this.authService.getUserData() || 'NONE';

    if(!this.new_mitLedMasHis.no){
      //New his

      this.ledService.createLedMasterHis(this.new_mitLedMasHis,_actionBy).subscribe((data: any ) => {
        this.masHistory.push(this.new_mitLedMasHis);
        this.new_mitLedMasHis = null;

          this.toastr.success( `Add new successful`, 'Successful', {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          });
      }, error => () => {
        this.toastr.error( `Was error: ${error}`, 'Error', {
          timeOut: 5000,
          positionClass: 'toast-top-center',
        });
      }, () => {
        console.log(` Add appliation complete` );
      });

    }else{
      //Update his
      this.ledService.updateLedMasterHis(this.new_mitLedMasHis,_actionBy).subscribe((data: any ) => {

        this.updateHistList(this.new_mitLedMasHis);
        this.new_mitLedMasHis = null;

          this.toastr.success( `Update successful`, 'Successful', {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          });
      }, error => () => {
        this.toastr.error( `Was error: ${error}`, 'Error', {
          timeOut: 5000,
          positionClass: 'toast-top-center',
        });
      }, () => {
        console.log(` Add appliation complete` );
      });

    }

  }

  updateHistList(item:mitLedMasHis){
    for(var index in this.masHistory){

      if (this.masHistory[index].no === item.no){
        this.masHistory[index] = item;
        break;
      }
    }

  }

  onClose(): void {
    this.dialogRef.close('close');
  }

  public addHistory(): void {
    this.new_mitLedMasHis = new mitLedMasHis();
    this.new_mitLedMasHis.twsid = this.mitLedMas.twsid;
    this.new_mitLedMasHis.status="A";
  }

  onNewHisCancel(){
    this.new_mitLedMasHis = null;
  }

  editHistory(editItem:mitLedMasHis){
    console.log(`Edit ` + JSON.stringify(editItem));

    this.new_mitLedMasHis = editItem;

    console.log(`Edit obj>> ` + JSON.stringify(this.new_mitLedMasHis));

  }
}
