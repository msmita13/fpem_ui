import { Component, OnInit } from '@angular/core';
import { HelpService } from '../service/help.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import {ProfileService} from '../service/profile.service';
import {AccountService} from '../service/account.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  Subject;
  Message
  acct_name;
  first_name;
  last_name;
  acct_id;
  user_id;
  email_id
  constructor(private helpService: HelpService,public toastr: ToastrManager,private profileService : ProfileService, private accountService: AccountService) { }
  fpemUser;
 async ngOnInit() {
   this.fpemUser=JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id=this.fpemUser.acct_id;
    this.user_id=this.fpemUser.user_id;
  this.get_name()
    this.get_acc_detail()

  }
  async get_name(){
    var res= await this.profileService.getUserProfileInfo(this.user_id);
    console.log(res);
    if(res['error']==false){
    
      this.first_name=res.data[0].first_name;
   
     this.last_name =res.data[0].last_name;
     this.email_id = res.data[0].email;
    }
  }
  async get_acc_detail(){
    var resp = await this.accountService.getAccountInfo(this.acct_id);
    console.log(resp);
    if(resp['error']==false){
    
      this.acct_name=resp.data[0].acct_name;
     
    }
  }
 async Submit(){

var obj=new Object();
obj['f_name']=this.first_name;
obj['l_name']=this.last_name;
obj['email']=this.email_id;
obj['acc_name']=this.acct_name;
obj['acc_id']=this.acct_id;
obj['subject']=this.Subject;
obj['body']=this.Message;
console.log(obj)
 var resp=await this.helpService.askUs(obj);
 console.log(resp)
 if (resp['error'] == false) {
   this.toastr.successToastr('Message Sent Successfully.', 'Success!');

 }else{
  this.toastr.errorToastr('Somethings is Wrong.', 'Oops!');

  }
  }

}
