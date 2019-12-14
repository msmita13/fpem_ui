import { Component, OnInit, ViewChild } from '@angular/core';
import { ManualService } from '../../service/manual.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { SourceService } from '../../service/source.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';

declare var $: any;
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  constructor(private toastr: ToastrManager, private manualService: ManualService, private spinner: NgxSpinnerService, private source_Service: SourceService) { }
  event_data = [];
  allevent = [];
  fpemUser;
  store;
  event_layout_id;
  acct_id;
  eventFieldData;
  selectedevent;
  event = {}
  eventFields;
  table_data = [];
  col_field=[];
  displayedColumns = ['id', 'src_event_code', 'update', 'delete'];
  dataSource;
  csv_data=[];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  async ngOnInit() {
    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id = this.fpemUser.acct_id;
    await this.getEvents();
    await this.eventFieldsInfo();
    await this.getDataStore();

  }
  async getDataStore(){
    var resp = await this.manualService.getDataStore(this.acct_id);
    if(resp['error']==false){
      this.store=resp.data;
    }

  }
  async eventFieldsInfo() {
    var resp = await this.manualService.getAllSourceFields(this.acct_id);
    if (resp['error'] == false) {
      this.eventFieldData = resp.data;
    }
    this.creatEventFields(this.selectedevent);
  }

  async creatEventFields(selectedevent) {

    this.event_data = [];
    this.table_data = [];
    this.eventFields = [];

    this.dataSource = new MatTableDataSource(this.table_data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
   
    for (let i = 0; i < this.eventFieldData.length; i++) {
      if (this.eventFieldData[i].src_event_code == selectedevent.src_event_code) {
        this.event_layout_id=this.eventFieldData[i].event_layout_id;
        var business_field_name11 = this.eventFieldData[i].business_field_name.split(',');
        this.col_field=this.eventFieldData[i].business_field_name.split(',');
        var id = this.eventFieldData[i].ids.split(',');
        var datatype = this.eventFieldData[i].datatype.split(',');
        for (let j = 0; j < business_field_name11.length; j++) {
          this.eventFields.push({ business_field_name: business_field_name11[j], field_id: id[j], datatype: datatype[j] })
        }
        this.event = {};
        for (let i = 0; i < this.eventFields.length; i++) {
          this.event[this.eventFields[i].business_field_name] = '';
        }
      }
    }
  }

  addLine() {
    var obj = Object.assign({}, this.event)
    this.event_data.push(obj);
    this.table_data.push({ src_event_code: this.selectedevent.src_event_code })
    this.dataSource = new MatTableDataSource(this.table_data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  delete(i) {
    this.event_data.splice(i, 1);
    this.table_data.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.table_data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  update(i) {
    var obj = Object.assign({}, this.event_data[i])
    this.event = obj;
    this.event_data.splice(i, 1);
    this.table_data.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.table_data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async getEvents() {
    var resp = await this.source_Service.getEvents(this.acct_id);
    if (resp['error'] == false) {
      this.allevent = [];
      for (let i = 0; i < resp.data.length; i++) {
        this.allevent.push({ src_event_code: resp.data[i].src_event_code, src_event_desc: resp.data[i].src_event_desc })
      }
      this.selectedevent = this.allevent[0];
      console.log(this.allevent)
    } else {
      this.allevent = [];
    }
  }

  changeEvents() {
    this.creatEventFields(this.selectedevent);
  }

  async  submit() {
    this.spinner.show();
    this.csv_data=[];
    console.log(this.event_data)
    for(let j=0;j<this.event_data.length;j++){
      var str;
      for(let i=0;i<this.col_field.length;i++){
        if(i==0){
        str=this.event_data[j][this.col_field[i]]
        }else{
        str=str+','+this.event_data[j][this.col_field[i]]
        }
    }
    this.csv_data.push(str)
    }
    


    var obj = new Object();
    obj['acct_id']=this.acct_id;
    obj['record']=this.csv_data;
    obj['record_type']='event';
    obj['event_layout_id']=this.event_layout_id;
    obj['store']=this.store;

    console.log(obj)

    var resp = await this.manualService.manualEventFire(obj);
    console.log(resp);
    if(resp['error']==false){
      this.spinner.hide();
      this.toastr.successToastr('Successfully Send!', 'Success!');
    }
    else{
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'], 'Oops!');
    }
  }




  

}
