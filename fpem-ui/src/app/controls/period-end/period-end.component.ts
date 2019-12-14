import { Component, OnInit } from '@angular/core';
import { ControlsService } from '.././/.//../service/controls.service';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrManager } from 'ng6-toastr-notifications';
@Component({
  selector: 'app-period-end',
  templateUrl: './period-end.component.html',
  styleUrls: ['./period-end.component.css']
})
export class PeriodEndComponent implements OnInit {
  allSelect = ['Year End','Month End','Day End','Custom'] 
  is_show = false;
  select;
  ppd
  fpemUser;
  acct_id;
  Start_ppd =[];
  A=[]
  E=[];
  I=[];
  L=[];
  O=[];
  Q=[];
  Accounts=[]
  Account_des_select=[]
  constructor(private controlsService: ControlsService, private spinner: NgxSpinnerService, public toastr: ToastrManager) { }

 async ngOnInit() {
   this.fpemUser=JSON.parse(localStorage.getItem('fpemUser'));
   this.acct_id=this.fpemUser.acct_id;
    await this.getAllPpd();
    await this.getAccount()

  }


 async getAllPpd(){
    var resp = await this.controlsService.getAllPpdRunId(this.acct_id);
    if (resp['error'] == false) {
this.Start_ppd=resp.data
console.log(this.Start_ppd)
    }
  }
  async getAccount(){
    var resp = await this.controlsService.getAccount(this.acct_id);
    if (resp['error'] == false) {
this.Accounts=resp.data;
for(var i=0;i<this.Accounts.length;i++){
  if(this.Accounts[i].acct_type_cd=='A'){
    this.A.push(this.Accounts[i]);
    this.Account_des_select.push(this.Accounts[i].acct_num_desc)
  }
  if(this.Accounts[i].acct_type_cd=='E'){
    this.E.push(this.Accounts[i])
  }
  if(this.Accounts[i].acct_type_cd=='I'){
    this.I.push(this.Accounts[i])
  }
  if(this.Accounts[i].acct_type_cd=='L'){
    this.L.push(this.Accounts[i])
  }
  if(this.Accounts[i].acct_type_cd=='O'){
    this.O.push(this.Accounts[i])
  }
  if(this.Accounts[i].acct_type_cd=='Q'){
    this.Q.push(this.Accounts[i])
  }
    }}}
  

  selectoption(event){
    console.log(this.select)
    if(this.select=='Custom'){
      this.is_show = true
    }else{
      this.is_show = false
    }
  }
  selectppd(event){
    console.log(event)
  }
}
