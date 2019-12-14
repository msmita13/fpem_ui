import { Component, OnInit, ViewChild } from '@angular/core';
import { SourceService } from '../../service/source.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrManager } from 'ng6-toastr-notifications';
declare var $ : any;
@Component({
  selector: 'app-eventlayout',
  templateUrl: './eventlayout.component.html',
  styleUrls: ['./eventlayout.component.css']
})
export class EventlayoutComponent implements OnInit {




  data = [];
  fields=[];
  fpemUser;
  acct_id = 1000;
  sources=[];
  selectedSource;
  lname;
  selectedFields=[];
  selectedLayout;
  newField={field_business_name: '', field_id:''};
  constructor(private spinner: NgxSpinnerService,private toastr: ToastrManager, private source_Service: SourceService) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource;
  displayedColumns = ['event_layout_name', 'edit', 'delete'];
  async  ngOnInit() {
    $("#addModal").draggable({
      handle: ".modal-dialog "
    });

    $("#editModal").draggable({
      handle: ".modal-dialog "
    });
    this.fpemUser=JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id=this.fpemUser.acct_id;
    await this.getLayouts();
    await this.getSource();
    await this.getFields();
    
  }

  async getSource(){
    var resp = await this.source_Service.getSources(this.acct_id);
    if (resp['error'] == false) {
      this.sources = resp.data;
     
    } else {
    }
  }
  async getLayouts(){
    var resp = await this.source_Service.getEventLayouts(this.acct_id);
    console.log(resp);
    if (resp['error'] == false) {
      this.data = resp.data;
      console.log(this.data);
      this.dataSource=new MatTableDataSource(this.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

    } else {
      this.data = [];
    }
  }
  async getFields(){
    var resp = await this.source_Service.getSourceFields(this.acct_id);
    if (resp['error'] == false) {
      console.log(resp.data)

      this.fields = resp.data;

    } else {
      
    }
  }
  addLayout(){
    this.selectedSource=-1;
    this.selectedFields=[];
    
  }
  async edit(element,i){
    this.spinner.show();
    this.selectedSource=null;
    this.selectedLayout=element.id;
    this.lname=element.event_layout_name;
    this.selectedFields=[];

    var resp= await this.source_Service.getEventFields(this.selectedLayout);
    if(resp['error']==false){
      this.spinner.hide();
      console.log(resp);
      for(var j=0;j<resp.data.length;j++){
        this.selectedFields.push({business_field_name:resp.data[j].business_field_name,id: resp.data[j].src_field_id});
      }

      
    }else{
      this.spinner.hide();
      this.selectedSource=undefined;
      this.selectedLayout=undefined;
      this.lname=undefined;
      this.toastr.errorToastr(resp['data'],'Oops!');
      this.selectedFields=[];
    }

   
   
  }
  dropFields(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedFields, event.previousIndex, event.currentIndex);
  }
  addField(){
    var newFieldObject={field_business_name:'',id: -1};
    this.selectedFields.push(newFieldObject);
    console.log(this.selectedFields);
  }
  async addEventLayout(){
    var error=false;
    this.spinner.show();

    var obj=new Object();
    var tempArr=[];
    for(var i=0;i<this.selectedFields.length;i++){
      if(this.selectedFields[i].id==-1){
        error=true;
        break;
      }
      tempArr.push(this.selectedFields[i].id);
    }
    
    console.log(error);
    if(error==true){
      this.toastr.errorToastr('Please Fill All Values','Oops!');
      this.spinner.hide();
     
    }else{
      obj['event_layout_name']=this.lname;
     
      obj['acct_id']=this.acct_id;
      obj['field_ids']=tempArr;
      console.log(obj);
      this.selectedFields=[];
      this.lname='';
      this.selectedSource=undefined;
      var resp= await this.source_Service.addEventLayout(obj);
      console.log(resp);
      if(resp['error']==false){
        this.getLayouts();
        this.spinner.hide();
        this.toastr.successToastr('Added Successfully','Success!')
        
      }else{
        this.spinner.hide();
        this.toastr.errorToastr(resp['data'],'Oops!')

      }
    }

  }

  async updateEventLayout(){
    var error=false;
    this.spinner.show();

    var obj=new Object();
    var tempArr=[];
    for(var i=0;i<this.selectedFields.length;i++){
      if(this.selectedFields[i].id==-1){
        error=true;
        break;
      }
      tempArr.push(this.selectedFields[i].id);
    }
    console.log(error);
    // if(this.selectedSource==-1 || this.selectedSource==undefined){
    //   error=true;
    // }
    // console.log(error);
    if(error==true){
      this.toastr.errorToastr('Please Fill All Values','Oops!');
      this.spinner.hide();
     
    }else{
      obj['event_layout_name']=this.lname;
      
      obj['acct_id']=this.acct_id;
      obj['field_ids']=tempArr;
      obj['id']=this.selectedLayout;
      console.log(obj);
      
      var resp= await this.source_Service.updateEventLayout(obj);
      console.log(resp);
      if(resp['error']==false){
        this.getLayouts();
        this.spinner.hide();
        this.toastr.successToastr('Updated Successfully','Success!')
        this.selectedFields=[];
        this.lname='';
        this.selectedSource=undefined;
        
      }else{
        this.spinner.hide();
        this.toastr.errorToastr(resp['data'],'Oops!')

      }
    }

  }


  async deleteField(i){
    this.selectedFields.splice(i,1);
  }
  async delete(element,i){
    this.spinner.show();
    var obj=new Object();
    obj['id']=element.id;
    var resp= await this.source_Service.deleteLayout(obj);
    if(resp['error']==false){
      this.getLayouts();
      this.spinner.hide();
      this.toastr.successToastr('Deleted Successfully','Success!')
      
    }else{
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'],'Oops!')

    }

  }
  applyFilter(filterValue: string) {
    
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}