import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { RuleService } from '../../service/rule.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router'
import { TouchSequence } from 'selenium-webdriver';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as Papa from 'papaparse';
declare var $: any;

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  acc_id;

  rules;
  selectedRules: []
  selectedEvent;
  input;
  output;
  fpemUser


  eventLayouts=[];
  allEventLayouts=[];
  constructor(private toastr: ToastrManager, private ruleService: RuleService, private spinner: NgxSpinnerService, private router: Router) { }

  async ngOnInit() {

    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));
    this.acc_id = this.fpemUser.acct_id;


    await this.getEventLayoutsWithInfo();
    await this.GetRules();

    console.log(this.rules);

  }

  async  getEventLayoutsWithInfo() {
    var resp11 = await this.ruleService.getEventLayoutsWithInfo(this.acc_id);
    console.log(resp11);
    if (resp11['error'] == false) {

      this.eventLayouts = [];
      this.allEventLayouts = resp11.data;
      for (let i = 0; i < this.allEventLayouts.length; i++) {
        this.eventLayouts.push(this.allEventLayouts[i]);
      }

    }else{
      this.toastr.errorToastr("Error in Getting Event.", 'Error!');
    }

    
  }


  async GetRules() {
    var resp1 = await this.ruleService.getrulesForTestComp(this.acc_id);
    if ((resp1['error'] == false)) {
      this.rules = resp1["data"];

    } else {
      this.toastr.errorToastr("Error in Getting Rules.", 'Error!');
    }
  }

  async Save() {
    this.spinner.show();
    console.log(this.selectedEvent)
    console.log(this.selectedRules)
    var str = '';
    for (let i = 0; i < this.selectedRules.length; i++) {
      str = str + this.selectedRules[i] + ","
    }
    var ids = str.substring(0, str.length - 1);
    console.log(ids)
    var fieldsArr;
    console.log(this.eventLayouts);
    console.log(this.selectedEvent);
    for (let j = 0; j < this.eventLayouts.length; j++) {
      if (this.eventLayouts[j].event_layout_name == this.selectedEvent) {
        fieldsArr = this.eventLayouts[j].technical_field_names.split(",")
      }
    }
    console.log(fieldsArr[1]);
    var  dataToSend=[];
    var data = new Object;
    console.log(this.input);
    var valueArr1 = this.input.split("\n");
    Papa.parse(this.input, {
      header: false,
      skipEmptyLines: true,
      complete: (result,file) => {
        console.log(result);
        valueArr1 = result.data;
      }
    });
    console.log(valueArr1)
    for(var l=0;l<valueArr1.length;l++){
      var valueArr = valueArr1[l];
      if (valueArr.length == fieldsArr.length) {
        for (let k = 0; k < valueArr.length; k++) {
          data[fieldsArr[k]] = valueArr[k]
        }
        dataToSend.push(data);
      
      }
      else {
        this.spinner.hide();
        this.toastr.errorToastr("length of input incorrect", 'Error!');
      }
    }
    var obj = new Object();
    obj['operation'] = 'test';
    obj['rule_id'] = ids;
    obj['acct_id'] = this.acc_id;
    obj['data'] = dataToSend;
    console.log(obj);
   
    var resp= await this.ruleService.compileRule(obj);
    if(resp['error']==false){
      this.output=resp.data;
      if(this.output.length==0){
        this.spinner.hide();
        this.toastr.infoToastr("No Line Created", 'Success!');
      }else{
        this.spinner.hide();
        this.toastr.successToastr("Check the results", 'Success!');
      }
    }else{
      this.spinner.hide();
      this.toastr.errorToastr("Some Error Occurred", 'Error!');
    }
    

   

  }

}
