import { Component, OnInit } from '@angular/core';
import {ControlsService} from '.././/.//../service/controls.service';

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrManager } from 'ng6-toastr-notifications';
@Component({
  selector: 'app-accounting-period',
  templateUrl: './accounting-period.component.html',
  styleUrls: ['./accounting-period.component.css']
})
export class AccountingPeriodComponent implements OnInit {

  ppd;
  ppds = [];
  runids=[];

  startMonth='January';
  endMonth='December';
  fpemUser;

  selectedRunId;
  selectedPpd;

  allppdfull=[];

  temp_ppd_data=[];

  constructor(private controlsService : ControlsService, private spinner : NgxSpinnerService, public toastr: ToastrManager) { }
  AllPpd: Map<String, String> = new Map<String, String>();

 async  ngOnInit() {
   this.fpemUser=JSON.parse(localStorage.getItem('fpemUser'));
   await this.getPpd();
   await this.getAllPpdRunId();
   await this.getStartEndMonth();
  }
async getStartEndMonth(){
  var resp = await this.controlsService.getStartEndMonth(this.fpemUser.acct_id);
 
  if(resp['error']==false){
    this.startMonth=resp.data[0].acct_control_start;
    this.endMonth=resp.data[0].acct_control_end
  }
  
}
  async getPpd(){
    var resp = await this.controlsService.getPpd(this.fpemUser.acct_id);

    if(resp['error']==false){
      this.ppd=resp.data[0].ppd;
    }
  }

  async getAllPpdRunId(){

    var resp = await this.controlsService.getAllPpdRunId(this.fpemUser.acct_id);
    if (resp['error'] == false) {
      this.temp_ppd_data=resp.data;
      var arr = resp.data;
      for (var i = 0; i < arr.length; i++) { 
       this.allppdfull.push(arr[i].ppd)
      }
      var unique = this.allppdfull.filter((v, i, a) => a.indexOf(v) === i);
      this.ppds=unique;
    }
  }

  changeppd(selectedPpd){
    var arr=[];
    for(let i=0;i<this.temp_ppd_data.length;i++){
      if(selectedPpd==this.temp_ppd_data[i].ppd){
         arr.push(this.temp_ppd_data[i].run_id)
      }
    }
   
    this.runids=arr.filter((v, i, a) => a.indexOf(v) === i);
    this.selectedRunId='';
  }

  

  async advance(){
    this.spinner.show();

    var resp = await this.controlsService.advancePpd(this.fpemUser.acct_id);
    if(resp['error']==false){
      await this.getPpd();
      await this.getAllPpdRunId()
      this.spinner.hide();
      this.toastr.successToastr('Advanced Successfully', 'Advanced!')

    }else{
      this.spinner.hide();
      this.toastr.errorToastr('Somethings is Wrong.', 'Oops!')
    }

  }

   async rollBack(){
    this.spinner.show();
    var obj = new Object();
    obj['acct_id']=this.fpemUser.acct_id;
    obj['ppd']=this.selectedPpd;
    obj['run_id']=this.selectedRunId;
   
    var resp = await this.controlsService.RollBack(obj);
    if(resp['error']==false){
      this.spinner.hide();
      this.toastr.successToastr('RollBack Successfully', 'Advanced!')
    }else{
      this.spinner.hide();
      this.toastr.errorToastr('Somethings is Wrong.', 'Oops!')
    }
  }

}
