import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { NgForm } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { LoginService } from '../service/login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private loginService: LoginService, private spinner: NgxSpinnerService, public toastr: ToastrManager) { }
  confirmPassword;
  password_login;
  email;
  ind;
  industries;
  password;
  forgotEmail;
  email_login;
  fpemUser;
  ngOnInit() {
    localStorage.removeItem('fpemUser');

  }


  async Login(fl: NgForm) {
    if (fl.valid) {
      this.spinner.show();
      var obj = new Object();
      obj['email'] = this.email;
      obj['password'] = this.password;
      var resp = await this.loginService.signIn(obj);

      if (resp['error'] == false) {
        this.spinner.hide();
        localStorage.setItem('fpemUser', JSON.stringify(resp.data));
        this.toastr.successToastr('Login Successful');
        if (resp['data'].steps_completed >= 3) {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/env']);
        }


      } else if (resp['error'] == true) {
        this.spinner.hide();
        this.toastr.errorToastr(resp['data'], 'Oops!');
      }
    }


  }
async sendPass(){
  this.spinner.show();
  var obj= new Object();
  obj['email']=this.forgotEmail;
  var resp= await this.loginService.forgotPass(obj);
  if(resp['error']==false){
    this.spinner.hide();
    this.toastr.successToastr(resp['data']);
  }else{
    this.spinner.hide();
    this.toastr.errorToastr(resp['data']);

  }
}
  ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      console.log(true)
      return (true)
    } else
      console.log(false)
    return (false)
  }

}
