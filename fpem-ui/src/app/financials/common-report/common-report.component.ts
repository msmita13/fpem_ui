import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { FinancialsService } from '../../service/financials.service';
import { Router } from '@angular/router'
import '../../../../node_modules/pivottable/dist/pivot.min.js';
import '../../../../node_modules/pivottable/dist/pivot.min.css';
import '../../../../node_modules/subtotal/dist/subtotal.js';
import '../../../../node_modules/subtotal/dist/subtotal.css';
import { NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrManager } from 'ng6-toastr-notifications';
import { ThrowStmt, identifierModuleUrl } from '@angular/compiler';
import { JsonPipe } from '@angular/common';
import { FocusTrap } from '@angular/cdk/a11y';
import { timingSafeEqual } from 'crypto';
declare var jQuery: any;
declare var $: any;

@Injectable()

export class CustomDateAdapter {
  fromModel(value: string): NgbDateStruct {

    if (!value)
      return null
    let parts = value.split('-');
    return { year: +parts[0], month: +parts[1], day: +parts[2] } as NgbDateStruct
  }

  toModel(date: NgbDateStruct): string {
    return date ? date.year + "-" + ('0' + date.month).slice(-2) + "-" + ('0' + date.day).slice(-2) : null
  }

}
@Injectable()
export class CustomDateParserFormatter {
  parse(value: string): NgbDateStruct {
    if (!value)
      return null
    let parts = value.split('-');
    return { year: +parts[0], month: +parts[1], day: +parts[2] } as NgbDateStruct

  }
  format(date: NgbDateStruct): string {
    return date ? date.year + "-" + ('0' + date.month).slice(-2) + "-" + ('0' + date.day).slice(-2) : null
  }
}
@Component({
  selector: 'app-common-report',
  templateUrl: './common-report.component.html',
  styleUrls: ['./common-report.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: CustomDateAdapter },
  { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }]
})
export class CommonReportComponent implements OnInit {

  constructor(private toastr: ToastrManager, private financialService: FinancialsService, private spinner: NgxSpinnerService, private router: Router) {

  }
  report_params = { project_fields: [], org_unit_cd: [], book_cd: [], curr_code: undefined, curr_type_code: undefined, acct_num: [], acct_date: '', proc_date: '' };
  data;
  report_name;
  otherfilter = [];
  all_selected_book;


  book_code = [
    { book_code: 'All' },
    { book_code: 'IFRS' },
    { book_code: 'USGP' },
    { book_code: 'CAGP' },
    { book_code: 'UKGP' },
    { book_code: 'INGP' },
    { book_code: 'HKGP' },

  ]

  currency_type = [
    { name: 'Transactional', cd: 'TX' },
    { name: 'Functional', cd: 'FN' },
    { name: "Presentation", cd: 'PR' }]

  currency = [
    { code: 'USD' },
    { code: 'INR' },
    { code: 'GBP' },
    { code: 'HKD' },
    { code: 'CAD' }]
  all_selected_coa = [];
  all_selected_org = [];
  flag = 0;

  row = [];
  col = [];

  row_fields = [];
  col_fields = [];

  fpemUser;
  acct_id

  //Condition = ["=", "!=", "<", ">", "<=", ">="];
  Condition = ["="];
  project_fields = [];

  local_flag = 0;

  report_id;



  async ngOnInit() {

    this.local_flag = 0;

    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id = this.fpemUser.acct_id;

    /* if (this.financialService.lvl1Params != undefined) {
      this.report_params = this.financialService.lvl1Params;
    }
    if (this.financialService.lvl1Data[0] != undefined) {
      this.data = this.financialService.lvl1Data;

      this.row = Object.keys(this.data[0]);
      this.row.pop();
      this.col=[];

      this.buildPivot(this.row,this.col);
    } */


    if (this.financialService.flag == 1) {
      this.local_flag = 1;
      this.report_id = this.financialService.report_id;
      this.report_params = this.financialService.saved_repot.report_params;
      console.log(this.report_params.project_fields);

      this.row = this.financialService.saved_repot.row;
      console.log(this.row);
      this.col = this.financialService.saved_repot.col;
      console.log(this.col)
      this.otherfilter = this.financialService.saved_repot.otherFilter;

      this.project_fields = [];


      for (let i = 0; i < this.financialService.colNames.length; i++) {
        for (let j = 0; j < this.report_params.project_fields.length; j++) {
          if (this.report_params.project_fields[j] == this.financialService.colNames[i].id) {
            this.project_fields.push(this.financialService.colNames[i]);
          }
        }

      }
      await this.submit();
      this.toastr.successToastr('Saved Report Open Successfully.', 'Success!');
    }

  }
  async save() {



  }

  async SaveReport() {

    if (this.row.length == 0 && this.col.length == 0) {
      for (let i = 0; i < this.financialService.colNames.length; i++) {
        for (let k = 0; k < this.report_params.project_fields.length; k++) {
          if (this.report_params.project_fields[k] == this.financialService.colNames[i].id) {
            var arr = this.financialService.colNames[i].showName.split(" - ");
            this.row.push(arr[0] + '.' + arr[1])
          }
        }
      }
    }



    var obj = new Object();
    console.log(this.row)
    obj['row'] = this.row;
    obj['col'] = this.col;
    obj['report_params'] = this.report_params;
    obj['otherFilter'] = this.otherfilter;

    var obj1 = new Object();

    if (this.local_flag == 0) {
      obj1['report_name'] = this.report_name;
      obj1['acct_id'] = this.acct_id;
      obj1['report_specs'] = JSON.stringify(obj)
    } else {
      obj1['report_id'] = this.report_id;
      obj1['report_name'] = this.report_name;
      obj1['acct_id'] = this.acct_id;
      obj1['report_specs'] = JSON.stringify(obj)
    }





    if (this.local_flag == 0) {

      var resp = await this.financialService.saveReport(obj1);
      if (resp['error'] == false) {
        this.toastr.successToastr('Report Saved Successfully.', 'Success!');
        $('#save-report').modal('hide');
      }

    }
    if (this.local_flag == 1) {
      var resp = await this.financialService.updateSavedReports(obj1);
      if (resp['error'] == false) {
        this.toastr.successToastr(resp['data'], 'Success!');
        $('#save-report').modal('hide');
      }

    }





  }

  otherFilters() {

    var obj = { field_name: '', operator: '', value: '' };
    this.otherfilter.push(obj);


  }

  changeOnProjectFields(event) {
    this.project_fields = [];
    this.project_fields = event;
  }

  cancelFilter(i) {
    this.otherfilter.splice(i, 1)
  }


  async  buildPivot(row, col) {

    var dataClass = $.pivotUtilities.SubtotalPivotData;
    var renderer = $.pivotUtilities.subtotal_renderers["Table With Subtotal"];
    var aggregator = $.pivotUtilities.aggregators["Sum"](["balance"]);


    $("#output").pivot(
      this.data,
      {
        dataClass: $.pivotUtilities.SubtotalPivotData,
        rows: row,
        cols: col,

        aggregator: $.pivotUtilities.aggregators["Sum"](["balance"]),
        renderer: $.pivotUtilities.subtotal_renderers["Table With Subtotal"],
        rendererOptions: {
          arrowExpanded: ">",
          arrowCollapsed: "v",


          collapseRowsAt: 0,
          collapseColsAt: 0,

          colSubtotalDisplay: {
            disableExpandCollapse: true
          },

          table: {
            //   eventHandlers:{
            //     "click": (e, value, filters, pivotData) => {
            //         console.log("hiii");
            //         this.nextlevel(filters);
            //   }
            // }
          }

        }


      });

  }

  firstRowCalBalance() {

    var row_fields_temp = [];

    for (let k = 0; k < this.row.length; k++) {
      var obj = new Object();
      obj['field_name'] = this.row[k];
      obj['disabled'] = false;
      row_fields_temp.push(obj)
    }

    var col_fields_temp = [];

    for (let k = 0; k < this.row.length; k++) {
      var obj = new Object();
      obj['field_name'] = this.row[k];
      obj['disabled'] = true;
      col_fields_temp.push(obj)
    }

    this.row_fields = row_fields_temp;
    this.col_fields = col_fields_temp;

  }

  lastRowCalBalance() {

    var row_fields_temp1 = [];
    var col_fields_temp1 = [];

    var array = [];

    for (let k = 0; k < this.report_params.project_fields.length; k++) {
      for (let l = 0; l < this.financialService.colNames.length; l++) {
        if (this.report_params.project_fields[k] == this.financialService.colNames[l].id) {
          array.push(this.financialService.colNames[l].showName);
        }
      }
    }



    // var array = [];
    // for (let j = 0; j < array_temp.length; j++) {
    //   var arr = array_temp[j].split(" - ");
    //   array.push(arr[0] + '.' + arr[1]);

    // }


    for (let k = 0; k < array.length; k++) {
      if (this.row.indexOf(array[k]) < 0 && this.col.indexOf(array[k]) < 0) {
        var obj = new Object();
        obj['field_name'] = array[k];
        obj['disabled'] = true;
        row_fields_temp1.push(obj)
        col_fields_temp1.push(obj)

      } else if (this.row.indexOf(array[k]) < 0 && !(this.col.indexOf(array[k]) < 0)) {

        var obj = new Object();
        obj['field_name'] = array[k];
        obj['disabled'] = true;
        row_fields_temp1.push(obj);

        var obj1 = new Object();
        obj1['field_name'] = array[k];
        obj1['disabled'] = false;
        col_fields_temp1.push(obj1);

      }
      else if (!(this.row.indexOf(array[k]) < 0) && (this.col.indexOf(array[k]) < 0)) {
        var obj = new Object();
        obj['field_name'] = array[k];
        obj['disabled'] = false;

        row_fields_temp1.push(obj);

        var obj1 = new Object();
        obj1['field_name'] = array[k];
        obj1['disabled'] = true;
        col_fields_temp1.push(obj1);

      }
      else {

        var obj = new Object();
        obj['field_name'] = array[k];
        obj['disabled'] = false;

        row_fields_temp1.push(obj);

        var obj1 = new Object();
        obj1['field_name'] = array[k];
        obj1['disabled'] = false;
        col_fields_temp1.push(obj1);

      }

    }


    this.row_fields = row_fields_temp1;
    this.col_fields = col_fields_temp1;


  }

  async submitrowcol() {
    this.spinner.show();
    await this.buildPivot(this.row, this.col);
    this.spinner.hide();
  }


  async change_col_row(event, type) {

    if (type == 'row') {
      this.row = [];

      for (let j = 0; j < event.length; j++) {
        this.row.push(event[j].field_name)
      }

      var temp_row_fields = [];
      for (let k = 0; k < this.row_fields.length; k++) {
        temp_row_fields.push(this.row_fields[k])
      }

      var temp_col_fields = [];
      for (let k = 0; k < this.col_fields.length; k++) {
        temp_col_fields.push(this.col_fields[k]);
      }


      for (let i = 0; i < temp_row_fields.length; i++) {
        if ((this.row.indexOf(temp_row_fields[i].field_name) < 0) && (this.col.indexOf(temp_row_fields[i].field_name) < 0)) {
          temp_row_fields[i].disabled = false
          temp_col_fields[i].disabled = false

        } else {
          if (!(this.row.indexOf(temp_row_fields[i].field_name) < 0)) {
            temp_row_fields[i].disabled = false
            temp_col_fields[i].disabled = true
          }
          else if (!(this.col.indexOf(temp_row_fields[i].field_name) < 0)) {
            temp_row_fields[i].disabled = true
            temp_col_fields[i].disabled = false
          }

        }

      }

      this.col_fields = temp_col_fields;
      this.row_fields = temp_row_fields;

    }

    if (type == 'col') {
      this.col = [];

      for (let j = 0; j < event.length; j++) {
        this.col.push(event[j].field_name)
      }

      var temp_row_fields = [];
      for (let k = 0; k < this.row_fields.length; k++) {
        temp_row_fields.push(this.row_fields[k])
      }
      var temp_col_fields = [];
      for (let k = 0; k < this.col_fields.length; k++) {
        temp_col_fields.push(this.col_fields[k])
      }

      for (let i = 0; i < temp_row_fields.length; i++) {
        if ((this.row.indexOf(temp_row_fields[i].field_name) < 0) && (this.col.indexOf(temp_row_fields[i].field_name) < 0)) {

          temp_row_fields[i].disabled = false
          temp_col_fields[i].disabled = false

        } else {
          if (!(this.row.indexOf(temp_row_fields[i].field_name) < 0)) {

            temp_row_fields[i].disabled = false
            temp_col_fields[i].disabled = true
          }

          else if (!(this.col.indexOf(temp_row_fields[i].field_name) < 0)) {

            temp_row_fields[i].disabled = true
            temp_col_fields[i].disabled = false

          }
        }




      }
      this.col_fields = temp_col_fields;
      this.row_fields = temp_row_fields;

    }



  }


  async submit() {

    this.spinner.show();
    console.log(this.report_params);
    this.getSelectedGaaps();
    this.getSelectedAccounts();
    this.getSelectedOrganisations();
    var returnObj = this.createReportingQuery();

    if (returnObj['error'] == false) {
      var obj = new Object();
      obj['store'] = this.financialService.store;
      obj['query'] = returnObj['data'];
      var resp = await this.financialService.adhoc(obj);
      if (resp['error'] == false) {
        this.data = resp.data;
        this.financialService.lvl1Data = this.data;
        this.financialService.lvl1Params = this.report_params;

        if (this.data[0] != undefined) {

          if (this.row.length == 0 && this.col.length == 0 || this.financialService.flag == 0) {

            this.row = Object.keys(this.data[0]);
            this.row.pop();
            this.col = [];
            this.firstRowCalBalance();

          } else if (this.financialService.flag == 1) {

            this.financialService.flag = 0;
            this.lastRowCalBalance();

          }

          this.buildPivot(this.row, this.col);

        } else {
          this.toastr.infoToastr('No Record Found', 'Hi!');
        }


        this.spinner.hide();

      } else {
        this.spinner.hide();
        this.toastr.errorToastr('Server Side Error, Try Later.', 'Oops!');
      }
    } else {

      this.spinner.hide();
      this.toastr.errorToastr('Somethings is Wrong.', 'Oops!');
    }
  }

  getSelectedAccounts() {
    for (let i = 0; i < this.report_params.acct_num.length; i++) {
      if (this.report_params.acct_num[i] == 'all') {
        this.all_selected_coa = [];
        this.flag = 1;
        for (let k = 0; k < this.financialService.coas.length; k++) {
          if (this.financialService.coas[k].acct_num != 'all') {
            this.all_selected_coa.push(this.financialService.coas[k].acct_num)

          }
        }
        break;
      }
      else {
        this.all_selected_coa = this.report_params.acct_num;
      }
    }
  }
  getSelectedOrganisations() {
    for (let i = 0; i < this.report_params.org_unit_cd.length; i++) {
      if (this.report_params.org_unit_cd[i] == 'all') {
        this.all_selected_org = [];
        this.flag = 1;
        for (let k = 0; k < this.financialService.org_unit_cds.length; k++) {
          if (this.financialService.org_unit_cds[k].org_unit_cd != 'all') {
            this.all_selected_org.push(this.financialService.org_unit_cds[k].org_unit_cd)

          }
        }
        break;
      }
      else {
        this.all_selected_org = this.report_params.org_unit_cd;
      }
    }
  }
  getSelectedGaaps() {
    for (let i = 0; i < this.report_params.book_cd.length; i++) {
      if (this.report_params.book_cd[i] == 'All') {
        this.all_selected_book = ['IFRS', 'USGP', 'CAGP', 'UKGP', 'INGP', 'HKGP'];
        break;
      }
      else {
        this.all_selected_book = this.report_params.book_cd;
      }
    }
  }
  getProjectFieldsAndTableUsed() {
     var obj = {};
     var projectFields = {};
     var tables_used = ['jrnl'];

     for (var i = 0; i < this.report_params.project_fields.length; i++) {
       for (var j = 0; j < this.financialService.colNames.length; j++) {
         if (this.report_params.project_fields[i] == this.financialService.colNames[j].id) {
           if (projectFields[this.financialService.colNames[j].file_id] == undefined) {
             projectFields[this.financialService.colNames[j].file_id] = [];
             if (this.financialService.colNames[j].file_id != 'jrnl') {
               tables_used.push(this.financialService.colNames[j].file_id);
             }
           }
           projectFields[this.financialService.colNames[j].file_id].push({technical_col_name:this.financialService.colNames[j].field_id,business_col_name:this.financialService.colNames[j].showName});
         }
       }
     }
     if(tables_used.indexOf('ip')!=-1 && tables_used.indexOf('sal')==-1){
       tables_used.push('sal');
     }
     obj['projectFields'] = projectFields;
     obj['tables_used'] = tables_used;

     return obj;
  }
  getReportFilters() {
   var  acctDtColName=this.getColName(6)
   var ppdColName=this.getColName(17);
   var bookCdColName=this.getColName(3);
   var tgtTypeColeName=this.getColName(4);
   var tgtCurrColName=this.getColName(5);
   var orgUnitColName=this.getColName(2);
   var acctNumColName=this.getColName(1);
      var filter = {
      jrnl:{
        
      }
      
    }
    filter.jrnl[acctDtColName]=[this.report_params.acct_date];
    filter.jrnl[ppdColName]=[this.report_params.proc_date];
    filter.jrnl[bookCdColName]=this.all_selected_book;
    filter.jrnl[tgtTypeColeName]=[this.report_params.curr_type_code];
    filter.jrnl[tgtCurrColName]= [this.report_params.curr_code];
    filter.jrnl[orgUnitColName]=this.all_selected_org;
    filter.jrnl[acctNumColName]=this.all_selected_coa;

    for(let i=0;i<this.otherfilter.length;i++){
      var technical_col_name;
      var file_id;
      var value=this.otherfilter[i].value;

      for(let j=0;j<this.financialService.colNames.length;j++){
        if(this.otherfilter[i].field_name==this.financialService.colNames[j].showName){
          technical_col_name=this.financialService.colNames[j].field_id;
          file_id=this.financialService.colNames[j].file_id;
        }
      }
      var tn=technical_col_name;

      if(filter[file_id]==undefined){
        var obj = new Object();
        obj[tn]=[value];
        filter[file_id]=obj;
      }
      else{
              if(filter[file_id][tn]==undefined){
              
                filter[file_id][tn]=[value];
              }
              else{
                var arr=filter[file_id][tn];
                arr.push(value);
                filter[file_id][tn]=arr;
              }
        
      }


    }

    console.log(filter)
    console.log(this.otherfilter)
    return filter;
  }

  getAllFields(){
     var allFlds = {};
     var total_table=[];

     for(let i=0;i<this.financialService.colNames.length;i++){
      if(total_table.indexOf(this.financialService.colNames[i].file_id)<0){
        total_table.push(this.financialService.colNames[i].file_id)
      }
    }

      for(let j=0;j<total_table.length;j++){
      var arr=[];
      for(let i=0;i<this.financialService.colNames.length;i++){
              if(this.financialService.colNames[i].file_id==total_table[j]){
                arr.push(this.financialService.colNames[i].field_id)
              }
     }
     allFlds[total_table[j]]=arr;
    }
    console.log(allFlds)
    return allFlds;
  }
  getColName(id){

    var field_id;
    console.log(this.financialService.colNames.length);
    for(let i=0;i<this.financialService.colNames.length;i++){
      if(this.financialService.colNames[i].field_logical_id==id){
        field_id=this.financialService.colNames[i].field_id;
      }
    }
    console.log(field_id);
    return field_id;
  }


  createReportingQuery() {


    let dbName = "svayam_"+this.fpemUser.acct_id+"_data."

    let sal_natural_key = [this.getColName(14)];
    let ip_natural_key = [this.getColName(16)];

    let journal_name = "jrnl";
    let arr_name = "sal";
    let ip_name = "ip";

    let duration = 'Period'

    var obj1= this.getProjectFieldsAndTableUsed();
   
    let allFlds = this.getAllFields();

    let tables_used = obj1['tables_used'];
    console.log(tables_used);
    let isExtension={};
    let isExtensionOf = {  }
    for(var i=0;i<tables_used.length;i++){
      isExtension[tables_used[i]]=0;
    }

   

    var projectFlds = obj1['projectFields'];

    let acct_dt_col_name = this.getColName(6);

    let txn_amt_col_name =  this.getColName(7);
  
    let filter =  this.getReportFilters();

    let returnObj = {}

    let obj = this.getProjectAndGroupPartWithAlias(tables_used, projectFlds);

    let tableAlias = obj.table_alias;

    let filterPart = this.getFilterPart(acct_dt_col_name, obj.table_alias, filter, duration)

    let fromPart = " " + dbName + "jrnl " + tableAlias[journal_name];

    tables_used.splice(tables_used.indexOf(journal_name), 1);

    let prevTables = [journal_name]

    let arr_index = tables_used.indexOf(arr_name);

    if (arr_index != -1) {
      fromPart += this.joinWithSal(arr_name, sal_natural_key, dbName,
        tableAlias[arr_name], tableAlias[journal_name]);
      prevTables.push(arr_name);
      tables_used.splice(arr_index, 1);
    }

    let ip_index = tables_used.indexOf(ip_name);

    if (ip_index != -1 && arr_index != -1) {
      fromPart += this.joinWithIp(ip_name, ip_natural_key, dbName,
        tableAlias[ip_name], tableAlias[arr_name]);
      prevTables.push(ip_name);
      tables_used.splice(ip_index, 1);
    } else if (ip_index != -1 && arr_index == -1) {
      console.log("Both ip and sal should be there")
      returnObj["error"] = true
      returnObj["data"] = "Both ip and sal should be there"
      return returnObj;
    }

    for (let j = 0; j < tables_used.length; j++) {

      if (isExtension[tables_used[j]] == 1) {
        fromPart += " join " + dbName + tables_used[j] + " " + tableAlias[tables_used[j]] + " on "

        let parentTable = isExtensionOf[tables_used[j]]

        fromPart += tableAlias[parentTable] + "." + parentTable + "_uuid=" + tableAlias[tables_used[j]] + "." + tables_used[j] + "_uuid"
      } else {
        let gotMatch = false;
        for (let k = 0; k < prevTables.length; k++) {

          let matchedCols =
            this.getMatchingColumns(allFlds[tables_used[j]],
              allFlds[prevTables[k]])

          if (gotMatch == false && matchedCols.length > 0) {
            gotMatch = true
            fromPart += " left join " + dbName + tables_used[j] + " "
              + tableAlias[tables_used[j]] + " on "
          }
          for (let i = 0; i < matchedCols.length; i++) {
            fromPart += " " + tableAlias[tables_used[j]] + "." +
              matchedCols[i] + "=" + tableAlias[prevTables[k]] + "." +
              matchedCols[i] + " and ";

          }

        }

        if (!gotMatch) {
          console.log("No matching key for " + tables_used[j])
          returnObj["error"] = true
          returnObj["data"] = "No matching key for " + tables_used[j]
          return returnObj;

        } else {
          fromPart = fromPart.substring(0, fromPart.length - 5);
        }
      }


    }


    let final_query = "Select " + obj.project_part + ", sum(" +
      tableAlias[journal_name] + "." + txn_amt_col_name + ") as balance from " +
      fromPart + " " + filterPart + " group by " + obj.group_part

    console.log(final_query)

    returnObj["error"] = false;
    returnObj["data"] = final_query

    return returnObj;

  }

  getMatchingColumns(flds1, flds2) {

    let res = []
    let fldObj = {}

    for (let i = 0; i < flds1.length; i++) {
      fldObj[flds1[i]] = true
    }

    for (let i = 0; i < flds2.length; i++) {
      if (fldObj[flds2[i]] == true) {
        res.push(flds2[i]);
      }
    }

    return res;

  }

  joinWithSal(arr_name, joinCols, db, arrAls, jrnlAls) {

    let tempJoinPart = " left join " + db + arr_name + " " + arrAls + " on "


    for (let i = 0; i < joinCols.length; i++) {
      tempJoinPart += " " + jrnlAls + "." +
        joinCols[i] + "=" + arrAls + "." + joinCols[i]
      if (i < joinCols.length - 1) {
        tempJoinPart += " and "
      }
    }
    return tempJoinPart;


  }

  joinWithIp(ip_name, joinCols, db, ipAls, arrAls) {

    let tempJoinPart = " left join " + db + ip_name + " " + ipAls + " on "



    for (let i = 0; i < joinCols.length; i++) {
      tempJoinPart += " " + ipAls + "." +
        joinCols[i] + "=" + arrAls + "." + joinCols[i]
      if (i < joinCols.length - 1) {
        tempJoinPart += " and "
      }
    }
    console.log(tempJoinPart);
    return tempJoinPart;


  }

  getProjectAndGroupPartWithAlias(tables_used, projectFields) {

    let tempProjectPart = ""
    let tempGroupPart = ""
    let tempTblAls = {}
    for (let i = 0; i < tables_used.length; i++) {
      let p_flds = projectFields[tables_used[i]]
      tempTblAls[tables_used[i]] = tables_used[i] + "_" + i
      if (p_flds != undefined) {

        for (let j = 0; j < p_flds.length; j++) {

          tempProjectPart += " " + tables_used[i] + "_" + i + "." +
            p_flds[j]["technical_col_name"] + ' as `' +
            p_flds[j]["business_col_name"] + '`,';
          tempGroupPart += " " + tables_used[i] + "_" + i + "." +
            p_flds[j]["technical_col_name"] + ","


        }

      }


    }
    tempProjectPart = tempProjectPart.substring(0, tempProjectPart.length - 1);
    tempGroupPart = tempGroupPart.substring(0, tempGroupPart.length - 1)

    return {
      "project_part": tempProjectPart, "group_part": tempGroupPart,
      "table_alias": tempTblAls
    }



  }

  getFilterPart(acctDtColName, tableAls, filter, duration) {

    let tables = Object.keys(filter)

    let tempFilterPart = " where ";


    for (let k = 0; k < tables.length; k++) {
      let filterFlds = Object.keys(filter[tables[k]]);
      let table_name = tables[k]

      for (let i = 0; i < filterFlds.length; i++) {

        if (filterFlds[i] == acctDtColName) {
          if (duration == 'Period') {
            tempFilterPart += " " + tableAls[table_name] + "." +
              filterFlds[i] + " <='" + filter[table_name][filterFlds[i]][0] + "' "
          }
          else {
            tempFilterPart += " (" + tableAls[table_name] + "." +
              filterFlds[i] + " <='" + filter[table_name][filterFlds[i]][1] + "' and " +
              tableAls[table_name] + "." + filterFlds[i] + " >='" +
              filter[table_name][filterFlds[i]][0] + " ) "
          }
        }
        else {
          tempFilterPart += " " + tableAls[table_name] + "." +
            filterFlds[i] + " in ("
          let values = filter[table_name][filterFlds[i]]
          for (let j = 0; j < values.length; j++) {
            tempFilterPart += "'" + values[j] + "'";
            if (j < values.length - 1) {
              tempFilterPart += ","
            }
          }
          tempFilterPart += ") "
        }
        if (i < filterFlds.length - 1) {
          tempFilterPart += " and "
        }
      }
    }



    return tempFilterPart;
  }



  myFunction() {


    let printContents, popupWin;
    printContents = document.getElementById('output').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
      <head>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
      </head>
      <style>

      </style>
  <body onload="window.print();window.close()">${printContents}</body>
    </html>`
    );
    popupWin.document.close();


  }

}
