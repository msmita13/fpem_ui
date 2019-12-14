import { Component, OnInit , ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import {ReferenceDataService} from '../../service/reference-data.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ThrowStmt } from '@angular/compiler';
declare var  $: any;
@Component({
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.css']
})
export class ExchangeRateComponent implements OnInit {

  data = [];
  fpemUser
  dataSource;
  acct_id;
  obj={};
  displayedColumns = ['from_currency', 'to_currency','rate','eff_date' ,'edit', 'delete'];
  constructor(private refService: ReferenceDataService, private spinner: NgxSpinnerService,private toastr: ToastrManager) { }
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  async ngOnInit() {
    $("#add").draggable({
      handle: ".modal-dialog "
    });
    $("#editDetail").draggable({
      handle: ".modal-dialog "
    });
   
    this.fpemUser=JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id=this.fpemUser.acct_id;
  
    await this.getExchangeRate();
   }
  async getExchangeRate(){
    var resp = await this.refService.getExchangeRate(this.acct_id);
    if (resp['error'] == false) {
      this.data = resp.data;
      console.log(this.data);
      
      this.dataSource=new MatTableDataSource(this.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
     
    } else {
    }
   }
   async updateExchnageRate(){

   }
   async addRow(){
     this.spinner.show();
     this.obj['acct_id']=this.acct_id
     var resp = await this.refService.addExchnageRate(this.obj);
     if(resp['error']==false){
        this.getExchangeRate();
        this.spinner.hide();
        this.toastr.successToastr('Added Successfully','Success!');
     }else{
      this.spinner.hide();
      this.toastr.errorToastr('Failed','Oops!');
     }
     this.obj={};

   }
   async updateRow(){
    this.spinner.show();
    this.obj['acct_id']=this.acct_id;
    this.obj['eff_date']=this.obj['eff_date'];
    var resp = await this.refService.updateExchnageRate(this.obj);
    console.log(resp);
    if(resp['error']==false){
       this.getExchangeRate();
       this.spinner.hide();
       this.toastr.successToastr('Added Successfully','Success!');
    }else{
     this.spinner.hide();
     this.toastr.errorToastr('Failed','Oops!');
    }
    this.obj={};

  }
   async deleteExchangeRate(element,i){
     var row = new Object();
     row['acct_id']=this.acct_id;
     row['ref_id']=element.ref_id;
     var resp = await this.refService.deleteExchangeRate(row);
     if(resp['error']==false){
        this.getExchangeRate();
        this.spinner.hide();
        this.toastr.successToastr('Deleted Successfully','Success!');
     }else{
      this.spinner.hide();
      this.toastr.errorToastr('Failed','Oops!');
     }
     this.obj={};

   }
 
   openUpdateExchangeRate(element,i){
     this.obj=element;

   }
   applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  




}
