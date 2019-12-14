import { Component, OnInit, ViewChild } from '@angular/core';
import { SourceService } from '../../service/source.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrManager } from 'ng6-toastr-notifications';
declare var $ : any;

@Component({
  selector: 'app-source-events',
  templateUrl: './source-events.component.html',
  styleUrls: ['./source-events.component.css']
})
export class SourceEventsComponent implements OnInit {

  data = [];
  fpemUser;
  acct_id = 1000;
  eventName;
  selectedLayout;
  allLayouts=[];
  newSetting;
  constructor(private spinner: NgxSpinnerService,private toastr: ToastrManager, private source_Service: SourceService) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource;
  displayedColumns = ['event_layout_name', 'src_name', 'edit', 'delete'];
  settings = {
    edit: {
      editButtonContent: '<b class="btn btn-warning "><i class="fa fa-edit" aria-hidden="true"></i></b>',
      cancelButtonContent: '<b class="btn btn-danger "> <i class="fa fa-times-circle"></i> </b>',
      saveButtonContent: '<b class="btn btn-success "><i class="fa fa-save"></i></b>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<b class="btn btn-danger "><i class="fa fa-trash" aria-hidden="true"></i></b>',
      confirmDelete: true
    },
    add: {
      addButtonContent: '<b class="btn "><i class="fa fa-plus" aria-hidden="true"></i>Add</b>',
      createButtonContent: '<b class="btn btn-success "><i class="fa fa-save"></i></b>',
      cancelButtonContent: '<b class="btn btn-danger "><i class="fa fa-times-circle" aria-hidden="true"></i></b>',
      confirmCreate: true
    },
    columns: {
      src_event_code: {
        title: ' Event Code',
      },
      src_event_desc: {
        title: 'Event Name',
      },
      event_layout_name: {
        title: 'Assiociated Layout Name',
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: [],

          },
        }
      },
      
    },
    
    actions: {


      position: 'right',

    },
  }
  async ngOnInit() {
    this.fpemUser=JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id=this.fpemUser.acct_id;
    this.newSetting=this.settings;
    await this.getLayouts();
    await this.getEvents();
  }
  async getLayouts(){
    var resp = await this.source_Service.getEventLayouts(this.acct_id);
    if (resp['error'] == false) {
      console.log(resp.data);
      var temp=[];
      for(var i=0;i<resp.data.length;i++){
        temp.push({title: resp.data[i].event_layout_name, value: resp.data[i].id});
      }
      this.allLayouts=temp;
      this.settings.columns.event_layout_name.editor.config.list=this.allLayouts;
      this.settings = Object.assign({}, this.settings);

      

    } else {
      this.data = [];
    }
  }
  async getEvents(){
    var resp = await this.source_Service.getEvents(this.acct_id);
    if (resp['error'] == false) {
      console.log(resp.data);
      this.data=resp.data;

      

    } else {
      this.data = [];
    }
  }
  async onCreateConfirm(event) {
    console.log(event.newData);
    this.spinner.show();
   
    var obj = new Object();
    obj['src_event_code'] = event.newData.src_event_code;
    obj['acct_id'] = this.acct_id;
    obj['src_event_desc'] = event.newData.src_event_desc;
    obj['event_layout_id'] = event.newData.event_layout_name;
   
    console.log(obj)
    var resp = await this.source_Service.addEvent(obj);
    console.log(resp)


    if (resp['error'] == false) {
      event.confirm.resolve(event.newData);
      await this.getEvents();
      this.spinner.hide();
     
      this.toastr.successToastr('Event Added Successfully','Success!')
    } else {
      this.spinner.hide();
      this.toastr.errorToastr(resp.data,'Oops!')
    }

  }

  async  onSaveConfirm(event) {
    this.spinner.show();
    var obj = new Object();
    obj['src_event_code'] = event.newData.src_event_code;
    obj['acct_id'] = this.acct_id;
    obj['src_event_desc'] = event.newData.src_event_desc;
    obj['event_layout_id'] = event.newData.event_layout_name;
    obj['id'] = event.data.id;
   
    console.log(obj)

    var resp = await this.source_Service.updateEvent(obj);
    if (resp['error'] == false) {
      

      event.confirm.resolve(event.newData);
      await this.getEvents();
      this.spinner.hide();
      this.toastr.successToastr('Updated Successfully','Success!')
    } else {
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'],'Ooops!')
    
    }
  }


  async onDeleteConfirm(event) {
    this.spinner.show();
    console.log(event.data);
    var id = event.data.id;
    var resp = await this.source_Service.deleteEvent(id);
    if (resp['error'] == false) {
      this.spinner.hide();
      this.data.splice(this.data.indexOf(event), 1);
      
      event.confirm.resolve();
      this.toastr.successToastr('Deleted Successfully','Success!')
    }else{
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'],'Ooops!')
    }


  }
}
