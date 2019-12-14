import { Component, OnInit } from '@angular/core';
import { SourceService } from '../../service/source.service'
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-register-source',
  templateUrl: './register-source.component.html',
  styleUrls: ['./register-source.component.css']
})
export class RegisterSourceComponent implements OnInit {
  data = [];
  acct_id;
  constructor(private source_Service: SourceService, private spinner: NgxSpinnerService, private toastr: ToastrManager) { }
  fpemUser;
  async  ngOnInit() {
    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id = this.fpemUser.acct_id;
    await this.getData();


    
  }
  async getData(){
    var resp = await this.source_Service.getSources(this.acct_id);
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
      addButtonContent: '<b class="btn"><i class="fa fa-plus" aria-hidden="true"></i>Add</b>',
      createButtonContent: '<b class="btn btn-success "><i class="fa fa-save"></i></b>',
      cancelButtonContent: '<b class="btn btn-danger "><i class="fa fa-times-circle" aria-hidden="true"></i></b>',
      confirmCreate: true
    },
    columns: {

      src_name: {
        title: 'SOURCE NAME',
      },
      src_desc: {
        title: 'SOURCE  DESCRIPTION',
      },

    },

    actions: {


      position: 'right',

    },
  }
  async onCreateConfirm(event) {
    this.spinner.show();

    var obj = new Object();
    obj['src_name'] = event.newData.src_name
    obj['acct_id'] = this.acct_id;
    obj['src_desc'] = event.newData.src_desc;

    var resp = await this.source_Service.addSource(obj);

    if (resp['error'] == false) {
      this.spinner.hide();
      event.confirm.resolve(event.newData);
      await this.getData();
      this.toastr.successToastr('Source Added Successfully')
    } else {
      this.spinner.hide();
      // this.toastr.errorToastr('Error While Adding Source')
      this.toastr.errorToastr(resp['data'], 'Ooops!')

    }

  }

  async  onSaveConfirm(event) {

    this.spinner.show();

    var obj = new Object();
    obj['src_name'] = event.newData.src_name
    obj['id'] = event.data.id;
    obj['src_desc'] = event.newData.src_desc;

    console.log(obj)

    var resp = await this.source_Service.createSource(obj);
    console.log(resp)
    if (resp['error'] == false) {
      this.spinner.hide();
      event.confirm.resolve(event.newData);
      await this.getData();
      this.toastr.successToastr('Source Updated Successfully')

    } else {
      this.spinner.hide();
      // // this.toastr.errorToastr('Error While Updating Source')
      this.toastr.errorToastr(resp['data'], 'Ooops!')


    }
  }


  async onDeleteConfirm(event, i) {
    this.spinner.show();

    console.log(event.data)
    console.log(i);
    var id = event.data.id
    var resp = await this.source_Service.deleteSource(id);
    if (resp['error'] == false) {

      this.data.splice(this.data.indexOf(event), 1);
      console.log(resp)
      this.spinner.hide();
      event.confirm.resolve();
      await this.getData();
      this.toastr.successToastr('Source Deleted Successfully')
    } else {
      this.spinner.hide();
      // this.toastr.errorToastr('Error While Deleting Source')
      this.toastr.errorToastr(resp['data'], 'Ooops!')


    }
  }
}