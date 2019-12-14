import { Component, OnInit,ViewChild } from '@angular/core';

import { ControlsService } from '.././/.//../service/controls.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatTableDataSource } from '@angular/material';
@Component({
  selector: 'app-activity-dashboard',
  templateUrl: './activity-dashboard.component.html',
  styleUrls: ['./activity-dashboard.component.css']
})
export class ActivityDashboardComponent implements OnInit {
  fpemUser;

  dataSource;

  ppds = [];
  runids = {};
  runArr=[];
  ppdArr=[];
  selectedRunId;
  selectedPpd;
  allData=[];
  data=[];
  error='';
  displayedColumns=['process_name','organisation_code','num_of_records']
  constructor(private controlsService: ControlsService, private spinner: NgxSpinnerService, public toastr: ToastrManager) { }
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  async ngOnInit() {
    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));
    //await this.getAllPpdRunId();
    await this.getAllActivity();

  }

  async getAllActivity() {
    this.error='';
    this.ppds = [];
    this.runids = {};
    this.runArr=[];
    this.ppdArr=[];
    var resp = await this.controlsService.getAllActivity(this.fpemUser.acct_id);
    if (resp['error'] == false) {
      if(resp.data.length==0){
        this.error="No data found."
      }else{
        this.allData=resp.data;
        for(var i=0;i<resp.data.length;i++){

          if(this.ppds.indexOf(resp.data[i].ppd)<0){
            this.ppds.push(resp.data[i].ppd);
            this.runids[resp.data[i].ppd] = [resp.data[i].run_id]; 
          }else{
            if(this.runids[resp.data[i].ppd].indexOf(resp.data[i].run_id)<0 ){
              this.runids[resp.data[i].ppd].push(resp.data[i].run_id);
            }
          }
        }
        var tempArr=[]
        for(var i=0;i<this.ppds.length;i++){
          tempArr.push({date: this.ppds[i]})
        }
        this.ppdArr=tempArr;
        this.selectedPpd=this.ppdArr[this.ppdArr.length-1].date;
        var tempRunArr=[];
        for(var i=0;i<this.runids[this.selectedPpd].length;i++){
          tempRunArr.push({run_id: this.runids[this.selectedPpd][i]});
        }
        this.runArr=tempRunArr;
        this.selectedRunId=this.runArr[this.runArr.length-1].run_id;
        this.buildDataArr();
        
      }
    }else{
      this.error="Some error occurred at server side."
    }
  }
  changeppd(){
    var tempRunArr=[];
    for(var i=0;i<this.runids[this.selectedPpd].length;i++){
      tempRunArr.push({run_id: this.runids[this.selectedPpd][i]});
    }
    this.runArr=tempRunArr;
    this.selectedRunId=this.runArr[this.runArr.length-1].run_id;
    this.buildDataArr();
  }
  changeRun(){
    this.buildDataArr();

  }
  buildDataArr(){
    this.data=[];
    for(var i=0;i<this.allData.length;i++){
      if(this.allData[i].ppd==this.selectedPpd && this.allData[i].run_id==this.selectedRunId){
        this.data.push(this.allData[i]);

      }
    }
    console.log(this.data);
    this.dataSource=new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
   
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
