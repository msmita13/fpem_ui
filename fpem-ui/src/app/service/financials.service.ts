import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';
@Injectable({
  providedIn: 'root'
})
export class FinancialsService {
  

  httpUrl;

  flag=0;
  saved_repot;

  lvl1Params;
  lvl1Data;

  store;
  org_unit_cds;
  coas;
  colNames;

  def;

  report_id;


  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl+'/financial';
  }
  async saveReport(obj){
    const resp = await this.http.post<any>(this.httpUrl + '/SaveReport', obj).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }
 
  async getSavedReports(acct_id){
      const res = await this.http.get<any>(this.httpUrl + '/getreports'+acct_id).toPromise().then(res => {
       
        return res;
      });
      return res;
    }

  
  async deleteSavedReports(report_id){
    const res = await this.http.delete<any>(this.httpUrl + '/deletereport'+report_id).toPromise().then(res => {
     
      return res;
    });
    return res;

  }
  async updateSavedReports(obj){
    const resp = await this.http.put<any>(this.httpUrl + '/updateReport', obj).toPromise().then(res => {
      
      return res;
    });
    return resp;

  }

  async getOrganisationBookCodes(acct_id){

    const res = await this.http.get<any>(this.httpUrl + '/getOrganisationBookCodes'+acct_id).toPromise().then(res => {
      return res;
    });
    return res;

  }

  async columnNames(acct_id){
    const res = await this.http.get<any>(this.httpUrl + '/getfilefieldsinfo'+acct_id).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async SaveReport(obj){
    const resp = await this.http.post<any>(this.httpUrl + '/SaveReport', obj).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }
  async adhoc(obj){
    const resp = await this.http.post<any>(this.httpUrl + '/getGeneralData', obj).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }


 
  
  

}
