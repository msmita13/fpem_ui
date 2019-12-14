import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrManager } from 'ng6-toastr-notifications';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PlatformDataDefinitionService } from './../../service/platform-data-definition.service';

@Component({
  selector: 'app-sal',
  templateUrl: './sal.component.html',
  styleUrls: ['./sal.component.css']
})
export class SalComponent implements OnInit {

  constructor(private platformDataDefinitionService: PlatformDataDefinitionService, private spinner: NgxSpinnerService, public toastr: ToastrManager) { }
  Sal = [];
  Sal_temp = [];
  allFields = [];
  fpemUser;
  file_id;
  store;
  allLogicalFields = [];
  FieldNameToId: Map<String, number> = new Map<String, number>();
  FieldNameToDataType: Map<String, String> = new Map<String, String>();
  FieldNameToTechName: Map<String, String> = new Map<String, String>();

  flag = 0;
  req_filed;

  ReqForSalFieldName: Map<String, number> = new Map<String, number>();

  async ngOnInit() {
    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));
    this.getconfiguredSalInfo();
    this.getconfiguredFields();
    this.getAllLogicalFields();
   
  }

 async  getAllLogicalFields(){
  var resp2 = await this.platformDataDefinitionService.getAllLogicalFields();
  if (resp2['error'] == false) {
    this.allLogicalFields = resp2.data;

    for (let i = 0; i < this.allLogicalFields.length; i++) {
      if (this.allLogicalFields[i].req_for_sal == 1) {
        this.ReqForSalFieldName.set(this.allLogicalFields[i].id, this.allLogicalFields[i].req_for_sal);
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
  async  getconfiguredSalInfo() {
    var resp = await this.platformDataDefinitionService.getconfiguredSalInfo(this.fpemUser.acct_id);
    this.Sal = resp.data;
    this.Sal_temp = [];
    for (let i = 0; i < this.Sal.length; i++) {
      var obj = new Object();
      this.store = this.Sal[i].store;
      this.file_id = this.Sal[i].file_id;
      obj['business_field_name'] = this.Sal[i].business_field_name;
      obj['field_logical_id'] = this.Sal[i].field_logical_id;
      obj['is_natural_key'] = this.Sal[i].is_natural_key;
      this.Sal_temp.push(obj)
    }
  }
  addNewSal() {
    var obj = { field_logical_id: '', business_field_name: '', is_natural_key: '' };
    this.Sal_temp.push(obj);
  }

  deleteSal(element, i) {
    if (this.ReqForSalFieldName.get(element.field_logical_id) != 1) {
      this.Sal_temp.splice(i, 1)
    }
  }

  onopen(element, i) {
    if (this.ReqForSalFieldName.get(element.field_logical_id) == 1) {
      this.req_filed = element.business_field_name;
      this.flag = 1;
    }
  }
  onclose(element, i) {
    if (this.flag == 1) {
      this.Sal_temp[i].business_field_name = this.req_filed;
      this.flag = 0;
    }
  }

  async SaveSal() {
    this.spinner.show();
    var Sal_data = [];
    for (let i = 0; i < this.Sal_temp.length; i++) {
      var obj1 = new Object();
      obj1['field_id'] = this.FieldNameToId.get(this.Sal_temp[i].business_field_name);
      obj1['is_header'] = 0;
      obj1['is_line'] = 0;
      obj1['is_measure'] = 0;
      obj1['is_natural_key'] = this.Sal_temp[i].is_natural_key;
      obj1['col_seq_no'] = i;
      Sal_data.push(obj1)
    }
    var obj = new Object();
    obj['acct_id'] = this.fpemUser.acct_id;
    obj['file_id'] = this.file_id;
    obj['store'] = this.store;
    obj['data'] = Sal_data;

    var resp = await this.platformDataDefinitionService.UpdateSal(obj);
    if (resp['error'] == false) {
      this.getconfiguredSalInfo();
      this.spinner.hide();
      this.toastr.successToastr('Successfully Update', 'Success!');
    } else {
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'], 'Oops!');
    }
  }

  dropSal(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.Sal_temp, event.previousIndex, event.currentIndex);
  }

}
