

import { Component, OnInit } from '@angular/core';
import { ProcessingService } from '../service/processing.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MatPaginatedTabHeader } from '@angular/material/tabs/typings/paginated-tab-header';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.css']
})
export class ProcessingComponent implements OnInit {



  constructor(private processingService: ProcessingService, private spinner: NgxSpinnerService,public toastr: ToastrManager) { }

  allProcess=[];
  is_checked=false ;
  
  is_color = 'accent';
  color = 'accent';
  acct_id
  fpemUser

  async ngOnInit() {
    this.fpemUser=JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id=this.fpemUser.acct_id;
    await this.getAllProcess();
    await this.getprocessactiveinfo();




    
   }




async getAllProcess(){
  var resp1= await this.processingService.getsystemprocess();
  if (resp1['error'] == false) {
    
    this.allProcess=resp1.data;
    for(var i=0;i<this.allProcess.length;i++){
      this.allProcess[i]['status']='INACTIVE';
    }
  }

}
async getprocessactiveinfo(){
  var resp = await this.processingService.getProcessInfo(this.acct_id);
  if (resp['error'] == false) {
   var dt=resp.data;
   console.log(this.allProcess);
   console.log(dt);
   for(var i=0;i<dt.length;i++){
     for(var j=0;j<this.allProcess.length;j++){
       if(this.allProcess[j].id == dt[i].process_id && dt[i].status=='ACTIVE'){
          this.allProcess[j].status='ACTIVE';
       }
     }
   }
  
  } else {
    this.toastr.errorToastr('Somethings is Wrong.', 'Oops!');


  }
  console.log(this.allProcess);
} 
 async onChange_1(process) {
    console.log(process)
     if(process.status=='INACTIVE'){
       
      var obj = new Object();
      obj['acct_id'] = this.acct_id;
      obj['process_id'] = process.id;
      obj['process_name'] = process.process_name;
      console.log(obj)
      var resp = await this.processingService.Activestate(obj);
      console.log(resp)
           if(resp['error']==false){
          this.toastr.successToastr('Process State changed Successfully.', 'Success!');
          
          for(var j=0;j<this.allProcess.length;j++){
                 if(process.id==this.allProcess[j].id){
                  this.allProcess[j].status='ACTIVE'
                }
               }
     }}else if(process.status=='ACTIVE'){
      var obj = new Object();
      obj['process_id'] = process.id;
      obj['acct_id']= this.acct_id;
      // var id = process.id
       console.log(obj)
      var resp = await this.processingService.Inactivestate(obj);
      console.log(resp)
           if(resp['error']==false){
          this.toastr.successToastr('Process State changed Successfully.', 'Success!');
          for(var j=0;j<this.allProcess.length;j++){
            if(process.id==this.allProcess[j].id){
              console.log(process.status)
              this.allProcess[j].status='INACTIVE';
           }
          }
     }}
 
   
  }
  
   }
