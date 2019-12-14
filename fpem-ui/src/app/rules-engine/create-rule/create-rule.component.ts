import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { RuleService } from '../../service/rule.service';
import { SourceService } from '../../service/source.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MatSort } from '@angular/material/sort';
import { element } from 'protractor';
import { Router } from '@angular/router'
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-create-rule',
  templateUrl: './create-rule.component.html',
  styleUrls: ['./create-rule.component.css']
})
export class CreateRuleComponent implements OnInit {
  error = '';
  fpemUser;
  rule = {
    when: [],
    then: []
  }
  ruleString = "";
  eventLayouts = [];
  allEventLayouts = [];
  allBusinessLayouts = [];
  selectedlayout;
  priority;
  rule_name;

  idToCompile = 0;
  rule_id;

  whenConfig = [];
  thenConfigGlobal = new Object();
  thenConfig = [];
  Condition = ["", "AND", "OR"]
  whenCondition = ["==", "!=", "<", ">", "<=", ">="];
  thenValueOptions = ['static', 'field', 'lookup', 'expression'];
  CeiteriaOptions = ['static (String,Date)', 'static (Number)', 'static (Double)', 'field', 'lookup', 'expression'];

  outFileId = [];
  outObj = [];

  thenConfigDis = [];
  rulelookup = [];

  local_flag = 0;
  acct_id;

  constructor(private toastr: ToastrManager, private ruleService: RuleService, private sourceService: SourceService, private spinner: NgxSpinnerService, private router: Router) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  FieldNameToId: Map<String, String> = new Map<String, String>();
  AllFieldsWithIdsMaps = [];


  async  ngOnInit() {

    this.local_flag = 0;
    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id = this.fpemUser.acct_id;

    await this.getEventLayoutsWithInfo();
    await this.getBusinessFileWithInfo();

    if (this.ruleService.flag == 1) {



      var l = this.ruleService.selectLayouts;

      for (var i = 0; i < this.eventLayouts.length; i++) {
        if (l.event_layout_id == this.eventLayouts[i].event_layout_id) {
          this.selectedlayout = this.eventLayouts[i];
          this.FieldNameToIdMapEvent();
        }
      }

      await this.getRule(this.ruleService.rule_id);
      await this.buildJSON(this.ruleString);
      this.local_flag = 1;
      this.ruleService.flag = 0;
      await this.changeFieldCodeToName();
    }
    else {
      this.rule_name = undefined;
      this.priority = 0;
      this.selectedlayout = this.eventLayouts[0];
      this.FieldNameToIdMapEvent();
      this.loadWhenConfig();
    }

    await this.loadLookups();



  }

  async  FieldNameToIdMapEvent() {
    var field_name = this.selectedlayout.business_field_names.split(',');
    var id = this.selectedlayout.business_field_ids.split(',');
    var technical_field_names = this.selectedlayout.technical_field_names.split(',');
   
    this.FieldNameToId.clear();
    for (let i = 0; i < field_name.length; i++) {
      //this.FieldNameToId.set(field_name[i], 'c_' + id[i]);
      this.FieldNameToId.set(field_name[i],technical_field_names[i]);
    }


  }

  async AllFieldsWithIdsMapBusiness() {
    this.AllFieldsWithIdsMaps = [];
    for (let i = 0; i < this.allBusinessLayouts.length; i++) {
      var field_name = this.allBusinessLayouts[i].business_field_name.split(',');
      var id = this.allBusinessLayouts[i].business_field_ids.split(',');
      //var technical_field_names = this.allBusinessLayouts[i].technical_field_names.split(',');
      var FieldNameToId: Map<String, String> = new Map<String, String>();
      for (let j = 0; j < field_name.length; j++) {
        FieldNameToId.set(field_name[j], 'c_' + id[j])
      }
      this.AllFieldsWithIdsMaps[this.allBusinessLayouts[i].file_name_business] = FieldNameToId;
    }

  }

  async  getEventLayoutsWithInfo() {
    var resp11 = await this.ruleService.getEventLayoutsWithInfo(this.acct_id);
    console.log(resp11);
    if (resp11['error'] == false) {
      this.eventLayouts = [];
      this.allEventLayouts = resp11.data;
      for (let i = 0; i < this.allEventLayouts.length; i++) {
        this.eventLayouts.push(this.allEventLayouts[i]);
      }

    }
  }

  async getBusinessFileWithInfo() {
    var resp = await this.ruleService.getBusinessFileWithInfo(this.acct_id);
    if (resp['error'] == false) {
      this.outObj = [];
      this.outFileId = [];
      this.allBusinessLayouts = resp.data;

      for (let i = 0; i < this.allBusinessLayouts.length; i++) {
        this.thenConfigGlobal[this.allBusinessLayouts[i].file_name_business] = this.allBusinessLayouts[i].business_field_name.split(',');
        this.outObj.push(this.allBusinessLayouts[i].file_name_business);
        this.outFileId.push(this.allBusinessLayouts[i].file_id);
      }
      this.AllFieldsWithIdsMapBusiness();

    }
  }


  loadWhenConfig() {
    this.whenConfig = [];

    var arrfd = this.selectedlayout.business_field_names.split(',');
    var arrtype = this.selectedlayout.field_datatypes.split(',');

    this.whenConfig.push(arrfd);
    this.whenConfig.push(arrtype);
    this.rule = {
      when: [],
      then: []
    }
  }


  async loadLookups() {
    this.rulelookup = [];
    var resp = await this.ruleService.ruleLookups(this.acct_id);
    if (resp['error'] == false) {
      var data = resp.data;

      for (let i = 0; i < data.length; i++) {
        this.rulelookup.push(data[i].lookup_name);
      }
    } else {
    }
  }
  async getRule(rule_id) {
    var resp = await this.ruleService.getRules(rule_id);
    if (resp['error'] == false) {
      this.ruleString = resp['data'][0];
    } else {
      this.toastr.errorToastr('Can not Load Rule', 'Error');
    }
  }
  async buildJSON(element) {

    this.whenConfig = [];
    this.rule_id = element.rule_id;
    this.rule_name = element.rule_name;
    this.priority = element.priority;

    var arrfd = this.selectedlayout.business_field_names.split(',');
    var arrtype = this.selectedlayout.field_datatypes.split(',');

    this.whenConfig.push(arrfd)
    this.whenConfig.push(arrtype)

    this.rule = {
      when: [],
      then: []
    }

    this.rule.when = JSON.parse(element.when);
    this.rule.then = JSON.parse(element.then);
    this.thenConfigDis = [];
    this.thenConfig = [];
    for (var j = 0; j < this.rule.then.length; j++) {

      this.thenConfig.push(this.thenConfigGlobal[this.rule.then[j].outObj]);
      this.thenConfigDis.push([]);


      for (var k = 0; k < this.thenConfig[j].length; k++) {
        this.thenConfigDis[j][k] = false;
        for (var l = 0; l < this.rule.then[j].assignments.length; l++) {
          if (this.rule.then[j].assignments[l].key == this.thenConfig[j][k]) {
            this.thenConfigDis[j][k] = true;
          }
        }
      }
    }


  }

  async selectLayouts(event) {

    this.local_flag = 0;
    this.rule_name = undefined;
    this.priority = 0;

    var l = event;
    for (var i = 0; i < this.eventLayouts.length; i++) {
      if (l.event_layout_id == this.eventLayouts[i].event_layout_id) {
        this.selectedlayout = this.eventLayouts[i];
        this.FieldNameToIdMapEvent();

      }
    }

    this.loadWhenConfig();
  }

  whenfields() {
    var obj = { condition: '', fields: {} };

    this.rule.when.push(obj);

  }

  ValueSelected(i) {
    this.rule.when[i].fields.key = "";
  }

  ValueSelectedright(i) {
    this.rule.when[i].fields.value = "";
  }

  cancelwhen(i) {
    this.rule.when.splice(i, 1);

  }
  async copyaction(i) {
    this.thenConfig.push([]);
    this.thenConfigDis.push([]);
    var new_obj = new Object();
    new_obj['outObj'] = this.rule.then[i].outObj;
    new_obj['outFileId'] = this.rule.then[i].outFileId;
    var temp_assignments = [];
    for (let k = 0; k < this.rule.then[i].assignments.length; k++) {
      var obj = Object.assign({}, this.rule.then[i].assignments[k])
      temp_assignments.push(obj);

    }
    new_obj['assignments'] = temp_assignments;
    this.rule.then.push(new_obj);
    this.thenConfigDis = [];
    this.thenConfig = [];
    for (var j = 0; j < this.rule.then.length; j++) {



      this.thenConfig.push(this.thenConfigGlobal[this.rule.then[j].outObj]);
      this.thenConfigDis.push([]);
      for (var k = 0; k < this.thenConfig[j].length; k++) {
        this.thenConfigDis[j][k] = false;
        for (var l = 0; l < this.rule.then[j].assignments.length; l++) {
          if (this.rule.then[j].assignments[l].key == this.thenConfig[j][k]) {
            this.thenConfigDis[j][k] = true;
          }
        }
      }
    }



  }
  async plusthen() {

    var obj = { "outObj": '', "outFileId": 0, "assignments": [] };
    this.rule.then.push(obj);
    this.thenConfig.push([]);
    this.thenConfigDis.push([]);

  }
  eventChangeThen(i) {

    this.rule.then[i].outFileId = this.outFileId[this.outObj.indexOf(this.rule.then[i].outObj)];
    this.rule.then[i].assignments = [];
    this.thenConfig[i] = this.thenConfigGlobal[this.rule.then[i].outObj];
    for (var j = 0; j < this.thenConfig[i].length; j++) {
      this.thenConfigDis[i].push(false);
    }

  }
  plusAssignment(i) {

    var obj = { "key": '', "value": '', "newValue": '' };
    this.rule.then[i].assignments.push(obj);

  }
  cancelselect(i) {
    this.rule.then.splice(i, 1);
    this.thenConfig.splice(i, 1);
    this.thenConfigDis.splice(i, 1);
  }
  newThenRow(i, j) {
    var currArr = this.rule.then[i].assignments;

    for (var l = 0; l < this.thenConfig[i].length; l++) {
      this.thenConfigDis[i][l] = false;
      for (var k = 0; k < currArr.length; k++) {

        if (this.thenConfig[i][l] == currArr[k].key) {
          this.thenConfigDis[i][l] = true;

        }
      }
    }
  }
  cancelthen(i, j) {
    var deleteField = this.rule.then[i].assignments[j].key;
    for (var k = 0; k < this.thenConfig[i].length; k++) {
      if (this.thenConfig[i][k] == deleteField) {
        this.thenConfigDis[i][k] = false;
      }
    }
    this.rule.then[i].assignments.splice(j, 1);


  }
  ValueSelect(i, j) {
    this.rule.then[i].assignments[j].newValue = "";
  }

  changeFieldsNametoCode() {


    for (let i = 0; i < this.rule.when.length; i++) {
      if (this.rule.when[i].fields.leftfunction == 'field') {
        var arr = this.rule.when[i].fields.key.split(' - ');
        var temp = this.FieldNameToId.get(arr[0]) + ' - ' + arr[1];
        this.rule.when[i].fields.key = temp;
      }
      if (this.rule.when[i].fields.rightfunction == 'field') {
        var arr = this.rule.when[i].fields.value.split(' - ');
        var temp = this.FieldNameToId.get(arr[0]) + ' - ' + arr[1];
        this.rule.when[i].fields.value = temp;
      }

      if (this.rule.when[i].fields.leftfunction == 'lookup') {
        var arr = this.rule.when[i].fields.key.split(' - ');
       
        var temp3 = this.FieldNameToId.get(arr[0]) + ' - ' + arr[1];
        this.rule.when[i].fields.key = temp3;
      }
      if (this.rule.when[i].fields.rightfunction == 'lookup') {
        var arr = this.rule.when[i].fields.value.split(' - ');
       
        var temp4 = this.FieldNameToId.get(arr[0]) + ' - ' + arr[1];
        this.rule.when[i].fields.value = temp4;
      }
    }



    for (let j = 0; j < this.rule.then.length; j++) {
      var file_name = this.rule.then[j].outObj;
      var map = this.AllFieldsWithIdsMaps[file_name];

      for (let k = 0; k < this.rule.then[j].assignments.length; k++) {

        this.rule.then[j].assignments[k].key = map.get(this.rule.then[j].assignments[k].key);

        if (this.rule.then[j].assignments[k].value == 'field') {
          this.rule.then[j].assignments[k].newValue = this.FieldNameToId.get(this.rule.then[j].assignments[k].newValue);
        } else if(this.rule.then[j].assignments[k].value == 'lookup'){
          this.rule.then[j].assignments[k].newValue = this.FieldNameToId.get(this.rule.then[j].assignments[k].newValue);
        }
        else {
          this.rule.then[j].assignments[k].newValue = this.rule.then[j].assignments[k].newValue;
        }

      }
    }
  }


  getKeyByValue(object, find_value) {
    var keys = [];
    var values = [];
    for (var [key, value] of object) {
      keys.push(key);
      values.push(value);
    }
    return keys[values.indexOf(find_value)];
  }

  changeFieldCodeToName() {

    for (let i = 0; i < this.rule.when.length; i++) {
      if (this.rule.when[i].fields.leftfunction == 'field') {
        var arr = this.rule.when[i].fields.key.split(' - ');
        var temp = this.getKeyByValue(this.FieldNameToId, arr[0]) + ' - ' + arr[1];
        this.rule.when[i].fields.key = temp;
      }
      if (this.rule.when[i].fields.rightfunction == 'field') {
        var arr = this.rule.when[i].fields.value.split(' - ');
        var temp = this.getKeyByValue(this.FieldNameToId, arr[0]) + ' - ' + arr[1];
        this.rule.when[i].fields.value = temp;
      }
      if (this.rule.when[i].fields.leftfunction == 'lookup') {
        var arr = this.rule.when[i].fields.key.split(' - ');
        var temp3 = this.getKeyByValue(this.FieldNameToId, arr[0]) + ' - ' + arr[1];
        this.rule.when[i].fields.key = temp3;
      }
      if (this.rule.when[i].fields.rightfunction == 'lookup') {
        var arr = this.rule.when[i].fields.value.split(' - ');
        var temp4 = this.getKeyByValue(this.FieldNameToId, arr[0]) + ' - ' + arr[1];
        this.rule.when[i].fields.value = temp4;
      }
    }


    for (let j = 0; j < this.rule.then.length; j++) {
      var file_name = this.rule.then[j].outObj;
      var map = this.AllFieldsWithIdsMaps[file_name];
      for (let k = 0; k < this.rule.then[j].assignments.length; k++) {

        this.rule.then[j].assignments[k].key = this.getKeyByValue(map, this.rule.then[j].assignments[k].key);

        if (this.rule.then[j].assignments[k].value == 'field') {
          this.rule.then[j].assignments[k].newValue = this.getKeyByValue(this.FieldNameToId, this.rule.then[j].assignments[k].newValue);
        }else if(this.rule.then[j].assignments[k].value == 'lookup'){
          this.rule.then[j].assignments[k].newValue = this.getKeyByValue(this.FieldNameToId, this.rule.then[j].assignments[k].newValue);
        }
        else {
          this.rule.then[j].assignments[k].newValue = this.rule.then[j].assignments[k].newValue;
        }

      }
    }


  }

  async SaveModifyRule() {
    this.spinner.show();

    if (this.rule_name === '' || this.rule_name == undefined || this.priority === '' || this.priority == undefined) {
      this.toastr.warningToastr( "Rule Priority or Rule Name Incorrect!");
      this.spinner.hide();
    }
    else {


      await this.changeFieldsNametoCode();

      if (this.local_flag == 1) {
        this.error = ''
        var obj = new Object;
        console.log(this.rule);
        var newRule = this.makeValidJson();
        obj["rule"] = newRule;
        obj["rule_id"] = this.rule_id;
        obj["rule_name"] = this.rule_name;
        obj["acct_id"] = this.acct_id;
        obj["priority"] = this.priority;
        obj["event_layout_id"] = this.selectedlayout.event_layout_id;
        var resp = await this.ruleService.updaterule(obj);
        if (resp['error'] == false) {
          this.spinner.hide();
          this.toastr.successToastr("Updated Successfully", 'Success!');
        } else {
          this.spinner.hide();
          this.toastr.errorToastr("Operation Failed", 'Error!');
        }
        await this.getRule(this.rule_id);
        await this.buildJSON(this.ruleString);
      } 
      else {
        this.error = ''
        var obj3 = new Object;
        var newRule = this.makeValidJson();

        obj3["rule_name"] = this.rule_name;
        obj3["priority"] = this.priority;
        obj3["rule"] = newRule;
        obj3["acct_id"] = this.acct_id;
        obj3["event_layout_id"] = this.selectedlayout.event_layout_id;

        var resp = await this.ruleService.createrule1(obj3)
        if ((resp['error'] == false)) {

          this.spinner.hide();
          this.toastr.successToastr("Created Successfully");

          await this.getRule(resp["rule_id"]);
          await this.buildJSON(this.ruleString);
          this.local_flag = 1
          // this.router.navigate(['/rules/rulesdefinition']);

        } else {

          this.spinner.hide();
          this.toastr.errorToastr("Operation Failed", 'Error!');
        }

      }

      await this.changeFieldCodeToName();
    }


  }

  makeValidJson() {

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


    return newRule;
  }


  Goback() {
    this.router.navigate(['/rules/rulelist']);
  }
  async compile() {
    this.spinner.show();
    if (this.local_flag == 1) {
      var obj = new Object();
      obj["rule_id"] = this.rule_id;
      obj["acct_id"] = this.acct_id;
      obj["operation"] = "compile";
    
      var resp = await this.ruleService.compileRule(obj);

      if ((resp['error'] == false)) {

        this.spinner.hide();
        this.toastr.successToastr(resp["data"], 'Success!');


      } else {
        this.spinner.hide();
        this.toastr.errorToastr(resp["data"], 'Error!');
      }
    }
    else {
      this.spinner.hide();
      this.toastr.errorToastr("Save Rule First!", 'Error!');
    }

  }

}
