import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FinancialsService } from '../service/financials.service';
import { PlatformDataDefinitionService } from './../service/platform-data-definition.service';
import { ReferenceDataService } from '../service/reference-data.service';
import { parse } from 'querystring';

declare var $;
@Component({
  selector: 'app-financials',
  templateUrl: './financials.component.html',
  styleUrls: ['./financials.component.css']
})
export class FinancialsComponent implements OnInit {

  constructor(private router: Router, private financialService: FinancialsService, private platformDataDefinitionService: PlatformDataDefinitionService, private refService: ReferenceDataService) { }


  fpemUser;
  acct_id;

  Journal;
  Sal;
  Ip;
  Audit;

  async  ngOnInit() {

    // this.router.navigate(['/financials/savedreports']);
    

    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id = this.fpemUser.acct_id;

    var resp = await this.financialService.getOrganisationBookCodes(this.acct_id);
    if (resp['error'] == false) {

      this.financialService.org_unit_cds = [];

      this.financialService.def = resp.data;

      this.financialService.org_unit_cds.push({ org_unit_cd: 'all', organisation_name: 'ALL Organisations' });

      for (var i = 0; i < this.financialService.def.org_data.length; i++) {
        this.financialService.org_unit_cds.push(this.financialService.def.org_data[i]);
      }
      this.financialService.coas = [];

      this.financialService.coas.push({ acct_num: 'all', acct_num_desc: 'ALL Chart Of Account' })

      for (var i = 0; i < this.financialService.def.chart_of_account_data.length; i++) {

        this.financialService.coas.push({ acct_num: this.financialService.def.chart_of_account_data[i].acct_num, acct_num_desc: this.financialService.def.chart_of_account_data[i].acct_num_desc })
      }

    }
    await this.getFields();
  }

  async getFields() {
    var resp1 = await this.platformDataDefinitionService.getconfiguredJournalInfo(this.acct_id);
    var resp2 = await this.platformDataDefinitionService.getconfiguredSalInfo(this.acct_id);
    var resp3 = await this.platformDataDefinitionService.getconfiguredIpInfo(this.acct_id);
    //var resp4 = await this.platformDataDefinitionService.getconfiguredAuditInfo(this.acct_id);
    var resp5 = await this.refService.getAllReferenceFiles(this.acct_id);
    var c=0;
    if (resp1['error'] == false && resp2['error'] == false && resp3['error'] == false && resp5['error'] == false) {
      this.Journal = resp1.data;
      this.Sal = resp2.data;
      this.Ip = resp3.data;
      //this.Audit = resp4.data;

      var colNamesTemp = [];


      var d=resp5.data;
      console.log(d)
 
      for(var j=d.length-1;j>=0;j--){

        if(d[j].reference_file_type=='Hierarchy'){
          var field_id=d[j].field_id.split(',');
          var business_field_name=d[j].business_field_name.split(',');
          var tbname=d[j].reference_file_name_business;
          var file_id="ref_file_"+d[j].id
          for (var i = 0; i < field_id.length; i++) {
            c=c+1;

            colNamesTemp.push({ field_id:"c_"+field_id[i],id: c, tableName: tbname, file_id: file_id, colName: business_field_name[i], showName: tbname + " - " + business_field_name[i] ,field_logical_id:0})
          }


        }
       

      }
      console.log(this.Journal)
   
      for (var i = 0; i < this.Journal.length; i++) {

        c=c+1;
        colNamesTemp.push({ field_id:"c_"+this.Journal[i].field_id,id: c, tableName: "Journal", file_id: 'jrnl',colName: this.Journal[i].business_field_name, showName: 'Journal' + " - " + this.Journal[i].business_field_name,field_logical_id:this.Journal[i].field_logical_id })
      }
      this.financialService.store=this.Journal[0].store

      for (var i = 0; i < this.Sal.length; i++) {
        c=c+1;
        colNamesTemp.push({ field_id:"c_"+this.Sal[i].field_id,id: c, tableName: "Sal", file_id: 'sal',colName: this.Sal[i].business_field_name, showName: 'Sal' + " - " + this.Sal[i].business_field_name,field_logical_id:this.Sal[i].field_logical_id })
      }

      for (var i = 0; i < this.Ip.length; i++) {
        c=c+1;
        colNamesTemp.push({field_id:"c_"+this.Ip[i].field_id, id:c, tableName: "Ip", file_id: 'ip',colName: this.Ip[i].business_field_name, showName: 'Ip' + " - " + this.Ip[i].business_field_name,field_logical_id:this.Ip[i].field_logical_id })
      }

      /* for (var i = 0; i < this.Audit.length; i++) {
        c=c+1;
        colNamesTemp.push({field_id:"c_"+this.Audit[i].field_id, id: c, tableName: "Audit",file_id: 'audit', colName: this.Audit[i].business_field_name, showName: 'Audit' + " - " + this.Audit[i].business_field_name })
      } */


     

      this.financialService.colNames = colNamesTemp;
    } else {
      console.log('error occurred');
    }

   console.log(colNamesTemp)

  }
}
