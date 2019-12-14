import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { NgForm } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { LoginService } from '../service/login.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  
    error=undefined;
    

    
    constructor(private router: Router, private loginService: LoginService, private spinner: NgxSpinnerService, public toastr: ToastrManager) { }
    confirmPassword;
    password_login;
    email;
    ind;
    industries;
    password;
  
    email_login;
    forgotEmail
    async ngOnInit() {
      localStorage.removeItem('fpemUser');
      var resp = await this.loginService.getInd();
      if (resp['error'] == false) {
        this.industries = resp.data;
      }
    }



    async Register(f: NgForm){
      this.spinner.show();
      this.error=undefined;
      if (this.confirmPassword !== this.password) {
        this.error='Password does not match'
        this.spinner.hide();
      } else {
        if (f.valid) {
         
          var obj = new Object();
          obj['email'] = this.email;
          obj['password'] = this.password;
          obj['ind_id'] = this.ind.id;
          obj['ind_name'] = this.ind.industry_name;
          console.log(obj);
          var resp = await this.loginService.signUp(obj);
          console.log(resp)
          if (resp['error'] == false) {
            this.spinner.hide();
            this.toastr.successToastr('Signup Sucessfull');
            this.router.navigate(['/login']);
          } else {
            this.spinner.hide();
            this.toastr.errorToastr(resp['data'],'Oops!');
          }
        }else{
          this.spinner.hide();

        }
      }
 
     

    }

    ValidateEmail(mail)
    
            {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
            {
              console.log(true)
            return (true)
            } else
            console.log(false)
            return (false)
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


}
