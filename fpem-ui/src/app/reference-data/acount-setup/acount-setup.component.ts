import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ReferenceDataService } from '../../service/reference-data.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ThrowStmt } from '@angular/compiler';
declare var $: any;


@Component({
  selector: 'app-acount-setup',
  templateUrl: './acount-setup.component.html',
  styleUrls: ['./acount-setup.component.css']
})
export class AcountSetupComponent implements OnInit {
  data = [];
  fpemUser
  dataSource;
  acct_id;
  obj={acct_id:'',acct_num:'',acct_num_desc:'',acct_type_cd:'',on_off_indicator:'',on_balancesheet_account:'',off_balancesheet_account:'',book_cd:'',reclass_account:''}
  yesNoObj={1: 'YES',0: 'NO'}
  account_obj={A:'Asset',L:'Liability',Q:'Equity',I:'Income',E:'Expense',O:'Other'};
  book_cds=[];
  reclass_accounts=[];
  book_xref_reclass_account={HKGP:'',USGP:'',INGP: '',CAGP:'',UKGP:''}
  displayedColumns = ['account_number', 'account_description', 'account_type', 'balance_sheet', 'other_detail', 'edit', 'delete'];
  constructor(private refService: ReferenceDataService, private spinner: NgxSpinnerService, private toastr: ToastrManager) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  async ngOnInit() {
    $("#otherDetail").draggable({
      handle: ".modal-dialog "
    });
    $("#editDetail").draggable({
      handle: ".modal-dialog "
    });
    $("#add").draggable({
      handle: ".modal-dialog "
    });

    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id = this.fpemUser.acct_id;

    await this.getAccountDetails();
  }
  async getAccountDetails() {
    var resp = await this.refService.getRefAccountDetail(this.acct_id);
    if (resp['error'] == false) {
      this.data = resp.data;

      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.sort = this.sort;
      
      this.dataSource.paginator = this.paginator;
    } else {
      this.toastr.errorToastr('Some Error Occurred')
    }
  }
  async other_Detail(element, i) {
    this.obj=element;
    if(this.obj['book_cd']==null){
      this.book_cds=[];
      this.reclass_accounts=[];
    }else{
      this.book_cds=this.obj['book_cd'].split(',');
      this.reclass_accounts=this.obj['reclass_account'].split(',')
    }
    

  }


  async edit(element, i) {
    this.obj=element;
    if(this.obj['book_cd']==null){
      this.book_cds=[];
      this.reclass_accounts=[];
      this.book_xref_reclass_account={HKGP:'',USGP:'',INGP: '',CAGP:'',UKGP:''}

    }else{
      this.book_cds=this.obj['book_cd'].split(',');
      this.reclass_accounts=this.obj['reclass_account'].split(',');
      for(var j=0;j<this.book_cds.length;j++){
        this.book_xref_reclass_account[this.book_cds[j]]=this.reclass_accounts[j]
      }
    }
  }

  async update() {
    this.obj['acct_id']=this.acct_id;
    this.obj['book_cd']='';
    this.obj['reclass_account']='';
    if(this.book_xref_reclass_account['USGP']!='' && this.book_xref_reclass_account['USGP']!=null && this.book_xref_reclass_account['USGP']!=undefined){
      this.obj['book_cd']=this.obj['book_cd']+'USGP'+',';
      this.obj['reclass_account']=this.obj['reclass_account']+this.book_xref_reclass_account['USGP']+',';
    }
    if(this.book_xref_reclass_account['INGP']!='' && this.book_xref_reclass_account['INGP']!=null && this.book_xref_reclass_account['INGP']!=undefined){
      this.obj['book_cd']=this.obj['book_cd']+'INGP'+',';
      this.obj['reclass_account']=this.obj['reclass_account']+this.book_xref_reclass_account['INGP']+',';
    }
    if(this.book_xref_reclass_account['UKGP']!='' && this.book_xref_reclass_account['UKGP']!=null && this.book_xref_reclass_account['UKGP']!=undefined){
      this.obj['book_cd']=this.obj['book_cd']+'UKGP'+',';
      this.obj['reclass_account']=this.obj['reclass_account']+this.book_xref_reclass_account['UKGP']+',';
    }
    if(this.book_xref_reclass_account['HKGP']!='' && this.book_xref_reclass_account['HKGP']!=null && this.book_xref_reclass_account['HKGP']!=undefined){
      this.obj['book_cd']=this.obj['book_cd']+'HKGP'+',';
      this.obj['reclass_account']=this.obj['reclass_account']+this.book_xref_reclass_account['HKGP']+',';
    }
    if(this.book_xref_reclass_account['CAGP']!='' && this.book_xref_reclass_account['CAGP']!=null && this.book_xref_reclass_account['CAGP']!=undefined){
      this.obj['book_cd']=this.obj['book_cd']+'CAGP'+',';
      this.obj['reclass_account']=this.obj['reclass_account']+this.book_xref_reclass_account['CAGP']+',';
    }
    this.obj['book_cd']=this.obj['book_cd'].substring(0,this.obj['book_cd'].length-1);
    this.obj['reclass_account']=this.obj['reclass_account'].substring(0,this.obj['reclass_account'].length-1)
    if(this.obj['book_cd']==undefined|| this.obj['book_cd']=='' || this.obj['book_cd']==null){
      this.obj['book_cd']=null;
      this.obj['reclass_account']=null;
    }
    console.log(this.obj);
    this.spinner.show();
    var resp = await this.refService.Account_Setup_update(this.obj);
    if (resp['error'] == false) {
      console.log(resp)
      await this.getAccountDetails();
      
      this.spinner.hide();
      this.toastr.successToastr('Updated Successfully')
    } else {
      this.spinner.hide();
      this.toastr.errorToastr(resp['data']);
    }
  }
  async deleteRefacc(element, i) {
    this.spinner.show();
    var obj = new Object();
    obj['acct_id'] = this.acct_id;
    obj['acct_num'] = element.acct_num;
    var params = JSON.stringify(obj);
    var resp = await this.refService.deleteAccount(params);
    if (resp['error'] == false) {
      this.data.splice(i, 1);
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;

      this.dataSource.sort = this.sort;
      this.spinner.hide();
      this.toastr.successToastr('Deleted Successfully')
    } else {
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'])
    }
    this.spinner.hide();
  }
  applyFilter(filterValue: string) {

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  async selectoption(event) {

  }
  async addNewRow() {

    this.obj['acct_id']=this.acct_id;
    this.obj['book_cd']='';
    this.obj['reclass_account']='';
    if(this.book_xref_reclass_account['USGP']!='' && this.book_xref_reclass_account['USGP']!=null && this.book_xref_reclass_account['USGP']!=undefined){
      this.obj['book_cd']=this.obj['book_cd']+'USGP'+',';
      this.obj['reclass_account']=this.obj['reclass_account']+this.book_xref_reclass_account['USGP']+',';
    }
    if(this.book_xref_reclass_account['INGP']!='' && this.book_xref_reclass_account['INGP']!=null && this.book_xref_reclass_account['INGP']!=undefined){
      this.obj['book_cd']=this.obj['book_cd']+'INGP'+',';
      this.obj['reclass_account']=this.obj['reclass_account']+this.book_xref_reclass_account['INGP']+',';
    }
    if(this.book_xref_reclass_account['UKGP']!='' && this.book_xref_reclass_account['UKGP']!=null && this.book_xref_reclass_account['UKGP']!=undefined){
      this.obj['book_cd']=this.obj['book_cd']+'UKGP'+',';
      this.obj['reclass_account']=this.obj['reclass_account']+this.book_xref_reclass_account['UKGP']+',';
    }
    if(this.book_xref_reclass_account['HKGP']!='' && this.book_xref_reclass_account['HKGP']!=null && this.book_xref_reclass_account['HKGP']!=undefined){
      this.obj['book_cd']=this.obj['book_cd']+'HKGP'+',';
      this.obj['reclass_account']=this.obj['reclass_account']+this.book_xref_reclass_account['HKGP']+',';
    }
    if(this.book_xref_reclass_account['CAGP']!='' && this.book_xref_reclass_account['CAGP']!=null && this.book_xref_reclass_account['CAGP']!=undefined){
      this.obj['book_cd']=this.obj['book_cd']+'CAGP'+',';
      this.obj['reclass_account']=this.obj['reclass_account']+this.book_xref_reclass_account['CAGP']+',';
    }
    this.obj['book_cd']=this.obj['book_cd'].substring(0,this.obj['book_cd'].length-1);
    this.obj['reclass_account']=this.obj['reclass_account'].substring(0,this.obj['reclass_account'].length-1)
    if(this.obj['book_cd']==undefined|| this.obj['book_cd']=='' || this.obj['book_cd']==null){
      this.obj['book_cd']=null;
      this.obj['reclass_account']=null;
    }
    console.log(this.obj);
    this.spinner.show();
    var resp = await this.refService.Account_Setup_insert(this.obj);
    if (resp['error'] == false) {
      console.log(resp)
      await this.getAccountDetails();
      
      this.spinner.hide();
      this.toastr.successToastr('Added Successfully')
    } else {
      this.spinner.hide();
      this.toastr.errorToastr(resp['data']);
    }
  }
   async add(){
 
  }
}