import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { RuleService } from '../../service/rule.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router'
import { TouchSequence } from 'selenium-webdriver';
import { ToastrManager } from 'ng6-toastr-notifications';
declare var $: any;
@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {


  index;
  allRules = [];
  data = [];
  dataSource;
  eventLayouts = [];
  allEventLayouts = [];
  displayedColumns = ['priority', 'rule_name', 'modify', 'status', 'delete'];

  selectedlayout;
  priority;
  rule_name;
  newRule = { rule_name: "", priority: '', status: "", acc_id: '', drl: "", when: "[]", then: "[]", file_id: '' };
  acc_id;
  currindex;
  rule_id;
  old_rule;
  rule = {
    when: [],
    then: []
  }
  whenConfig = [];
  thenConfigGlobal = new Object();
  thenConfig = [];
  Condition = ["", "AND", "OR"]
  whenCondition = ["==", "!=", "<", ">", "<=", ">="];
  thenValueOptions = ['static', 'field', 'lookup', 'expression'];
  CeiteriaOptions = ['static (String,Date)', 'static (Number)', 'static (Double)', 'field', 'lookup', 'expression'];

  outFileId = [];
  outObj = [];
  selectedvalue;
  chngArr = [];
  thenConfigDis = [];

  rulelookup = [];


  fpemUser;


  constructor(private toastr: ToastrManager, private ruleService: RuleService, private spinner: NgxSpinnerService, private router: Router) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  async  ngOnInit() {
    $("#replicate").draggable({
      handle: ".modal-dialog "
    });
    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));
    this.acc_id = this.fpemUser.acct_id;
    this.ruleService.flag = 0;

    await this.getEventLayoutsWithInfo();

    /* var resp1 = await this.ruleService.getAllLayouts(this.acc_id);
    if (resp1['error'] == false) {

      this.allLayouts=resp1.data;
      for(var i=0;i<this.allLayouts.length;i++){
        if(this.allLayouts[i].file_type=='Event Layout'){
          this.eventLayouts.push(this.allLayouts[i]);
        }else{
          this.thenConfigGlobal[this.allLayouts[i].file_name]=this.allLayouts[i].field_names.split(',');
          this.outObj.push(this.allLayouts[i].file_name);
          this.outFileId.push(this.allLayouts[i].file_id);
        }
      }
    } else {

    } */

    this.selectedlayout = this.eventLayouts[0];

    await this.getAllRules();
    await this.Lookups();


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

      console.log(this.eventLayouts)

    }
  }
  async Lookups() {
    this.rulelookup = [];
    var resp = await this.ruleService.ruleLookups(this.acc_id);
    console.log(resp)
    if (resp['error'] == false) {
      var data = resp.data;
      for (let i = 0; i < data.length; i++) {
        this.rulelookup.push(data[i].lookup_name);
      }
      console.log(this.rulelookup);

    } else {
    }


  }



  async getAllRules() {
    var resp = await this.ruleService.getAllRules(this.acc_id);
    if (resp['error'] == false) {
      this.allRules = resp.data;

    } else {
    }
    this.selectLayouts();
  }


  async selectLayouts() {
    this.data = [];

    for (var i = 0; i < this.allRules.length; i++) {
      if (this.allRules[i].input_layout_id == this.selectedlayout.event_layout_id) {
        this.data.push(this.allRules[i]);
      }
    }
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async replicate() {
    if(this.data.length>0)
    this.old_rule=this.data[0];
    else{
      this.old_rule=undefined;
    }


  }

  async replicateRule() {
    this.spinner.show();
    var obj1 = new Object();
    obj1['rule_id'] = this.old_rule.rule_id;
    obj1['rule_name'] = this.rule_name;
    obj1['priority'] = this.priority;

    console.log(obj1)

    var resp = await this.ruleService.replicateRule(obj1);
    if (resp['error'] == false) {
      console.log(resp);
      var dt = resp.data[0];
      this.rule.when = JSON.parse(dt.when);
      this.rule.then = JSON.parse(dt.then);
      var obj = new Object;
      var newRule = this.makeValidJson();
      obj["rule"] = newRule;
      obj["rule_id"] = dt.rule_id;
      obj["rule_name"] = dt.rule_name;
      obj["acct_id"] = this.acc_id;
      obj["priority"] = dt.priority;
      obj['file_id'] = this.selectedlayout.event_layout_id;
      console.log(obj);
      var resp1 = await this.ruleService.updaterule(obj);
      console.log(resp1);
      if (resp1['error'] == false) {
        await this.getAllRules();


      }
      this.spinner.hide();

    } else {
      this.spinner.hide();
    }

  }

  async add() {
    this.newRule.acc_id = this.acc_id;

    $('#addNewRule').modal('show');

  }
  async addnewrule() {
    this.newRule.priority = this.priority;
    this.newRule.rule_name = this.rule_name;
    this.newRule.status = '0';
    this.newRule.file_id = this.selectedlayout.file_id;

    var resp = await this.ruleService.addRule(this.newRule);
    if (resp['error'] == false) {

      this.router.navigate(['/rules/createrule']);
      this.modify((this.data[this.data.length - 1]), (this.data.length - 1));
      await this.getAllRules();

    } else {

    }
  }
  async delete(element, i) {
    var obj = element.rule_id;
    var resp = await this.ruleService.deleteRule(obj);
    if (resp['error'] == false) {
      this.data.splice(i, 1);

      this.dataSource = new MatTableDataSource(this.data);
      this.toastr.successToastr("Delete Successfully", 'Success!');

    } else {
      this.toastr.errorToastr(resp['data'], 'Error!');

    }

  }


  async changeStatus(element, i, status) {
    this.spinner.show();
    var obj = new Object;
    obj["rule_id"] = element.rule_id;
    obj["status"] = status;
    var resp = await this.ruleService.updatestatus(obj);
    if (resp['error'] == false) {
      await this.getAllRules();
      this.spinner.hide();
    } else {
      this.spinner.hide();
    }

  }




  modify(element, i) {
    this.ruleService.selectLayouts = this.selectedlayout;
    this.ruleService.element = element;
    this.ruleService.rule_id = element.rule_id;
    this.ruleService.flag = 1;
    this.router.navigate(['/rules/createrule']);

  }

  makeValidJson() {
    console.log(this.rule);
    var when = this.rule.when;
    var then = this.rule.then;
    const regex = /"/g;
    for (let k = 0; k < then.length; k++) {
      for (let l = 0; l < then[k].assignments.length; l++) {

        if (then[k].assignments[l].newValue !== undefined) {
          const str1 = then[k].assignments[l].newValue.replace(regex, '\\\"');
          then[k].assignments[l].newValue = str1;
        }
      }
    }
    for (let k = 0; k < when.length; k++) {


      if (when[k].fields.key !== undefined) {
        const str1 = when[k].fields.key.replace(regex, '\\\"');
        when[k].fields.key = str1;
      }
      if (when[k].fields.value !== undefined) {
        const str1 = when[k].fields.value.replace(regex, '\\\"');
        when[k].fields.value = str1;
      }

    }
    var newRule = new Object();
    newRule['when'] = JSON.stringify(when);
    newRule['then'] = JSON.stringify(then);
    console.log(newRule);
    return newRule;
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



}