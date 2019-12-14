import { Component, OnInit, ViewChild } from '@angular/core';
import { ReferenceDataService } from '../../service/reference-data.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrManager } from 'ng6-toastr-notifications';
declare var $ : any;

@Component({
  selector: 'app-define',
  templateUrl: './define.component.html',
  styleUrls: ['./define.component.css']
})
export class DefineComponent implements OnInit {

  data = [];
  fields=[];
  fpemUser;
  acct_id = 1000;
  reference_file_name_business;
  selectedFields=[];
  reference_file_type;
  acct_store='MySQL';
  ref_file_id;
  constructor(private spinner: NgxSpinnerService,private toastr: ToastrManager, private refService: ReferenceDataService) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource;
  displayedColumns = ['reference_file_name_business', 'reference_file_type', 'edit', 'delete'];
  async  ngOnInit() {
    $("#addModal").draggable({
      handle: ".modal-dialog "
    });

    $("#editModal").draggable({
      handle: ".modal-dialog "
    });
    this.fpemUser=JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id=this.fpemUser.acct_id;
    await this.referenceFiles();
   
    await this.getFields();

    await this.getStore();
    
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
    console.log(resp);
    if (resp['error'] == false) {
      this.data = resp.data;
      console.log(this.data);
      
      this.dataSource=new MatTableDataSource(this.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
     
    } else {
    }
  }
  async addNewReferenceFile(){
    this.spinner.show();
    var obj=new Object();
    obj['acct_id']=this.acct_id;
    obj['reference_file_name_business']=this.reference_file_name_business;
    if(this.reference_file_type=='Hierarchy')
      obj['store']=this.acct_store;
    else
      obj['store']='MySQL';

    obj['reference_file_type']=this.reference_file_type;
    obj['field_id']=[];
    for(var i=0;i<this.selectedFields.length;i++){
      for(var j=0;j<this.fields.length;j++){
        if(this.selectedFields[i].field_id==this.fields[j].field_id){
          obj['field_id'].push({field_id: this.selectedFields[i].field_id,field_datatype: this.fields[j].field_datatype});
        }
      }
    }
    var resp= await this.refService.createNewRefFile(obj);
    if(resp['error']==false){
      await this.referenceFiles();
      this.spinner.hide();
      this.toastr.successToastr('Created Successfully','Success!');
    }else{
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'],'Oops!');

    }

  }

  async getFields(){
    var resp = await this.refService.getconfiguredFields(this.acct_id);
    if (resp['error'] == false) {

      this.fields = resp.data;
      console.log(this.fields);

    } else {
      
    }
  }
  async deleteRefFile(element,i){
    this.spinner.show();
    var obj= new Object();
    if(this.reference_file_type=='Hierarchy')
      obj['store']=this.acct_store;
    else
      obj['store']='MySQL';
    obj['acct_id']=this.acct_id;
    obj['ref_file_id']=element.id;
    console.log(obj);
    var resp=await this.refService.deleteRefFile(obj);
    if(resp['error']==false){
      this.data.splice(i,1);
      this.dataSource=new MatTableDataSource(this.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.spinner.hide();
      this.toastr.successToastr('Deleted Successfully','Success!');
    }else{
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'],'Oops!');
    }


  }

  dropFields(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedFields, event.previousIndex, event.currentIndex);
  }
  addField(){
    var newFieldObject={field_id: -1};
    this.selectedFields.push(newFieldObject);
  }
 


  async deleteField(i){
    this.selectedFields.splice(i,1);
  }
  edit(element,i){
    console.log(element);
    this.reference_file_type=element.reference_file_type;
    this.reference_file_name_business=element.reference_file_name_business;
    this.ref_file_id=element.id;
    var ids=element.field_id.split(',');
    var idsNew=[];
    for(var j=0;j<ids.length;j++){
      idsNew.push({field_id: parseInt(ids[j])});
    }
    this.selectedFields=idsNew;

  }
  async updateReferenceFile(){
    this.spinner.show();

    var obj=new Object();
    obj['ref_file_id']=this.ref_file_id;
    obj['acct_id']=this.acct_id;
    obj['reference_file_name_business']=this.reference_file_name_business;
    if(this.reference_file_type=='Hierarchy')
      obj['store']=this.acct_store;
    else
      obj['store']='MySQL';

    obj['reference_file_type']=this.reference_file_type;
    obj['field_id']=[];
    for(var i=0;i<this.selectedFields.length;i++){
      for(var j=0;j<this.fields.length;j++){
        if(this.selectedFields[i].field_id==this.fields[j].field_id){
          obj['field_id'].push({field_id: this.selectedFields[i].field_id,field_datatype: this.fields[j].field_datatype});
        }
      }
    }
    console.log(obj);
    var resp= await this.refService.updateReferenceFile(obj);
    if(resp['error']==false){
      await this.referenceFiles();
      this.spinner.hide();
      this.toastr.successToastr('Updated Successfully','Success!');
    }else{
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'],'Oops!');

    }

  }
  applyFilter(filterValue: string) {
    
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
