import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrManager } from 'ng6-toastr-notifications';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PlatformDataDefinitionService } from './../../service/platform-data-definition.service';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {

  constructor(private platformDataDefinition: PlatformDataDefinitionService, private spinner: NgxSpinnerService, public toastr: ToastrManager) { }
  fpemUser;
  Audit = [];
  Audit_temp = [];
  file_id;
  store;
  allFields = [];

  FieldNameToId: Map<String, number> = new Map<String, number>();
  FieldNameToDataType: Map<String, String> = new Map<String, String>();
  FieldNameToTechName: Map<String, String> = new Map<String, String>();

  ReqForAuditFieldName: Map<String, number> = new Map<String, number>();
  flag = 0;
  req_filed;

  allLogicalFields = [];

  async ngOnInit() {
    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));
    this.getconfiguredAuditInfo();
    this.getconfiguredFields();
    this.getAllLogicalFields();
  }


 async  getAllLogicalFields(){
  var resp2 = await this.platformDataDefinition.getAllLogicalFields();
  if (resp2['error'] == false) {
    this.allLogicalFields = resp2.data;

    for (let i = 0; i < this.allLogicalFields.length; i++) {
      if (this.allLogicalFields[i].req_for_audit_rec == 1) {
        this.ReqForAuditFieldName.set(this.allLogicalFields[i].id, this.allLogicalFields[i].req_for_audit_rec);
      }
    }
  }
  }
  async  getconfiguredFields() {
    var resp1 = await this.platformDataDefinition.getconfiguredFields(this.fpemUser.acct_id);
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

  async getconfiguredAuditInfo() {
    var resp = await this.platformDataDefinition.getconfiguredAuditInfo(this.fpemUser.acct_id);
    this.Audit = resp.data;
    this.Audit_temp = [];
    for (let i = 0; i < this.Audit.length; i++) {
      var obj = new Object();
      this.store = this.Audit[i].store;
      this.file_id = this.Audit[i].file_id;
      obj['business_field_name'] = this.Audit[i].business_field_name;
      obj['is_natural_key'] = this.Audit[i].is_natural_key;
      obj['field_logical_id'] = this.Audit[i].field_logical_id;
      this.Audit_temp.push(obj)
    }
  }

  addNewAudit() {
    var obj = { field_logical_id: '', business_field_name: '', is_natural_key: '' };
    this.Audit_temp.push(obj);
    this.toastr.successToastr('Check in the last.')
  }

  deleteAudit(element, i) {
    if (this.ReqForAuditFieldName.get(element.field_logical_id) != 1) {
      this.Audit_temp.splice(i, 1)
    }
  }

  onopen(element, i) {
    if (this.ReqForAuditFieldName.get(element.field_logical_id) == 1) {
      this.req_filed = element.business_field_name;
      this.flag = 1;
    }
  }
  onclose(element, i) {
    if (this.flag == 1) {
      this.Audit_temp[i].business_field_name = this.req_filed;
      this.flag = 0;
    }
  }


  dropAudit(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.Audit_temp, event.previousIndex, event.currentIndex);
  }


  async  SaveAudit() {


    this.spinner.show();

    var Audit_data = [];

    for (let i = 0; i < this.Audit_temp.length; i++) {

      var obj1 = new Object();
      obj1['field_id'] = this.FieldNameToId.get(this.Audit_temp[i].business_field_name);
      obj1['is_header'] = 0;
      obj1['is_line'] = 0;
      obj1['is_measure'] = 0;
      obj1['is_natural_key'] = this.Audit_temp[i].is_natural_key;
      obj1['col_seq_no'] = i;
      Audit_data.push(obj1)

    }

    var obj = new Object();
    obj['acct_id'] = this.fpemUser.acct_id;
    obj['file_id'] = this.file_id;
    obj['store'] = this.store;
    obj['data'] = Audit_data;


    var resp = await this.platformDataDefinition.UpdateAudit(obj);

    if (resp['error'] == false) {
      this.getconfiguredAuditInfo();
      this.spinner.hide();
      this.toastr.successToastr('Successfully Update', 'Success!');
    } else {
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'], 'Oops!');
    }

  }

}
