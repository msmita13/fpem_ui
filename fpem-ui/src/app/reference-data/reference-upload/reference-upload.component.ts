import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { ReferenceDataService } from '../../service/reference-data.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { MainService } from '../../service/main.service'
import { element } from 'protractor';

import { ToastrManager } from 'ng6-toastr-notifications';

declare var $: any;
function readBase64(file): Promise<any> {
  var reader = new FileReader();
  var future = new Promise((resolve, reject) => {
    reader.addEventListener("load", function () {
      console.log("successfullyloaded")
      resolve(reader.result);
    }, false);

    reader.addEventListener("error", function (event) {
      console.log("Some Error Occur Ehile uploading File")
      reject(event);
    }, false);

    reader.readAsDataURL(file);
  });
  return future;
}
@Component({
  selector: 'app-reference-upload',
  templateUrl: './reference-upload.component.html',
  styleUrls: ['./reference-upload.component.css']
})




export class ReferenceUploadComponent implements OnInit {
  dataSource;
  selectedFile;
  displayedColumns: string[] = ['file_name', 'table_name', 'error_msg', 'actions', 'process_ts'];
  selectItem
  httpUrl;
  uploader;
  user_id;
  data = [];
  table_name = [];
  file_name = [];
  ref_file_info
  Process = false;
  Processed = true;
  checked = false;
  is_processed = '0';
  store;
  ref_file_name
  fpemUser;
  acct_id;
  files = [];
  barwidth = 0;
  ref_id;
  File_type
  Option = [];
  Is_show=false;
  cols={
    ref_organisation: ['Organisation Code','Organisation Name','Base Currency','Presentation Currency','Eligible Gaap','IUE Cost Center'],
    ref_account: ['Account Number','Acount Number Description','Account Type Code','On/Off Indicator'],
    ref_exchange_rate: ['From Currency','To Currency','Rate','Effective Date'],
    ref_iue_account: ['Account Number','On Balancesheet Reclass Account','Off Blaancesheet Reclass Account'],
    ref_reclass_account: ['Account Number','Book Code','Reclass Account']
  }
  constructor(private refService: ReferenceDataService, private spinner: NgxSpinnerService, private toastr: ToastrManager, private mainservice: MainService) { }


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  async ngOnInit() {
    this.httpUrl = this.mainservice.httpUrl;
    this.uploader = new FileUploader({ url: this.httpUrl, itemAlias: 'file' });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    $("#uploadfile").draggable({
      handle: ".modal-dialog "
    });


    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id = this.fpemUser.acct_id;
    this.user_id = this.fpemUser.user_id;
    await this.getReferenceFiles();
    await this.getUploadedFiles();



  }
  async getUploadedFiles() {
    var resp = await this.refService.getUploadedReferenceFiles(this.acct_id);
    if (resp['error'] == false) {
      this.data = resp.data;
      console.log(this.data)
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {

    }
  }
  async getReferenceFiles() {
    var resp = await this.refService.getAllReferenceFiles(this.acct_id);
    if (resp['error'] == false) {
      this.files = resp.data;
      
      this.files.push({ acct_id: 30,field_id: "277,305,307,306,308",id: 'ref_organisation', reference_file_name_business: "Organisation(System Created)", reference_file_type: "Hierarchy",store: "MySQL"
      },{ acct_id: 30,field_id: "277,305,307,306,308",id: 'ref_account', reference_file_name_business: "Chart Of Account(System Created)", reference_file_type: "Hierarchy",store: "MySQL"
    },{ acct_id: 30,field_id: "277,305,307,306,308",id: 'ref_exchange_rate', reference_file_name_business: "Exchange Rate(System Created)", reference_file_type: "Hierarchy",store: "MySQL"
  },{ acct_id: 30,field_id: "277,305,307,306,308",id: 'ref_reclass_account', reference_file_name_business: "Gaap Reclass Account(System Created)", reference_file_type: "Hierarchy",store: "MySQL"
},{ acct_id: 30,field_id: "277,305,307,306,308",id: 'ref_iue_account', reference_file_name_business: "IUE Reclass Account(System Created)", reference_file_type: "Hierarchy",store: "MySQL"
})
    }
    console.log(this.files)

  }


  async refresh() {
    this.spinner.show();
    await this.getUploadedFiles();
    this.spinner.hide();
    this.toastr.successToastr('Refresh Done', 'Success!')
  }



  public onFileSelected(event: EventEmitter<File[]>) {
    this.selectedFile = <File>event[0];


    this.file_name = this.selectedFile.name
    readBase64(this.selectedFile)
      .then(function (data) {



      });


  }
  async process(i, element) {

    this.spinner.show();
    console.log(element)

    var obj = new Object();
    obj['include_header'] = element.include_header;
    obj['upload_id'] = element.id;
    obj['file_name'] = element.file_name;
    obj['acct_id'] = this.acct_id;
    obj['technical_name'] = element.technical_name;
    obj['store'] = element.store;
    console.log(obj)
    var resp = await this.refService.referenceFileProcess(obj);

    console.log(resp);

    if (resp['error'] == false) {
      await this.getUploadedFiles();
      this.spinner.hide();
      this.toastr.successToastr('File submitted for processing.', 'Success!');

    } else {
      this.spinner.hide();
      this.toastr.errorToastr('Somethings is Wrong.', 'Oops!');
    }

  }


 async changeReferenceData(event) {
    if (event == undefined || event == '') {
      return;
    }
    if (event.id == 'ref_account' || event.id == 'ref_exchange_rate' || event.id == 'ref_organisation'|| event.id =='ref_reclass_account' || event.id == 'ref_iue_account') {
      this.Is_show=true
       this.store= event.store;
       this.ref_file_name=event.id;
       this.ref_id = event.id;
       this.File_type= 'Special Reference'
    } else {
      this.Is_show= false
    this.store = event.store;
    this.ref_file_name = event.reference_file_name_business;
    this.ref_id = event.id;
  this.File_type= 'Reference'}
  }

  async uploadfile() {

      this.spinner.show();


      $('#uploadfile').modal('hide');

      $('#progress_bar').modal('show');

      const obj = new Object();
      obj['acct_id'] = this.acct_id;
      obj['user_id'] = this.user_id;
      obj['store'] = this.store;
      obj['technical_name'] = this.ref_id;
      obj['business_name'] = this.ref_file_name
      obj['file_name'] = this.uploader.queue[0].some.name;
      obj['file_type'] = this.File_type;
      obj['event_layout_id'] = null;
      if (this.checked == true) {
        obj['include_header'] = 1;
      } else if (this.checked == false) {
        obj['include_header'] = 0;
      }
      console.log(obj)


       const params = JSON.stringify(obj);
       this.uploader.queue[0].url = this.httpUrl + '/upload/uploadfile' + params;
       this.uploader.queue[0].upload();
      this.uploader.onCompleteItem = async (item: any, response: any, status: any, headers: any) => {
         console.log(response)
         if (!response.error) {
         console.log(response)
           await this.getUploadedFiles();
         this.spinner.hide();
          this.toastr.successToastr('Uploaded Successfully.', 'Success!');


       } else {
        this.spinner.hide();

           this.toastr.errorToastr('Upload Failed.', 'Oops!');
  }
     };

      this.uploader.onProgressItem = (progress: any) => {
   this.barwidth = progress['progress']
        if (progress['progress'] == 100) {
          $('#progress_bar').modal('hide');
          this.barwidth = 0;
     }
      };
    


  }


  onclick(event) {
    event.target.value = null;
    this.uploader = new FileUploader({ url: this.httpUrl, itemAlias: 'file' });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
  }


  async deleteUploadedFile(i, element) {
    console.log(element)
    this.spinner.show();
    var resp = await this.refService.deleteUploadedFile(element.id);

    if (resp['error'] == false) {

      await this.getUploadedFiles();
      this.spinner.hide();
      this.toastr.successToastr('Cleared.', 'Success!');

    } else {

      this.spinner.hide();
      this.toastr.errorToastr('Failed.', 'Oops!');

    }

  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
