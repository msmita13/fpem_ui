import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrManager } from 'ng6-toastr-notifications';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PlatformDataDefinitionService } from './../../service/platform-data-definition.service';


@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css']
})
export class JournalComponent implements OnInit {

  constructor(private platformDataDefinitionService: PlatformDataDefinitionService, private spinner: NgxSpinnerService, public toastr: ToastrManager) { }

  Journal = [];
  Journal_temp = [];
  allFields = [];
  fpemUser;
  store;
  file_id;
  flag = 0;
  req_filed;

  allLogicalFields = [];

  FieldNameToId: Map<String, number> = new Map<String, number>();
  FieldNameToDataType: Map<String, String> = new Map<String, String>();
  FieldNameToTechName: Map<String, String> = new Map<String, String>();

  ReqForJournalFieldName: Map<String, number> = new Map<String, number>();



  async  ngOnInit() {

    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));
    this.getconfiguredJournalInfo();
    this.getconfiguredFields();
    this.getAllLogicalFields();

  }

  async getAllLogicalFields(){
    var resp2 = await this.platformDataDefinitionService.getAllLogicalFields();
    if (resp2['error'] == false) {
      this.allLogicalFields = resp2.data;
      for (let i = 0; i < this.allLogicalFields.length; i++) {
        if (this.allLogicalFields[i].req_for_journal == 1) {
          this.ReqForJournalFieldName.set(this.allLogicalFields[i].id, this.allLogicalFields[i].req_for_journal);
        }
      }
    }
  }

  async  getconfiguredFields() {
    var resp1 = await this.platformDataDefinitionService.getconfiguredFields(this.fpemUser.acct_id);
    this.allFields = resp1.data;

    this.FieldNameToId.clear();
    this.FieldNameToDataType.clear();
    this.FieldNameToTechName.clear();
    for (let i = 0; i < this.allFields.length; i++) {
      this.FieldNameToId.set(this.allFields[i].business_field_name, this.allFields[i].field_id);
      this.FieldNameToDataType.set(this.allFields[i].business_field_name, this.allFields[i].field_datatype);
      this.FieldNameToTechName.set(this.allFields[i].business_field_name, this.allFields[i].technical_field_name);
    }
  }

  async getconfiguredJournalInfo() {

    var resp = await this.platformDataDefinitionService.getconfiguredJournalInfo(this.fpemUser.acct_id);
    this.Journal = resp.data;
    console.log(resp)
    this.Journal_temp = [];
    for (let i = 0; i < this.Journal.length; i++) {

      this.store = this.Journal[i].store;
      this.file_id = this.Journal[i].file_id;

      var obj = new Object();
      obj['business_field_name'] = this.Journal[i].business_field_name;
      obj['field_logical_id'] = this.Journal[i].field_logical_id;
      if (this.Journal[i].is_header == 1) {
        obj['journal_part'] = 'is_header';
      }
      else if (this.Journal[i].is_line == 1) {
        obj['journal_part'] = 'is_line';
      } else if (this.Journal[i].is_measure == 1) {
        obj['journal_part'] = 'is_measure';
      }
      else {
        obj['journal_part'] = 'other';
      }

      this.Journal_temp.push(obj);
    }
    
  }

  addNewJournal() {
    var obj = { field_logical_id: '', business_field_name: '', journal_part: '' };
    this.Journal_temp.push(obj);
    this.toastr.successToastr("One Term Added, Move below")
  }

  deleteJournal(element, i) {
    if (this.ReqForJournalFieldName.get(element.field_logical_id) != 1) {
      this.Journal_temp.splice(i, 1)
    }
  }

  onopen(element, i) {
    if (this.ReqForJournalFieldName.get(element.field_logical_id) == 1) {
      this.req_filed = element.business_field_name;
      this.flag = 1;
    }
  }
  onclose(element, i) {
    if (this.flag == 1) {
      this.Journal_temp[i].business_field_name = this.req_filed;
      this.flag = 0;
    }
  }

  async  SaveJournal() {
    this.spinner.show();
    var Journal_data = [];
    for (let i = 0; i < this.Journal_temp.length; i++) {
      var obj1 = new Object();
      obj1['field_id'] = this.FieldNameToId.get(this.Journal_temp[i].business_field_name);
      if (this.Journal_temp[i].journal_part == 'other') {
        obj1['is_header'] = 0;
        obj1['is_line'] = 0;
        obj1['is_measure'] = 0;
      }
      else if (this.Journal_temp[i].journal_part == 'is_header') {
        obj1['is_header'] = 1;
        obj1['is_line'] = 0;
        obj1['is_measure'] = 0;
      } else if (this.Journal_temp[i].journal_part == 'is_line') {
        obj1['is_header'] = 0;
        obj1['is_line'] = 1;
        obj1['is_measure'] = 0;
      } else if (this.Journal_temp[i].journal_part == 'is_measure') {
        obj1['is_header'] = 0;
        obj1['is_line'] = 0;
        obj1['is_measure'] = 1;
      }
      obj1['is_natural_key'] = 0;
      obj1['col_seq_no'] = i;

      Journal_data.push(obj1);
    }
    var obj = new Object();
    obj['acct_id'] = this.fpemUser.acct_id;
    obj['store'] = this.store;
    obj['file_id'] = this.file_id;
    obj['data'] = Journal_data;
    console.log(obj);
    var resp = await this.platformDataDefinitionService.UpdateJournal(obj);

    if (resp['error'] == false) {
      this.getconfiguredJournalInfo();
      this.spinner.hide();
      this.toastr.successToastr('Successfully Update');
    } else {
      this.spinner.hide();
      this.toastr.errorToastr(resp['data']);
    }
  }

  dropJournal(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.Journal_temp, event.previousIndex, event.currentIndex);
  }

}
