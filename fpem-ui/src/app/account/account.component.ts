import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AccountService} from '../service/account.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  acct_id;
  
  fpemUser;
  data={};
  constructor( private router:Router,private accountService: AccountService) {}
  
  async ngOnInit() {
    this.fpemUser=JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id = this.fpemUser.acct_id;
    await this.getAccountDetails();

  }
  async getAccountDetails(){
    var resp=await this.accountService.getAccountInfo(this.acct_id);
    console.log(resp);
    if(resp['error']==false){
      this.data = resp.data[0];
    }else{

    }
  }
  

}
