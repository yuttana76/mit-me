import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthorityFormService } from './authorityForm.service';
import { Authority } from '../model/authority.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthorityService } from '../services/authority.service';

/**
 * @title Tree with nested nodes
 */

@Component({
  selector: 'app-authority',
  templateUrl: './authority.component.html',
  styleUrls: ['./authority.component.scss']
})
export class AuthorityComponent implements OnInit , OnDestroy {

  spinnerLoading = false;
  panelOpenState = false;

  dataSource = new BehaviorSubject([]);
  authorityList: Authority[];
  private authoritySub: Subscription;

  constructor(
    public formService: AuthorityFormService,
    private authorityService: AuthorityService
    ) { }

  ngOnInit() {

    this.spinnerLoading = true;

    this.authorityService.getAuthority();
    this.authoritySub = this.authorityService.getAuthorityListener().subscribe((data: Authority[]) => {
      this.spinnerLoading = false;
      this.authorityList = data;
      this.dataSource.next(this.authorityList);
    });
  }

  ngOnDestroy() {
    // this.authoritySub.unsubscribe();
  }

}
