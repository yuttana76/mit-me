import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

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

  onSignup(form: NgForm) {

    if (form.invalid) {
      this.wasWarning  = true;
      // this.warningMsg = [...this.warningMsg, 'email'];
      this.warningMsg = [...this.warningMsg, 'Login infomation invalid.'];
      return;
    }

    // console.log('email>>' + form.value.email);

    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authstatusSub.unsubscribe();
  }
}
