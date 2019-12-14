import { Component, OnInit } from '@angular/core';
import { ManualService } from '../../service/manual.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
@Component({
  selector: 'app-manual-journal',
  templateUrl: './manual-journal.component.html',
  styleUrls: ['./manual-journal.component.css']
})
export class ManualJournalComponent implements OnInit {

  constructor(private toastr: ToastrManager, private manualService: ManualService, private spinner: NgxSpinnerService, ) { }
  col_field=[];
  
  fpemUser;
  allFields;
  Journal = [];
  store;
  file_id;
  table_data = [];
  keys = [];
  values = [];
  new_line = {};
  header = {};
  temp;
  TotalTableFields = [];
  journal_header_field = [];
  journal_non_header_field = [];
  csv_data=[];
  FieldNameToId: Map<String, String> = new Map<String, String>();
  async  ngOnInit() {

    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));
    this.getconfiguredJournalInfo();
    this.getconfiguredFields();
    await this.getDataStore();
  }

  async getDataStore(){
    var resp = await this.manualService.getDataStore(this.fpemUser.acct_id);
    if(resp['error']==false){
      this.store=resp.data;
    }

  }

  async add() {
    var obj = Object.assign({}, this.new_line)
    this.table_data.push(obj)
  }

  delete(i) {
    this.table_data.splice(i, 1)
  }

  async submit() {
    this.csv_data=[];
    var arr = [];
    for (let i = 0; i < this.table_data.length; i++) {

      this.keys = (Object.keys(this.table_data[i]));
      this.values = (Object.values(this.table_data[i]));

      var obj = new Object();

      for (let i = 0; i < this.keys.length; i++) {
        var key = this.keys[i];
        this.temp = this.FieldNameToId.get(key);
        //obj[this.temp] = this.values[i];
        obj[key] = this.values[i];
      }


      this.keys = (Object.keys(this.header));
      this.values = (Object.values(this.header));

      for (let i = 0; i < this.keys.length; i++) {
        var key = this.keys[i];
        this.temp = this.FieldNameToId.get(key);
        //obj[this.temp] = this.values[i];
        obj[key] = this.values[i];
      }
      arr.push(obj);
    }
   for(let j=0;j<arr.length;j++){
    var str;
    for(let i=0;i<this.col_field.length;i++){
       if(i==0){
      str=arr[j][this.col_field[i]]
      }else{
      str=str+','+arr[j][this.col_field[i]]
      }
     
  }

  this.csv_data.push(str)
  }
    
    console.log(this.csv_data)

    var obj = new Object();
    obj['acct_id']=this.fpemUser.acct_id;
    obj['record']=this.csv_data;
    obj['record_type']='jrnl';
    obj['event_layout_id']=null;
    obj['store']=this.store;

    console.log(obj)

    var resp = await this.manualService.manualJournalFire(obj);
    if(resp['error']==false){
      this.spinner.hide();
      this.toastr.successToastr('Successfully Send!', 'Success!');
    }
    else{
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'], 'Oops!');
    }
  }



  async  getconfiguredFields() {
    var resp1 = await this.manualService.getconfiguredFields(this.fpemUser.acct_id);
    if(resp1['error']==false){
      this.allFields = resp1.data;
    }
    
  }
  async getconfiguredJournalInfo() {

    var resp = await this.manualService.getconfiguredJournalInfo(this.fpemUser.acct_id);
    this.col_field=[];
    this.Journal = resp.data;
    console.log(this.Journal)
    this.journal_non_header_field = [];
    this.journal_header_field = [];
    this.TotalTableFields = [];
    for (let i = 0; i < this.Journal.length; i++) {
      this.col_field.push(this.Journal[i].business_field_name);
      this.store = this.Journal[i].store;
      this.file_id = this.Journal[i].file_id;
      if (this.Journal[i].is_header == 1) {
        this.journal_header_field.push(this.Journal[i]);

      }
      else {
        this.journal_non_header_field.push(this.Journal[i]);
        this.TotalTableFields.push(this.Journal[i].business_field_name);
      }
    }


    for (let i = 0; i < this.TotalTableFields.length; i++) {
      this.new_line[this.TotalTableFields[i]] = '';
    }

    for (let i = 0; i < this.journal_header_field.length; i++) {
      this.header[this.journal_header_field[i].business_field_name] = '';
    }
    console.log(this.journal_header_field);
   //create map
    this.FieldNameToId.clear();
    for (let i = 0; i < this.Journal.length; i++) {
      this.FieldNameToId.set(this.Journal[i].business_field_name, 'c_' + this.Journal[i].field_id);
    }
  }

}
