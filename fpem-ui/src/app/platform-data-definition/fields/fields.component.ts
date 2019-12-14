import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import Stepper from 'bs-stepper';
import {NgSelectModule, NgOption} from '@ng-select/ng-select';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { PlatformDataDefinitionService} from '.././/../service/platform-data-definition.service'
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrManager } from 'ng6-toastr-notifications';
import {Router} from '@angular/router';

declare var  $: any;
@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.css']
})
export class FieldsComponent implements OnInit {

  business_field_name;
  datatype;
  is_nullable;

  field_id;

  dataSource;
  displayedColumns = ['update','business_field_name','field_datatype','logical_field_name','is_nullable','delete'];
  allFields=[];

  allDatatype=['String','Date','Double','Number'];
  fpemUser;


  constructor( private router: Router,private platformDataDefinitionService: PlatformDataDefinitionService, private spinner: NgxSpinnerService, public toastr: ToastrManager) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  async ngOnInit() {
    $("#addNewField").draggable({
      handle: ".modal-header"
  });

    console.log("inside fields")

    this.fpemUser=JSON.parse(localStorage.getItem('fpemUser'));

    var resp = await this.platformDataDefinitionService.getconfiguredFields(this.fpemUser.acct_id);
    this.allFields=resp.data;
 
 /*  this.FieldNameToId.clear();
  this.FieldNameToDataType.clear();
  this.FieldNameToTechName.clear();
  for(let i=0;i<this.allFields.length;i++){
    this.FieldNameToId.set(this.allFields[i].business_field_name,this.allFields[i].field_id);
    this.FieldNameToDataType.set(this.allFields[i].business_field_name,this.allFields[i].field_datatype);
    this.FieldNameToTechName.set(this.allFields[i].business_field_name,this.allFields[i].technical_field_name);
  } */
  this.dataSource= new MatTableDataSource(this.allFields);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;





  }

async  deleteField(element,i){

     this.field_id=element.field_id;
     console.log(this.field_id)

    var resp = await this.platformDataDefinitionService.deleteField(this.field_id);

    if (resp['error']==false) { 

    
      this.allFields.splice(i,1);

      this.dataSource= new MatTableDataSource(this.allFields);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
             
      this.toastr.successToastr('Delete Successfully', 'Success!');
    } else {
      
      this.toastr.errorToastr(resp['data'], 'Oops!');
    }

  }

  addNewField(){
    $('#addNewField').modal('show');
  }

 async  saveNewField(){
   
    var obj = new Object();
    obj['field_datatype']=this.datatype;
    obj['business_field_name']=this.business_field_name;
    if(this.is_nullable=='no'){
      obj['is_nullable']=0;
    }
    else{
      obj['is_nullable']=1;
    }
    
    obj['acct_id']=this.fpemUser.acct_id;
    
    var str=this.business_field_name.split(' ').join('_');
    obj['technical_field_name']=str.toLowerCase();

   
    var resp = await this.platformDataDefinitionService.addNewField(obj);

    if (resp['error'] == false) { 

      var resp = await this.platformDataDefinitionService.getconfiguredFields(this.fpemUser.acct_id);
      this.allFields=resp.data;

      this.dataSource= new MatTableDataSource(this.allFields);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
             
      this.toastr.successToastr('Add Successfully', 'Success!');
    } else {
      
      this.toastr.errorToastr(resp['data'], 'Oops!');
    }

      $('#addNewField').modal('hide');



  }

  updateField( element,i){
    
    this.field_id=element.field_id;
    this.datatype=element.field_datatype;
    this.business_field_name=element.business_field_name;
    if(element.is_nullable==0){
      this.is_nullable='no';
    }
    if(element.is_nullable==1){
      this.is_nullable='yes';
    }
    



  }

  async UpdateField(){

    
    var obj = new Object();

    obj['business_field_name']=this.business_field_name;

    if(this.is_nullable=='no'){
      obj['is_nullable']=0;
    }
    else if(this.is_nullable=='yes'){
      obj['is_nullable']=1;
    }

    obj['field_id']=this.field_id;
    obj['field_datatype']=this.datatype;

    var resp = await this.platformDataDefinitionService.updateConfiguredField(obj);
    if (resp['error'] == false) { 

      var resp = await this.platformDataDefinitionService.getconfiguredFields(this.fpemUser.acct_id);
      this.allFields=resp.data;

      this.dataSource= new MatTableDataSource(this.allFields);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
             
      this.toastr.successToastr('Update Successfully', 'Success!');
    } else {
      
      this.toastr.errorToastr(resp['data'], 'Oops!');
    }


    $('#updateField').modal('hide');

  }
  applyFilter(filterValue: string) {
    
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
