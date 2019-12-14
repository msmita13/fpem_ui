import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import {ReferenceDataService} from '../../service/reference-data.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ThrowStmt } from '@angular/compiler';
declare var  $: any;


@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.css']
})
export class InsertComponent implements OnInit {
  dt = {};
  fpemUser;
  acct_id;
  fields=[];
  dataSource = new MatTableDataSource();
  data=[];
  acct_store;
  displayedColumns: string[] = [];
  showColumns=[];
  idColumns=[];
  displayColumns=[]
  files;
  selectedFileIndex=0;
  selectedFileId;
  constructor(private refService: ReferenceDataService, private spinner: NgxSpinnerService,private toastr: ToastrManager) { }
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  async ngOnInit() {
    $("#add").draggable({
      handle: ".modal-dialog "
    });
    $("#update").draggable({
      handle: ".modal-dialog "
    });
   
    this.fpemUser=JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id=this.fpemUser.acct_id;
    

    await this.referenceFiles();
    await this.getFields();
    await this.getStore();
    if(this.files.length>0){
    this.selectedFileId=this.files[0].id;
    await this.getDisplayedColumns(0);
    }
    

   
    
    
  }
  chooseAnother(){

    var index=0;
    for(var i=0;i<this.files.length;i++){
      if(this.files[i].id==this.selectedFileId){
        index=i;
      }
    }
    console.log(index);
    this.selectedFileIndex=index;
    this.getDisplayedColumns(index);
  }
  async getFields(){
    var resp = await this.refService.getconfiguredFields(this.acct_id);
    if (resp['error'] == false) {

      this.fields = resp.data;
      console.log(this.fields);

    } else {
      
    }
  }
  async getStore(){
    var resp=await this.refService.getAccountStore(this.acct_id);
    console.log(resp);
    if(resp['error']==false){
      this.acct_store=resp.data;
    }else{

    }
  }
  async referenceFiles(){
    var resp = await this.refService.getAllReferenceFiles(this.acct_id);
    if (resp['error'] == false) {
      this.files = resp.data;
      console.log(this.files);
      
    
     
    } else {

    }
  }
  async getDisplayedColumns(k){
    console.log(k);
    this.data=[];
    this.idColumns=[];
    this.displayColumns=[];
    this.dataSource=new MatTableDataSource(this.data);
    this.displayedColumns=[];
    this.showColumns=[];
    
    var refFields=this.files[k].field_id.split(',');
    for(var i=0;i<this.fields.length;i++){

      for(var j=0;j<refFields.length;j++){

        if(parseInt(refFields[j])==this.fields[i].field_id){
          this.idColumns.push("c_"+refFields[j]);
          this.displayColumns.push("c_"+refFields[j]);
          
          this.showColumns.push(this.fields[i].business_field_name);
        }
       
      }
    }
    this.idColumns.push('is_active');
    this.displayColumns.push('is_active');
    this.showColumns.push('Status');
    this.displayColumns.push('edit');
    this.displayColumns.push('delete');
    this.displayedColumns=this.displayColumns;
    console.log(this.displayedColumns);
   
    console.log(this.displayedColumns);
    console.log(this.showColumns);
    await this.getRows(k);
  }
  async getRows(k){
    var obj=new Object();
    obj['acct_id']=this.acct_id;
    obj['ref_file_id']=this.files[k].id;
    obj['store']=this.files[k].store;
    console.log(obj);
    var resp= await this.refService.getReferenceData(obj);
    console.log(resp);
    if(resp['error']==false){
      this.data=resp.data;
      this.dataSource=new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
   
       this.dataSource.sort = this.sort;
    }else{

    }
  }
  clearObject(){
    this.dt={};
  }
 async addNewRow(){
  
   this.spinner.show();
    var obj=new Object();
    obj['acct_id']=this.acct_id;
    if(this.files[this.selectedFileIndex].reference_file_type=='Hierarchy'){
      obj['store']=this.acct_store;
    }else{
      obj['store']="MySQL"
    }
    obj['ref_file_id']=this.files[this.selectedFileIndex].id;
    obj['data']=this.dt;
    console.log(obj);
    var resp=await this.refService.insertRow(obj);
    if(resp['error']==false){
      await this.getDisplayedColumns(this.selectedFileIndex);
      this.spinner.hide();
      this.toastr.successToastr('Inserted Successfully','Success!')
    }else{
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'],'Oops!');
    }
    
  }
  async deleteRow(element,i){
    this.spinner.show();
    var obj=new Object();
    obj['acct_id']=this.acct_id;
    if(this.files[this.selectedFileIndex].reference_file_type=='Hierarchy'){
      obj['store']=this.acct_store;
    }else{
      obj['store']="MySQL"
    }
    obj['ref_file_id']=this.files[this.selectedFileIndex].id;
    obj['uuid']=element.uuid;
    console.log(obj);
    var resp = await this.refService.deleteRow(obj);
    if(resp['error']==false){
      this.data.splice(i,1);
      this.dataSource=new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
   
       this.dataSource.sort = this.sort;
      this.spinner.hide();
      this.toastr.successToastr('Deleted Successfully','Success!')
    }else{
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'],'Oops!')
    }
  }
  async activateAll(){
    this.spinner.show();
    var obj=new Object();
    obj['acct_id']=this.acct_id;
    if(this.files[this.selectedFileIndex].reference_file_type=='Hierarchy'){
      obj['store']=this.acct_store;
    }else{
      obj['store']="MySQL"
    }
    obj['ref_file_id']=this.files[this.selectedFileIndex].id;
    obj['state']=1;
    var resp=await this.refService.changeStateOfAllRows(obj);
    console.log(resp);
    if(resp['error']==false){
      await this.getDisplayedColumns(this.selectedFileIndex);
      this.spinner.hide();
      this.toastr.successToastr('Activated Successfully','Success!')
    }else{
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'],'Oops!');
    }
  }
  async deactivateAll(){
    this.spinner.show();

    var obj=new Object();
    obj['acct_id']=this.acct_id;
    if(this.files[this.selectedFileIndex].reference_file_type=='Hierarchy'){
      obj['store']=this.acct_store;
    }else{
      obj['store']="MySQL"
    }
    obj['ref_file_id']=this.files[this.selectedFileIndex].id;
    obj['state']=0;
    var resp=await this.refService.changeStateOfAllRows(obj);
    if(resp['error']==false){
      await this.getDisplayedColumns(this.selectedFileIndex);
      this.spinner.hide();
      this.toastr.successToastr('Deactivated Successfully','Success!')
    }else{
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'],'Oops!');
    }
  }
  async deleteAll(){
    this.spinner.show();

    var obj=new Object();
    obj['acct_id']=this.acct_id;
    if(this.files[this.selectedFileIndex].reference_file_type=='Hierarchy'){
      obj['store']=this.acct_store;
    }else{
      obj['store']="MySQL"
    }
    obj['ref_file_id']=this.files[this.selectedFileIndex].id;
    var resp=await this.refService.deleteAllRows(obj);
    if(resp['error']==false){
      await this.getDisplayedColumns(this.selectedFileIndex);
      this.spinner.hide();
      this.toastr.successToastr('Deleted Successfully','Success!')
    }else{
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'],'Oops!');
    }
  }
  clickUpdate(element,j){
    this.dt={};
    var obj=this.data[j];
   this.dt=obj;
  }
  applyFilter(filterValue: string) {
    
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  async updateRow(){
    this.spinner.show();
    var obj=new Object();
    obj['acct_id']=this.acct_id;
    if(this.files[this.selectedFileIndex].reference_file_type=='Hierarchy'){
      obj['store']=this.acct_store;
    }else{
      obj['store']="MySQL"
    }
    obj['ref_file_id']=this.files[this.selectedFileIndex].id;
    obj['data']=this.dt;
    obj['uuid']=this.dt['uuid'];
    console.log(obj);
    var resp=await this.refService.updateRow(obj);
    if(resp['error']==false){
      await this.getDisplayedColumns(this.selectedFileIndex);
      this.spinner.hide();
      this.toastr.successToastr('Updated Successfully','Success!')
    }else{
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'],'Oops!');
    }
  }

}
