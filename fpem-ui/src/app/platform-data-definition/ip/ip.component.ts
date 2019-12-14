import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrManager } from 'ng6-toastr-notifications';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PlatformDataDefinitionService } from './../../service/platform-data-definition.service';

@Component({
  selector: 'app-ip',
  templateUrl: './ip.component.html',
  styleUrls: ['./ip.component.css']
})
export class IpComponent implements OnInit {

  constructor(private platformDataDefinitionService: PlatformDataDefinitionService, private spinner: NgxSpinnerService, public toastr: ToastrManager) { }
  fpemUser;
  Ip = [];
  Ip_temp = [];
  allFields = [];
  store;
  file_id;

  flag = 0;
  req_filed;

  allLogicalFields = [];
  FieldNameToId: Map<String, number> = new Map<String, number>();
  FieldNameToDataType: Map<String, String> = new Map<String, String>();
  FieldNameToTechName: Map<String, String> = new Map<String, String>();

  ReqForIpFieldName: Map<String, number> = new Map<String, number>();

  async ngOnInit() {
    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));
    this.getconfiguredIpInfo();
    this.getconfiguredFields();
    this.getAllLogicalFields();
    


  }

 async  getAllLogicalFields(){
    var resp2 = await this.platformDataDefinitionService.getAllLogicalFields();
    if (resp2['error'] == false) {
      this.allLogicalFields = resp2.data;

      for (let i = 0; i < this.allLogicalFields.length; i++) {
        if (this.allLogicalFields[i].req_for_ip == 1) {
          this.ReqForIpFieldName.set(this.allLogicalFields[i].id, this.allLogicalFields[i].req_for_ip);
        }
      }
    }
  }

  async getconfiguredFields() {
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

  async getconfiguredIpInfo() {
    var resp = await this.platformDataDefinitionService.getconfiguredIpInfo(this.fpemUser.acct_id);
    this.Ip = resp.data;
    this.Ip_temp = [];

    for (let i = 0; i < this.Ip.length; i++) {

      this.store = this.Ip[i].store;
      this.file_id = this.Ip[i].file_id;

      var obj = new Object();
      obj['business_field_name'] = this.Ip[i].business_field_name;
      obj['is_natural_key'] = this.Ip[i].is_natural_key;
      obj['field_logical_id'] = this.Ip[i].field_logical_id;

      this.Ip_temp.push(obj)
    }
  }

  addNewIp() {
    var obj = { field_logical_id: '', business_field_name: '', is_natural_key: '' };
    this.Ip_temp.push(obj);
    this.toastr.successToastr('Check the last row.')
  }

  deleteIp(element, i) {
    if (this.ReqForIpFieldName.get(element.field_logical_id) != 1) {
      this.Ip_temp.splice(i, 1)
    }
  }

  onopen(element, i) {
    if (this.ReqForIpFieldName.get(element.field_logical_id) == 1) {
      this.req_filed = element.business_field_name;
      this.flag = 1;
    }
  }
  onclose(element, i) {
    if (this.flag == 1) {
      this.Ip_temp[i].business_field_name = this.req_filed;
      this.flag = 0;
    }
  }
  async SaveIp() {
    this.spinner.show();
    var Ip_data = [];
    for (let i = 0; i < this.Ip_temp.length; i++) {
      var obj1 = new Object();
      obj1['field_id'] = this.FieldNameToId.get(this.Ip_temp[i].business_field_name);
      obj1['is_header'] = 0;
      obj1['is_line'] = 0;
      obj1['is_measure'] = 0;
      obj1['is_natural_key'] = this.Ip_temp[i].is_natural_key;
      obj1['col_seq_no'] = i;
      Ip_data.push(obj1)
    }
    var obj = new Object();
    obj['acct_id'] = this.fpemUser.acct_id;
    obj['file_id'] = this.file_id;
    obj['store'] = this.store;
    obj['data'] = Ip_data;
    console.log(obj);
    var resp = await this.platformDataDefinitionService.UpdateIp(obj);
    if (resp['error'] == false) {
      this.getconfiguredIpInfo();
      this.spinner.hide();
      this.toastr.successToastr('Successfully Update', 'Success!');
    } else {
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'], 'Oops!');
    }
  }
  dropIp(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.Ip_temp, event.previousIndex, event.currentIndex);
  }
}
