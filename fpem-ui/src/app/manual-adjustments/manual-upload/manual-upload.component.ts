import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FileUploader } from 'ng2-file-upload';
import { ManualService } from '../../service/manual.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrManager } from 'ng6-toastr-notifications';
import { RuleService } from '../../service/rule.service';


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
  selector: 'app-manual-upload',
  templateUrl: './manual-upload.component.html',
  styleUrls: ['./manual-upload.component.css']
})

export class ManualUploadComponent implements OnInit {
  barwidth = 0;
  dataSource;
  selectedFile;
  displayedColumns: string[] = ['file_name', 'file_type', 'process_ts', 'error_msg', 'actions', 'delete'];
  selectItem
  httpUrl;
  uploader;
  tables;
  table_name = [];
  file_name = [];
  ref_file_info
  Process = false;
  Processed = true;
  selectFileType;
  Event_layout = false
  layouts = [];
  layoutType;
  layout_id;
  checked = false;
  file_details;
  File_Type = [
    { value: 'Event Layout', name: 'Event' },
    { value: 'Journal', name: 'Journal' },
    { value: 'Arrangement', name: 'Sal' },
    { value: 'Ip', name: 'Ip' },

  ]

  fpemUser;
  constructor(private ruleService: RuleService, private toastr: ToastrManager, private manualService: ManualService, private spinner: NgxSpinnerService, ) {
    this.selectFileType = null
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  async ngOnInit() {
    $("#File_Details").draggable({
      handle: ".modal-dialog "
    });
    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));

    this.httpUrl = this.manualService.httpUrl;

    this.uploader = new FileUploader({ url: this.httpUrl, itemAlias: 'file' });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };


    await this.getEventLayouts();


    await this.getFileInfo();


  }
  async getEventLayouts() {
    this.layouts = [];

    var res = await this.ruleService.getEventLayoutsWithInfo(this.fpemUser.acct_id);
    console.log(res)
    if (res['error'] == false) {
      for (let i = 0; i < res.data.length; i++) {
        this.layouts.push({ file_name: res.data[i].event_layout_name, file_id: res.data[i].event_layout_id })
      }

      
    }
  }

  async refresh() {
    this.spinner.show();
    await this.getFileInfo();
    this.spinner.hide();
    this.toastr.successToastr('Refresh Done', 'Success!')
  }

  async getFileInfo() {

    var res = await this.manualService.getfileinfo(this.fpemUser.acct_id);
    if (res['error'] == false) {
      this.ref_file_info = res.data;
      console.log(this.ref_file_info)
      this.dataSource = new MatTableDataSource(this.ref_file_info);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

  }
  public onFileSelected(event: EventEmitter<File[]>) {
    this.selectedFile = <File>event[0];
    this.file_name = this.selectedFile.name
    readBase64(this.selectedFile)
      .then(function (data) {


      })


  }
  layoutselect(event) {

    for (var i = 0; i < this.layouts.length; i++) {
      if (event.file_name == this.layouts[i].file_name) {

        this.layout_id = this.layouts[i].file_id
      }
    }

  }
  async uploadfile() {

   // $('#uploadfile').modal('hide');
    $('#progress_bar').modal('show');

    const obj = new Object();
    obj['acct_id'] = this.fpemUser.acct_id;
    obj['user_id'] = this.fpemUser.user_id;

    obj['store'] = '';

    if (this.selectFileType == 'Event Layout') {
      obj['technical_name'] = '';
    }
    if (this.selectFileType == 'Journal') {
      obj['technical_name'] = 'jrnl';
    }
    if (this.selectFileType == 'Sal') {
      obj['technical_name'] = 'sal';
    }
    if (this.selectFileType == 'Ip') {
      obj['technical_name'] = 'ip';
    }

    obj['business_name'] = null;
    obj['file_name'] = this.uploader.queue[0].some.name;

    obj['file_type'] = this.selectFileType;
    if (this.selectFileType == 'Event Layout') {
      obj['event_layout_id'] = this.layout_id;
    } else {
      obj['event_layout_id'] = null;
    }

    if (this.checked == true) {
      obj['include_header'] = 1;
    } else if (this.checked == false) {
      obj['include_header'] = 0;
    }



    const params = JSON.stringify(obj);

    this.uploader.queue[0].url = this.httpUrl + '/upload/uploadfile' + params;

    this.uploader.queue[0].upload();

    this.uploader.onCompleteItem = async (item: any, response: any, status: any, headers: any) => {

      var res = JSON.parse(response)

      console.log(res);

      if (res['error'] == false) {
        await this.getFileInfo();
        this.toastr.successToastr('Uploaded Successfully.', 'Success!');


      } else {
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

  async process(i, element) {

    this.ref_file_info[i].is_processed = 1;
    this.ref_file_info[i].msg = 'File Processing'
    this.dataSource = new MatTableDataSource(this.ref_file_info);

    var obj = new Object();
    obj['upload_id'] = element.id;
   
    var resp = await this.manualService.FileProcess(obj);
    if (resp['error'] == false) {
      
      this.toastr.successToastr('File submitted for processing.');
    } else {

      this.toastr.errorToastr('Some error occurred, try later.');
    }



  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  changefiletype(event) {

    if (event == undefined || event == '') {
      return;
    }
    if (event.name == 'Event') {
      this.Event_layout = true;
    } else {
      this.Event_layout = false
    }
  }
  async deleteUploadedFie(i, element) {
    this.spinner.show();
    console.log(element)
     var resp = await this.manualService.deleteUploadedFie(element.id);
     if (resp['error'] == false) {
      
       await this.getFileInfo();
       this.spinner.hide();
       this.toastr.successToastr('Cleared.', 'Success!');
 
     } else {
       this.spinner.hide();
       this.toastr.errorToastr('Failed.', 'Oops!');
     }

  }
  async file_detail(element) {

    this.file_details =element;
    console.log(element.file_type)
    console.log(this.file_details.file_type)

    // this.file_name= this.file_detail.;
    //$('#File_Details').modal('show');
  }
}
