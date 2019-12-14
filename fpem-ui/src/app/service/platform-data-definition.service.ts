import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class PlatformDataDefinitionService {
  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl + '/datadictionary';
  }

  async getconfiguredFields(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/getconfiguredFields' + obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }
  async updateConfiguredField(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/updateField', obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }

  async addNewField(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/addNewField', obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }

  async deleteField(field_id) {
    const resp = await this.http.delete<any>(this.httpUrl + '/deleteField' + field_id).toPromise().then(res => {

      return res;
    });
    return resp;
  }


  async  getconfiguredJournalInfo(acct_id) {

    const resp = await this.http.get<any>(this.httpUrl + '/Journal/getJournalfields' + acct_id).toPromise().then(res => {

      return res;
    });
    return resp;

  }

  async  getconfiguredIpInfo(acct_id) {

    const resp = await this.http.get<any>(this.httpUrl + '/ip/getipfields' + acct_id).toPromise().then(res => {

      return res;
    });
    return resp;

  }

  async  getconfiguredAuditInfo(acct_id) {

    const resp = await this.http.get<any>(this.httpUrl + '/audit/getauditfields' + acct_id).toPromise().then(res => {

      return res;
    });
    return resp;

  }

  async  getconfiguredSalInfo(acct_id) {

    const resp = await this.http.get<any>(this.httpUrl + '/sal/getsalfields' + acct_id).toPromise().then(res => {

      return res;
    });
    return resp;

  }


  async  UpdateJournal(obj) {

    const resp = await this.http.put<any>(this.httpUrl + '/journal/UpdateJournal', obj).toPromise().then(res => {

      return res;
    });
    return resp;

  }
  async  UpdateIp(obj) {

    const resp = await this.http.put<any>(this.httpUrl + '/ip/UpdateIp', obj).toPromise().then(res => {

      return res;
    });
    return resp;

  }
  async  UpdateSal(obj) {

    const resp = await this.http.put<any>(this.httpUrl + '/sal/UpdateSal', obj).toPromise().then(res => {

      return res;
    });
    return resp;

  }
  async  UpdateAudit(obj) {

    const resp = await this.http.put<any>(this.httpUrl + '/audit/UpdateAudit', obj).toPromise().then(res => {

      return res;
    });
    return resp;

  }
  async  getAllLogicalFields(){

    const resp = await this.http.get<any>(this.main.httpUrl + '/platformdata'+ '/getAllLogicalFields').toPromise().then(res => {

      return res;
    });
    return resp;

  }
}
