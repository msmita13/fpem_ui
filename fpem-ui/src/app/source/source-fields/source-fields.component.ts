import { Component, OnInit } from '@angular/core';
import { SourceService } from '../../service/source.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrManager } from 'ng6-toastr-notifications';
@Component({
  selector: 'app-source-fields',
  templateUrl: './source-fields.component.html',
  styleUrls: ['./source-fields.component.css']
})
export class SourceFieldsComponent implements OnInit {

  data = [];
  acct_id = 1000;
  constructor(private source_Service: SourceService,private spinner:NgxSpinnerService,private toastr:ToastrManager) { }
  fpemUser;




  async  ngOnInit() {
    this.fpemUser=JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id = this.fpemUser.acct_id;

    var resp = await this.source_Service.getSourceFields(this.acct_id);
    if (resp['error'] == false) {
      console.log(resp.data)

      this.data = resp.data;

    } else {
      this.data = [];
    }
  }
  async getFields(){
    var resp = await this.source_Service.getSourceFields(this.acct_id);
    if (resp['error'] == false) {
      console.log(resp.data)

      this.data = resp.data;

    } else {
      this.data = [];
    }
  }
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
    
      business_field_name: {
        title: 'FIELD NAME',
      },
      business_field_desc: {
        title: 'FIELD DESCRIPTION',
      },
      technical_field_name: {
        title: 'Technical Name',
        },
      field_datatype: {
        title: 'DATA TYPE',
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: [

              { value: 'Number', title: 'Number' },
              { value: 'String', title: 'String' },
              { value: 'Double', title: 'Double' },
              { value: 'Date', title: 'Date' },
            ],

          },
        }
      },
      is_nullable: {
        title: 'IS NULLABLE',
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: [

              { value: 1, title: 'YES' },
              { value: 0, title: 'NO' },

            ],

          },
        }
      },
      field_logical_cd: {
        title: 'Logical Type',
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: [

              { value: 'Event Code', title: 'Event Code' },
              { value: 'Event ID', title: 'Event ID' },
              { value: 'None', title: 'None' },

            ],

          },
        }
      },

    },

    actions: {


      position: 'right',

    },
  }
  async onCreateConfirm(event) {
    this.spinner.show();

    var obj = new Object();
    obj['business_field_name'] = event.newData.business_field_name
    obj['acct_id'] = this.acct_id;
    obj['business_field_desc'] = event.newData.business_field_desc;
    obj['is_nullable'] = event.newData.is_nullable;
    obj['field_logical_cd'] = event.newData.field_logical_cd;

    console.log(event.newData.business_field_name)
    obj['field_datatype'] = event.newData.field_datatype;
    var str = event.newData.business_field_name.split(' ').join('_');
    obj['technical_field_name'] = event.newData.technical_field_name;
    console.log(obj)
    var resp = await this.source_Service.addSourcefield(obj);
    console.log(resp)


    if (resp['error'] == false) {
      await this.getFields();
      this.spinner.hide();

      event.confirm.resolve(event.newData);
      this.toastr.successToastr('Source Field Added Successfully','Success!')

      console.log(resp)
    } else {
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'],'Ooops!')
      // this.toastr.errorToastr('Error While Adding Source Field')
    }

  }

  async  onSaveConfirm(event) {
    this.spinner.show();

    console.log(event.newData.field_datatype)
    var obj = new Object();
    obj['business_field_name'] = event.newData.business_field_name

    obj['business_field_desc'] = event.newData.business_field_desc;
    obj['id'] = event.data.id;
    obj['is_nullable'] = event.newData.is_nullable;
    var str = event.newData.business_field_name.split(' ').join('_');
    obj['technical_field_name'] = event.newData.technical_field_name;
    obj['field_logical_cd'] = event.newData.field_logical_cd;
    obj['field_datatype'] = event.newData.field_datatype;
    console.log(obj)

    var resp = await this.source_Service.createSourcefield(obj);
    if (resp['error'] == false) {
      console.log(resp)
      this.spinner.hide();

      event.confirm.resolve(event.newData);
      this.toastr.successToastr('Source Field Updated Successfully','Success!')

    } else {
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'],'Ooops!')


    }
  }


  async onDeleteConfirm(event) {
    console.log(event.data.id)
    this.spinner.show()
    var id = event.data.id
    var resp = await this.source_Service.deleteSourcefield(id);
    if (resp['error'] == false) {

      this.data.splice(this.data.indexOf(event), 1);
      this.spinner.hide();
      event.confirm.resolve();
      this.toastr.successToastr('Source Deleted Successfully','Success!')
 }else{
   this.spinner.hide();
   this.toastr.errorToastr(resp['data'],'Ooops!')
  //  this.toastr.errorToastr('Error While Updating Source Field', 'Oop! ')
 }


  }
}