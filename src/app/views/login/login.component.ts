import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  wasWarning = false;
  warningMsg = [];

  isLoading = false;
  constructor(public authService: AuthService) {}

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
 }
