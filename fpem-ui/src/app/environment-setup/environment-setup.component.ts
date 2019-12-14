import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import Stepper from 'bs-stepper';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { EnvironmentSetupService } from '../service/environment-setup.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrManager } from 'ng6-toastr-notifications';
import {Router} from '@angular/router';
declare var  $: any;
@Component({
  selector: 'app-environment-setup',
  templateUrl: './environment-setup.component.html',
  styleUrls: ['./environment-setup.component.css']
})
export class EnvironmentSetupComponent implements OnInit {
  start_months;
  end_months;
  name;
  date;

  Journal=[];
  Journal_temp=[];
  
  Sal=[];
  Sal_temp=[];
  
  Ip=[];
  Ip_temp;

  Audit=[];
  Audit_temp=[];

  dataSource;
  displayedColumns = ['business_field_name','field_datatype','logical_field_name','is_nullable','delete'];

  business_field_name;
  datatype;
  is_nullable;

  allFields=[];

  allDatatype=['String','Date','Double','Number']

  Process=[];
  allLogicalFields=[];

  presentationCurrency=[];
  selectedProcessNameId=[];
  selectedProcessId=[];
  store;

  currency;
  
  Months=[{full_name:'January'},
          {full_name:'February'},
          {full_name:'March'},
          {full_name:'April'},
          {full_name:'May'},
          {full_name:'June'},
          {full_name:'July'},
          {full_name:'August'},
          {full_name:'September'},
          {full_name:'October'},
          {full_name:'November'},
          {full_name:'December'}
        ];

  constructor(private router: Router,private environmentSetup: EnvironmentSetupService, private spinner: NgxSpinnerService, public toastr: ToastrManager) { }

  private stepper: Stepper;

  fpemUser;
  FieldNameToId : Map <String, number> = new Map<String, number>();
  FieldNameToDataType : Map <String, String> = new Map<String, String>();
  FieldNameToTechName: Map <String, String> = new Map<String, String>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  async ngOnInit() {

    // getAll System Data Cureency
    //if step 0 is complete then saved info
    // if step 0 is not complete then template 

    //Save general info
    //update general info
    

    var resp = await this.environmentSetup.getAllSystemDataCureency();
    if (resp['error'] == false) {
    this.currency=resp.data;
    }


    var resp1 = await this.environmentSetup.getAllProcess();
    if (resp1['error'] == false) {
    this.Process=resp1.data;

    }

    var resp2 = await this.environmentSetup.getAllLogicalFields();
    if (resp2['error'] == false) {
    this.allLogicalFields=resp2.data;

    }
    this.fpemUser=JSON.parse(localStorage.getItem('fpemUser'));

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: true,
      animation: true,
    });

    if(this.fpemUser.steps_completed==0){
      this.getDefaultGeneralData();
    }
    else if(this.fpemUser.steps_completed>0){
      this.getSavedGeneralData(); 
    }

    if(this.fpemUser.steps_completed==1){     
      this.getDefaultProcess();
      this.getDefaultFields();
    }else if(this.fpemUser.steps_completed>1){
      this.getconfiguredFields();
      this.getconfiguredProcesses();
    }

    if(this.fpemUser.steps_completed==2){

      this.getDefaultSalInfo();
      this.getDefaultIpInfo();
      this.getDefaultJournalInfo();
      this.getDefaultAuditInfo();
    

    }else  {

      // this.getDefaultSalInfo();
      // this.getDefaultIpInfo();
      // this.getDefaultJournalInfo();
      // this.getDefaultAuditInfo();



    }  
  }

async  getDefaultAuditInfo(){

    var resp = await this.environmentSetup.getDefaultAuditInfo(this.fpemUser.ind_id);
    

      this.Audit=resp.data;

      this.Audit_temp=[];

  for(let i=0;i<this.Audit.length;i++){
    var obj = new Object();
    this.store=this.Audit[i].store;
  
    obj['business_field_name']=this.Audit[i].business_field_name;
    obj['field_logical_id']=this.Audit[i].field_logical_id;
    obj['is_natural_key']=this.Audit[i].is_natural_key;

    this.Audit_temp.push(obj)

  }

  }

async  getDefaultJournalInfo(){

  var resp111 = await this.environmentSetup.getDefaultJournalInfo(this.fpemUser.ind_id);

  this.Journal=resp111.data;
   
   this.Journal_temp=[];
   for(let i=0;i<this.Journal.length;i++){

    var obj = new Object();
    obj['business_field_name']=this.Journal[i].business_field_name;
    obj['field_logical_id']=this.Journal[i].field_logical_id;
    if(this.Journal[i].is_header==1){
      obj['journal_part']='is_header';
    }
    else if(this.Journal[i].is_line==1){
      obj['journal_part']='is_line';
    }else if(this.Journal[i].is_measure==1){
      obj['journal_part']='is_measure';
    }
    else{
      obj['journal_part']='other';
    }
  

    this.Journal_temp.push(obj);
   }

 

  }

 async  getDefaultIpInfo(){
  var resp = await this.environmentSetup.getDefaultIpInfo(this.fpemUser.ind_id);
  console.log(resp);
  this.Ip=resp.data;

  this.Ip_temp=[];

  for(let i=0;i<this.Ip.length;i++){
    var obj = new Object();
   
    obj['business_field_name']=this.Ip[i].business_field_name;
    obj['field_logical_id']=this.Ip[i].field_logical_id;
    obj['is_natural_key']=this.Ip[i].is_natural_key;

    this.Ip_temp.push(obj)

  }
  }

async  getDefaultSalInfo(){

  var resp = await this.environmentSetup.getDefaultSalInfo(this.fpemUser.ind_id);
  this.Sal=resp.data;

  this.Sal_temp=[];

  for(let i=0;i<this.Sal.length;i++){
    var obj = new Object();
    
    obj['business_field_name']=this.Sal[i].business_field_name;
    obj['field_logical_id']=this.Sal[i].field_logical_id;
    obj['is_natural_key']=this.Sal[i].is_natural_key;

    this.Sal_temp.push(obj)

  }

  }


 async getDefaultGeneralData(){

    var resp = await this.environmentSetup.getDefaultGeneralData(this.fpemUser.ind_id);

    if (resp['error'] == false) {

      this.presentationCurrency=resp.data.presentation_currencies.split(',');
      this.name=resp.data.acct_name;
      this.start_months=resp.data.acct_control_start;
      this.end_months=resp.data.acct_control_end;

      var dt= resp.data.ppd.split('-');
      var obj = new Object();
      obj['day']=parseInt(dt[2]);
      obj['month']=parseInt(dt[1]);
      obj['year']=parseInt(dt[0]); 

      this.date=obj;       
    }

  }

 async getSavedGeneralData(){

  var resp = await this.environmentSetup.getSavedGeneralData(this.fpemUser.acct_id);

  this.presentationCurrency=resp.data.presentation_currencies.split(',');
  this.name=resp.data.acct_name;
  this.start_months=resp.data.acct_control_start;
  this.end_months=resp.data.acct_control_end;

  var dt= resp.data.ppd.split('-');
  var obj = new Object();
  obj['day']=parseInt(dt[2]);
  obj['month']=parseInt(dt[1]);
  obj['year']=parseInt(dt[0]); 

  this.date=obj;

  }


async getDefaultProcess(){

    var resp= await this.environmentSetup.getDefaultProcess(this.fpemUser.ind_id);
       this.selectedProcessId=[];
       for(let i=0;i<resp.data.length;i++){
        this.selectedProcessId.push(resp.data[i].process_id)
      }

  }

async  getDefaultFields(){

  var resp1 = await this.environmentSetup.getDefaultFields(this.fpemUser.ind_id);

  this.allFields=resp1.data;

  for(let i=0;i<this.allFields.length;i++){
    this.FieldNameToId.set(this.allFields[i].business_field_name,this.allFields[i].field_id)
  }


  this.dataSource= new MatTableDataSource(this.allFields);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;

  }

 async  getconfiguredFields(){

  var resp1 = await this.environmentSetup.getconfiguredFields(this.fpemUser.acct_id);

  this.allFields=resp1.data;
 
  this.FieldNameToId.clear();
  this.FieldNameToDataType.clear();
  this.FieldNameToTechName.clear();
  for(let i=0;i<this.allFields.length;i++){
    this.FieldNameToId.set(this.allFields[i].business_field_name,this.allFields[i].field_id);
    this.FieldNameToDataType.set(this.allFields[i].business_field_name,this.allFields[i].field_datatype);
    this.FieldNameToTechName.set(this.allFields[i].business_field_name,this.allFields[i].technical_field_name);
  }
  this.dataSource= new MatTableDataSource(this.allFields);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;


  }

  async getconfiguredProcesses(){

    var resp= await this.environmentSetup.getconfiguredProcesses(this.fpemUser.acct_id);
    this.selectedProcessId=[];
    for(let i=0;i<resp.data.length;i++){ 
      this.selectedProcessId.push(resp.data[i].process_id)
    }

  }

  addNewField(){
    $('#addNewField').modal('show');
  }

  saveNewField(){
   
    var obj = new Object();
    obj['field_datatype']=this.datatype;
    obj['business_field_name']=this.business_field_name;
    if(this.is_nullable=='no'){
      obj['is_nullable']=0;
    }
    else{
      obj['is_nullable']=1;
    }
    
    obj['field_logical_id']=0;
    obj['logical_field_name']='None';
    var str=this.business_field_name.split(' ').join('_');
    obj['technical_field_name']=str.toLowerCase();

 

    this.allFields.push(obj);

      this.dataSource= new MatTableDataSource(this.allFields);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      $('#addNewField').modal('hide');





  }

  deleteField(element,i){

    if(element.field_logical_id>0){

      this.toastr.errorToastr('Can Not Delete This Field', 'Oops!');

    }
    else{

      this.allFields.splice(i,1);


      this.dataSource= new MatTableDataSource(this.allFields);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

        this.toastr.successToastr('Delete Successfully', 'Success!');

    }
    
  }
  addNewJournal() {
    var obj = { business_field_name: '' ,journal_part:'',field_logical_id:0};
    this.Journal_temp.push(obj);
  }
  addNewSal() {

    var obj = {business_field_name: '',is_natural_key:'',field_logical_id:0};
    this.Sal_temp.push(obj);
   
  
  }
  addNewIp() {

    var obj = {business_field_name: '',is_natural_key:'',field_logical_id:0};
    this.Ip_temp.push(obj);
   
  
  }
  addNewAudit() {

    var obj = {business_field_name: '',is_natural_key:'',field_logical_id:0};
    this.Audit_temp.push(obj);
   
  
  }
  next(i) {

    if(this.fpemUser.steps_completed>i){
      this.stepper.next();
    }else{
      this.toastr.errorToastr("You need to complete step 1 first")
    }
  }

  back() {
    this.stepper.previous();
  }

  onSubmit() {
    return false;
  }

 

  deleteJournal(field_logical_id,i){

    

    if(field_logical_id>0){

      this.toastr.errorToastr('Can Not Delete This Field', 'Oops!');


    }

    else{
      this.Journal_temp.splice(i,1)
    }
    
  }
  deleteSal(field_logical_id,i){

    if(field_logical_id>0){
      this.toastr.errorToastr('Can Not Delete This Field', 'Oops!')

    }

    else{
      this.Sal_temp.splice(i,1)
    }

    
  }
  deleteIp(field_logical_id,i){

    if(field_logical_id>0){
      this.toastr.errorToastr('Can Not Delete This Field', 'Oops!');
    }

    else{
      this.Ip_temp.splice(i,1)
    }

    
  }
  deleteAudit(field_logical_id,i){

  

    if(field_logical_id>0){

      this.toastr.errorToastr('Can Not Delete This Field', 'Oops!');


    }

    else{
      this.Audit_temp.splice(i,1)
    }

    
  }

  async saveGeneralInfo( ){
   
    this.spinner.show();
    var obj = new Object();

      obj['presentation_currencies'] = this.presentationCurrency.join(',');
      obj['acct_control_start'] = this.start_months;
      obj['acct_control_end'] = this.end_months;
      obj['acct_name'] = this.name;
   
      var mth=this.date.month;
      var dy=this.date.day;
      if(this.date.month<=9){
        mth="0"+this.date.month;
      }
      if(this.date.day<=9){
        dy="0"+this.date.day;
      }
      obj['ppd'] = this.date.year+'-'+mth+'-'+dy;
      obj['acct_id']=this.fpemUser.acct_id;
    

      if(this.fpemUser.steps_completed==0){
        var resp = await this.environmentSetup.saveGeneralInfo(obj);
          if (resp['error'] == false) {
          this.fpemUser.steps_completed=1;
          this.getDefaultProcess();
          this.getDefaultFields();

          localStorage.setItem('fpemUser',JSON.stringify(this.fpemUser));
          this.spinner.hide();
          this.toastr.successToastr(resp['data'], 'Success!');
          
        } else {
          this.spinner.hide();
          this.toastr.errorToastr(resp['data'], 'Oops!');
        }

      }else{
        var resp = await this.environmentSetup.updateGeneralInfo(obj);
        if (resp['error'] == false) { 
          this.spinner.hide();         
          this.toastr.successToastr(resp['data'], 'Success!');
        } else {
          this.spinner.hide();
          this.toastr.errorToastr(resp['data'], 'Oops!');
        }

      }

     


  }

async SaveProcessAndFields(){
  this.spinner.show();
  var obj = new Object();
  this.selectedProcessNameId=[];

   obj['acct_id']=this.fpemUser.acct_id;


      for(let i=0;i<this.selectedProcessId.length;i++){
      var obj1 = new Object();
      obj1['process_id']= this.selectedProcessId[i];
      for(let k=0;k<this.Process.length;k++){
      if(this.Process[k].id==this.selectedProcessId[i]){
        obj1['process_name']=this.Process[k].process_name;
      }
      } 

      this.selectedProcessNameId.push(obj1)
       }
   

    obj['process_data']=this.selectedProcessNameId;
    obj['field_data']=this.allFields;

 
    if(this.fpemUser.steps_completed==1){
  
    var resp = await this.environmentSetup.SaveProcessAndFields(obj);
    if (resp['error'] == false) { 
      
      this.fpemUser.steps_completed=2;
      localStorage.setItem('fpemUser',JSON.stringify(this.fpemUser));
      this.getconfiguredFields();
      this.getDefaultAuditInfo();
      this.getDefaultIpInfo();
      this.getDefaultJournalInfo();
      this.getDefaultSalInfo();


      localStorage.setItem('fpemUser',JSON.stringify(this.fpemUser));
      this.spinner.hide();

      this.toastr.successToastr(resp['data'], 'Success!');
    } else {
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'], 'Oops!');
    }

  }else{

   
    var resp = await this.environmentSetup.updateconfiguredProcessesAndFields(obj);
   
    if (resp['error'] == false) { 
      this.getconfiguredFields();
      this.spinner.hide();
      this.toastr.successToastr(resp['data'], 'Success!');
    } else {
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'], 'Oops!');
    }




  }

 



  }

async  SaveSetup(){

  this.spinner.show();
  var Journal_data=[];

for(let i=0;i<this.Journal_temp.length;i++){

  var obj1 = new Object();
  obj1['field_id']=this.FieldNameToId.get(this.Journal_temp[i].business_field_name);
  obj1['technical_field_name']=this.FieldNameToTechName.get(this.Journal_temp[i].business_field_name);
  obj1['field_datatype']=this.FieldNameToDataType.get(this.Journal_temp[i].business_field_name);
  obj1['is_natural_key']=0;
  if(this.Journal_temp[i].journal_part=='other'){
    obj1['is_header']=0;
    obj1['is_line']=0;
    obj1['is_measure']=0;
  }
  else if( this.Journal_temp[i].journal_part=='is_header'){
    obj1['is_header']=1;
    obj1['is_line']=0;
    obj1['is_measure']=0;

  } else if(this.Journal_temp[i].journal_part=='is_line'){
    obj1['is_header']=0;
    obj1['is_line']=1;
    obj1['is_measure']=0;

  }else if(this.Journal_temp[i].journal_part=='is_measure') {

    obj1['is_header']=0;
    obj1['is_line']=0;
    obj1['is_measure']=1;

  }
  

  obj1['col_seq_no']=i;
  Journal_data.push(obj1);



}

var Sal_data=[];

for(let j=0;j<this.Sal_temp.length;j++){

  var obj1 = new Object();
  obj1['field_id']=this.FieldNameToId.get(this.Sal_temp[j].business_field_name);
  obj1['technical_field_name']=this.FieldNameToTechName.get(this.Sal_temp[j].business_field_name);
  obj1['field_datatype']=this.FieldNameToDataType.get(this.Sal_temp[j].business_field_name);
  obj1['is_natural_key']=this.Sal_temp[j].is_natural_key;
  obj1['is_header']=0;
  obj1['is_line']=0;
  obj1['is_measure']=0;
  obj1['col_seq_no']=j;
  Sal_data.push(obj1);



}

var Ip_data=[];

for(let j=0;j<this.Ip_temp.length;j++){

  var obj1 = new Object();
  obj1['field_id']=this.FieldNameToId.get(this.Ip_temp[j].business_field_name);
  obj1['technical_field_name']=this.FieldNameToTechName.get(this.Ip_temp[j].business_field_name);
  obj1['field_datatype']=this.FieldNameToDataType.get(this.Ip_temp[j].business_field_name);
  obj1['is_natural_key']=this.Ip_temp[j].is_natural_key;
  obj1['is_header']=0;
  obj1['is_line']=0;
  obj1['is_measure']=0;
  obj1['col_seq_no']=j;
  Ip_data.push(obj1);



}

var Audit_data=[];

for(let j=0;j<this.Audit_temp.length;j++){

  var obj1 = new Object();
  obj1['field_id']=this.FieldNameToId.get(this.Audit_temp[j].business_field_name);
  obj1['technical_field_name']=this.FieldNameToTechName.get(this.Audit_temp[j].business_field_name);
  obj1['field_datatype']=this.FieldNameToDataType.get(this.Audit_temp[j].business_field_name);
  obj1['is_natural_key']=this.Audit_temp[j].is_natural_key;
  obj1['is_header']=0;
  obj1['is_line']=0;
  obj1['is_measure']=0;
  obj1['col_seq_no']=j;
  Audit_data.push(obj1);



}


var obj = new Object();

obj['store']=this.store;
obj['acct_id']=this.fpemUser.acct_id;
obj['jrnl_name']='Journal';
obj['ip_name']='Ip';
obj['sal_name']='Sal';
obj['audit_name']='Audit';
obj['jrnl']=Journal_data;
obj['sal']=Sal_data;
obj['ip']=Ip_data;
obj['audit']=Audit_data;

console.log(obj);

   var resp = await this.environmentSetup.CreateStructures(obj);
   
    if (resp['error'] == false) { 
  
      this.fpemUser.steps_completed=3;
      localStorage.setItem('fpemUser',JSON.stringify(this.fpemUser));
      this.spinner.hide();

      this.router.navigate(['/home']);
      this.toastr.successToastr(resp['data'], 'Success!');
    } else {
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'], 'Oops!');
    }





  }
  applyFilter(filterValue: string) {
    
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

onChangeCheckbox(process, event){
   if(event==true){
      this.selectedProcessId.push(process)
    }else{
      this.selectedProcessId.splice(this.selectedProcessId.indexOf(process),1);
    }
  }

  dropJournal(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.Journal_temp, event.previousIndex, event.currentIndex);
  }

  dropSal(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.Sal_temp, event.previousIndex, event.currentIndex);
  }

  dropIp(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.Ip_temp, event.previousIndex, event.currentIndex);
  }

  dropAudit(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.Audit_temp, event.previousIndex, event.currentIndex);
  }

  Success_save() {
    this.toastr.successToastr('Save Successful.', 'Success!');
  }
  Save_error() {
    this.toastr.errorToastr('Somethings is Wrong.', 'Oops!');
  }
}
