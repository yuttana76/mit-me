import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  wasWarning = false;
  warningMsg = [];

  isLoading = false;
  constructor(public authService: AuthService) {}


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
}
