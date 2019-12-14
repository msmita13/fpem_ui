import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { NgxSpinnerService } from "ngx-spinner";
import { MatSort } from '@angular/material/sort';
import { RuleService } from 'src/app/service/rule.service';
import { ToastrManager } from 'ng6-toastr-notifications';
declare var $;
@Component({
  selector: 'app-manage',
  templateUrl: './rule-lookup.component.html',
  styleUrls: ['./rule-lookup.component.css']
})

export class RuleLookupComponent implements OnInit {
  dataSource;
  fpemUser;
  displayedColumns = ['lookupName', 'tableName', 'Key', 'value', 'update', 'delete'];
  data = [];
  lookups = [];
  addLookupdata;
  acct_id;
  reference_name = [""];
  selectedRefName;
  keyArr = [""];
  tt = '';
  selectedKey;
  valueArr = [];
  selectedValue;
  lookup_name;
  lookup_id;
  constructor(private toastr: ToastrManager, private ruleService: RuleService, private spinner: NgxSpinnerService) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  async ngOnInit() {
    $("#updateLookup").draggable({
      handle: ".modal-dialog "
    });
    $("#addLookup").draggable({
      handle: ".modal-dialog "
    });
    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id = this.fpemUser.acct_id;
    await this.getLookups();
    await this.dataForLookup();
  }

  async getLookups() {
    var resp1 = await this.ruleService.getLookups(this.acct_id);
    if (resp1['error'] == false) {
      this.lookups = resp1.data;
      this.dataSource = new MatTableDataSource(this.lookups);
    }
    else {
    }
  }

  async add() {
    this.reference_name = [''];
    for (let i = 0; i < this.addLookupdata.length; i++) {
      this.reference_name.push(this.addLookupdata[i].reference_file_name_business)
    }
  }

  RefnameChange() {
    this.valueArr = [];
    if (this.selectedRefName != '') {
      for (let i = 0; i < this.addLookupdata.length; i++) {
        if (this.selectedRefName == this.addLookupdata[i].reference_file_name_business) {
          this.keyArr = this.addLookupdata[i].business_field_name.split(",")
        }
      }
    }
  }

  keyChange() {
    this.RefnameChange();
    this.valueArr = [];
    for (let i = 0; i < this.keyArr.length; i++) {
      if (this.selectedKey == this.keyArr[i]) {
      } else {
        this.valueArr.push(this.keyArr[i])
      }
    }
  }

  async dataForLookup() {
    var resp1 = await this.ruleService.DataForLookup(this.acct_id);
    console.log(resp1)
    if (resp1['error'] == false) {
      this.addLookupdata = resp1.data;
      console.log(this.addLookupdata)
    }
  }

  async addnewlayout() {
    var business_field_name = []
    var technical_field_name = []
    var table_name;
    for (let i = 0; i < this.addLookupdata.length; i++) {
      if (this.selectedRefName == this.addLookupdata[i].reference_file_name_business) {
        business_field_name = this.addLookupdata[i].business_field_name.split(",")
        technical_field_name = this.addLookupdata[i].technical_field_name.split(",")
        table_name = this.addLookupdata[i].ref_file_name;
      }
    }
    console.log(business_field_name)
    console.log(technical_field_name)
    console.log(this.selectedRefName)
    var obj = new Object();
    obj["lookup_name"] = this.lookup_name;
    obj["acct_id"] = this.acct_id;
    obj["table_name"] = table_name;
    obj['business_file_desc'] = this.selectedRefName;
    obj["key"] = technical_field_name[business_field_name.indexOf(this.selectedKey)]
    obj["key_desc"] = this.selectedKey
    obj["value"] = technical_field_name[business_field_name.indexOf(this.selectedValue)]
    obj["value_desc"] = this.selectedValue

    console.log(obj);

    var resp1 = await this.ruleService.addLookup(obj);
    if (resp1['error'] == false) {
      this.toastr.successToastr('Lookup Added Successfully', 'Success!');
      this.getLookups()
    } else {
      this.toastr.errorToastr(resp1.data, 'Error!');
    }
  }
  async delete(element, i) {
    this.lookup_id = element.id;
    var resp1 = await this.ruleService.deletelookup(this.lookup_id);
    if (resp1['error'] == false) {
      this.toastr.successToastr('Lookup Delete Successfully', 'Success!');
      this.getLookups()
    } else {
      this.toastr.errorToastr(resp1.data, 'Error!');
    }
  }

  async updatepop(element, i) {
    this.reference_name = [];
    console.log(element.table_name)
    console.log(element.lookup_name)
    console.log(element.key_desc)
    console.log(element.value_desc)
    console.log(element)
    this.lookup_id = element.id;
    this.lookup_name = element.lookup_name;
    for (let i = 0; i < this.addLookupdata.length; i++) {
      this.reference_name.push(this.addLookupdata[i].reference_file_name_business)
    }
    this.selectedRefName = element.reference_file_name_business;
    await this.RefnameChange();
    this.selectedKey = element.key_desc;
    await this.keyChange();
    this.selectedValue = element.value_desc;

  }

  async updateLookup() {
    var business_field_name = []
    var technical_field_name = []
    var table_name;
    for (let i = 0; i < this.addLookupdata.length; i++) {
      if (this.selectedRefName == this.addLookupdata[i].reference_file_name_business) {
        business_field_name = this.addLookupdata[i].business_field_name.split(",")
        technical_field_name = this.addLookupdata[i].technical_field_name.split(",")
        table_name = this.addLookupdata[i].ref_file_name;
      }
    }
    console.log(business_field_name)
    console.log(technical_field_name)
    var obj = new Object();
    obj["id"] = this.lookup_id;
    obj["lookup_name"] = this.lookup_name;
    obj["table_name"] = table_name;
    obj['business_file_desc'] = this.selectedRefName;
    obj["key"] = technical_field_name[business_field_name.indexOf(this.selectedKey)]
    obj["key_desc"] = this.selectedKey
    obj["value"] = technical_field_name[business_field_name.indexOf(this.selectedValue)]
    obj["value_desc"] = this.selectedValue

    console.log(obj)

    var resp1 = await this.ruleService.updatelookup(obj);
    if (resp1['error'] == false) {
      this.toastr.successToastr('Lookup update Successfully', 'Success!');
      this.getLookups()
    } else {
      this.toastr.errorToastr(resp1.data, 'Error!');
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
