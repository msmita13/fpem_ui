import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';


import { RuleService } from '../../service/rule.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  dataSource;
  selectedlayout;
  allRules = [];
  selectedfield = [];
  eventLayouts = [];
  allEventLayouts = [];
  acc_id;
  fields = [];
  selected = '';
  data = [];
  displayedColumns = ['priority', 'rule_name'];
  fpemUser;

  constructor(private ruleService: RuleService, private spinner: NgxSpinnerService) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  async ngOnInit() {

    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));
    this.acc_id = this.fpemUser.acct_id;
    this.getAllRules();
     await this.getEventLayoutsWithInfo();
    /* var resp1 = await this.ruleService.getAllLayouts(this.acc_id);
    if (resp1['error'] == false) {
      this.allLayouts = resp1.data;
      for (var i = 0; i < this.allLayouts.length; i++) {
        if (this.allLayouts[i].file_type == 'Event Layout') {
          this.eventLayouts.push(this.allLayouts[i]);
        }
      }
    } */
    this.selectedlayout = this.eventLayouts[0];
    this.selectLayouts();
    this.selectfield();
  }

  async  getEventLayoutsWithInfo() {
    var resp11 = await this.ruleService.getEventLayoutsWithInfo(this.acc_id);
    if (resp11['error'] == false) {
      this.eventLayouts = [];
      this.allEventLayouts = resp11.data;
      for (let i = 0; i < this.allEventLayouts.length; i++) {
        this.eventLayouts.push(this.allEventLayouts[i]);
      }

    }
  }



  selectfield() {

    console.log(this.selectedfield)
    if (this.selectedfield != []) {
      this.fields = this.selectedlayout.field_names.split(",")
      this.data = [];
      for (var i = 0; i < this.allRules.length; i++) {
        if (this.allRules[i].input_layout_id == this.selectedlayout.file_id) {
          this.data.push(this.allRules[i]);
        }
      }
      console.log(this.selectedfield)
      var arr = [];
      for (let i = 0; i < this.data.length; i++) {
        var check = '';
        for (let j = 0; j < this.selectedfield.length; j++) {

          if (this.data[i].when.includes(this.selectedfield[j])) {
            check += 'true';
          }
          else {
            check += 'false';
          }
        }
        if (!check.includes('false')) {
          arr.push(this.data[i])

        }
      }
      console.log(arr)

      this.data = arr;

      this.matTable();
    }


  }
  async getAllRules() {
    var resp = await this.ruleService.getRuleforManage(this.acc_id);
    if (resp['error'] == false) {
      this.allRules = resp.data;

    } else {
    }


  }


  async selectLayouts() {
   this.selectedfield=[];
    console.log(this.selectedlayout)
    this.fields = this.selectedlayout.field_names.split(",")
    this.data = [];
    for (var i = 0; i < this.allRules.length; i++) {
      if (this.allRules[i].input_layout_id == this.selectedlayout.file_id) {
        this.data.push(this.allRules[i]);
      }
    }


    this.matTable();

  }
  matTable() {
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
