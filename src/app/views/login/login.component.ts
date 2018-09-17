import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  wasWarning = false;
  warningMsg = [];

  isLoading = false;
  private authstatusSub: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authstatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    }
    );
  }

  onLogin(form: NgForm) {

   if (form.invalid) {
      this.wasWarning  = true;
      // this.warningMsg = [...this.warningMsg, 'email'];
      this.warningMsg = [...this.warningMsg, 'Login infomation invalid.'];
      return;
    }

    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authstatusSub.unsubscribe();
  }

 }
