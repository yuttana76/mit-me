import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnoucementFormService } from './anoucementForm.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Anoucement } from '../model/anoucement.model';

@Component({
  selector: 'app-anoucement',
  templateUrl: './anoucement.component.html',
  styleUrls: ['./anoucement.component.scss']
})
export class AnoucementComponent implements OnInit , OnDestroy {

  spinnerLoading = false;
  displayedColumns: string[] = ['date', 'category', 'from' , 'topic', 'action'];
  dataSource = new BehaviorSubject([]);

  anoucementList: Anoucement[];
  private anoucementSub: Subscription;

  constructor(
    public formService: AnoucementFormService,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
  }

  public onAddNew() {

  }
}
