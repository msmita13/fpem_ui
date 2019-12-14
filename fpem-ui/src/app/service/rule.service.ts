import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class RuleService {
  httpUrl;

  flag = 0;
  rule_id;
  element;
  selectLayouts;



  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl;
  }
  async modifyRule(data) {

    const resp = await this.http.put<any>(this.httpUrl + '/rules/ruleupdate', data).toPromise().then(res => {
      return res;
    });
    return resp;


  }
  async deleteRule(rule_id) {

    const resp = await this.http.delete<any>(this.httpUrl + '/rules/deleterule' + rule_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async addRule(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/rules/addnewrule', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async replicateRule(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/rules/rulereplication', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getAllRules(acct_id) {
    const res = await this.http.get<any>(this.main.httpUrl + '/rules/getallrules' + acct_id).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async getRules(rule_id) {
    const res = await this.http.get<any>(this.main.httpUrl + '/rules/rulebyid' + rule_id).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getLookups(acct_id) {
    const res = await this.http.get<any>(this.main.httpUrl + '/rules/getlookups' + acct_id).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getAllLayouts(acc_id) {
    const res = await this.http.get<any>(this.main.httpUrl + '/rules/getFieldsInfo' + acc_id).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async getEventLayoutsWithInfo(acc_id) {
    const res = await this.http.get<any>(this.main.httpUrl + '/rules/EventLayoutsWithInfo' + acc_id).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async getBusinessFileWithInfo(acc_id) {
    const res = await this.http.get<any>(this.main.httpUrl + '/rules/BusinessFileWithInfo' + acc_id).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async getrulebyLayoutid(file_id) {
    const res = await this.http.get<any>(this.main.httpUrl + '/rules/getrulesbylayoutid' + file_id).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async updatestatus(obj1) {
    console.log(obj1)
    const resp = await this.http.put<any>(this.httpUrl + '/rules/updatestatus', obj1).toPromise().then(res => {
      return res;
    });
    return resp;


  }
  async layoutFields(obj) {
    const res = await this.http.get<any>(this.main.httpUrl + '/eventLayout/getLayoutFields' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async outpotFieldsinfp(obj) {
    const res = await this.http.get<any>(this.main.httpUrl + '/rules/outputfileinfo' + obj).toPromise().then(res => {
      return res;
    });
    return res;
  }


  async inputFields(acc_id) {
    const res = await this.http.get<any>(this.main.httpUrl + '/field/getfields' + acc_id).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async updaterule(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/rules/updaterule', obj).toPromise().then(res => {
      return res;
    });
    return resp;


  }

  async createrule1(obj) {

    const resp = await this.http.post<any>(this.httpUrl + '/rules/createrule1', obj).toPromise().then(res => {
      return res;
    });
    return resp;


  }

  async ruleLookups(acct_id) {
    const res = await this.http.get<any>(this.main.httpUrl + '/rules/getruleLookups' + acct_id).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async getRuleforManage(acct_id) {
    const res = await this.http.get<any>(this.main.httpUrl + '/rules/getrulesforManage' + acct_id).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async compileRule(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/rules/compileRule', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async compileRule1(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/test/compileRule', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }

  async getrulesForTestComp(acc_id) {
    const res = await this.http.get<any>(this.main.httpUrl + '/rules/getRulesForTestComponent' + acc_id).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async eventInfo(acc_id) {
    const res = await this.http.get<any>(this.main.httpUrl + '/rules/geteventsinfo' + acc_id).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async DataForLookup(acct_id) {
    const res = await this.http.get<any>(this.main.httpUrl + '/rules/getlookupdata' + acct_id).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async addLookup(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/rules/addnewlookup', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async updatelookup(obj) {

    const resp = await this.http.put<any>(this.httpUrl + '/rules/updateLookup', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }

  async deletelookup(lookup_id) {

    const resp = await this.http.delete<any>(this.httpUrl + '/rules/deleteLookup' + lookup_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }


}
