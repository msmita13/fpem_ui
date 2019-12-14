import { Injectable } from '@angular/core';

import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
@Injectable({
  providedIn: 'root'
})
export class ReferenceDataService {
  

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    
    this.httpUrl = this.main.httpUrl + '/reference';


  }
  async deleteUploadedFile(id: any) {
    console.log(id)
    const resp = await this.http.delete<any>(this.main.httpUrl + '/upload/deleteUploadedFile' +id).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async referenceFileProcess(obj: Object) {
    const resp = await this.http.post<any>(this.main.httpUrl + '/upload/processUploadedFile', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getUploadedReferenceFiles(acct_id){
    console.log(acct_id)
    const res = await this.http.get<any>(this.main.httpUrl + '/upload/getUploadedReferenceFiles' + acct_id).toPromise().then(res => {

      return res;
    });
    return res;
  }
  async getAccountStore(acct_id){
    const res = await this.http.get<any>(this.main.httpUrl + '/platformdata/getdatastore' + acct_id).toPromise().then(res => {

      return res;
    });
    return res;
  }
  async getAllReferenceFiles(acct_id) {
    
    const res = await this.http.get<any>(this.httpUrl + '/getAllReferenceFiles' + acct_id).toPromise().then(res => {

      return res;
    });
    return res;
  }
  async getconfiguredFields(obj) {
    const resp = await this.http.get<any>(this.main.httpUrl + '/datadictionary/getconfiguredFields' + obj).toPromise().then(res => {

      return res;
    });
    return resp;
  }
  async createNewRefFile(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/createreferencefile', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }

  async updateReferenceFile(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/updateReferenceFile', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }

  async deleteRefFile(obj) {
    const resp = await this.http.delete<any>(this.httpUrl + '/deleteReferenceFile' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async getReferenceData(obj){
    const resp = await this.http.get<any>(this.httpUrl + '/getreferencedata' + JSON.stringify(obj)).toPromise().then(res => {

      return res;
    });
    return resp;
  }
  async insertRow(obj){
    const resp = await this.http.post<any>(this.httpUrl + '/addRow', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async deleteRow(obj){
    const resp = await this.http.delete<any>(this.httpUrl + '/deleteRow' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async deleteAllRows(obj){
    const resp = await this.http.delete<any>(this.httpUrl + '/deleteAllRows' + JSON.stringify(obj)).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async changeStateOfAllRows(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/changeStateOfAllRows', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async updateRow(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/updateRow', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async getRefAccountDetail(acct_id){
    const resp= this.http.get<any>(this.httpUrl+'/accountdetails'+acct_id).toPromise().then(res =>{
      console.log(res)
      return res
    });
    return resp
  }
  async getExchangeRate(acct_id){
    const resp= this.http.get<any>(this.httpUrl+'/getexchangerate'+acct_id).toPromise().then(res =>{
      console.log(res)
      return res
    });
    return resp
  }
  async getOrganisation(acct_id){
    const resp= this.http.get<any>(this.httpUrl+'/getOrganisation'+acct_id).toPromise().then(res =>{
      console.log(res)
      return res
    });
    return resp
  }
  
  async deleteAccount(params){
    console.log(params)
    const resp = await this.http.delete<any>(this.httpUrl + '/deleteaccountinfo' + params).toPromise().then(res => {
      return res;
    });
    return resp;
  }
 async Account_Setup_insert(obj){
  const resp = await this.http.post<any>(this.httpUrl + '/insertaccountdetails', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async Account_Setup_update(obj){
  const resp = await this.http.put<any>(this.httpUrl + '/updateaccountinfo', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async updateExchnageRate(obj){
  const resp = await this.http.put<any>(this.httpUrl + '/updateExchangeRate', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async updateOrg(obj){
  const resp = await this.http.put<any>(this.httpUrl + '/updateOrganisation', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async addExchnageRate(obj){
  const resp = await this.http.post<any>(this.httpUrl + '/insertExchangeRate', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async deleteExchangeRate(obj){
  const resp = await this.http.post<any>(this.httpUrl + '/deleteExchangeRate', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async addOrganisation(obj){
  const resp = await this.http.post<any>(this.httpUrl + '/insertOrganisation', obj).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async deleteOrganisation(obj){
  const resp = await this.http.delete<any>(this.httpUrl + '/deleteOrganisation'+ JSON.stringify(obj)).toPromise().then(res => {
    return res;
  });
  return resp;
 }
}
