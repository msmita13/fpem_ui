import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {MainService} from './main.service';
@Injectable({
  providedIn: 'root'
})
export class ManualService {
  httpUrl;


  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl;
  }

  async  getconfiguredJournalInfo(acct_id) {

    const resp = await this.http.get<any>(this.main.httpUrl+'/datadictionary/Journal/getJournalfields' + acct_id).toPromise().then(res => {

      return res;
    });
    return resp;

  }


  async getconfiguredFields(obj){
    const resp = await this.http.get<any>(this.main.httpUrl+'/datadictionary'+'/getconfiguredFields'+obj).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }

  async FileProcess(obj){
    const res = await this.http.post<any>(this.main.httpUrl + '/job/processfile',obj).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async deleteUploadedFie(id){
    const res = await this.http.delete<any>(this.httpUrl + '/upload/deleteuploadedfile'+id).toPromise().then(res => {
      return res;
    });
    return res;

  }
  async getEvents(acct_id){
    const res = await this.http.get<any>(this.httpUrl + '/manualevent/getmanualevents' + acct_id).toPromise().then(res => {
       return res;
     });
     return res;
  }
  async getrefrencedatadropdown(acct_id){
    console.log(acct_id);
    const res = await this.http.get<any>(this.httpUrl + '/referencedata/getcodeValueData'+acct_id).toPromise().then(res => {
      return res;
    });
    console.log(res);
    return res;

  }

  async getfileinfo(acct_id){
    const res = await this.http.get<any>(this.httpUrl + '/upload/getuploadedfiles'+acct_id).toPromise().then(res => {
      console.log(res)
      return res;
    });
    return res;
  }

 async processmethod(obj){
    const res = await this.http.put<any>(this.httpUrl + '/manual/updatemanualfilestate',obj).toPromise().then(res => {
      console.log(res)
      return res;
    });
    return res;
  }
  async getJournalFields(acct_id){
    const res = await this.http.get<any>(this.httpUrl + '/manual/getJournalDtl'+acct_id).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async getSalFields(acct_id){
    const res = await this.http.get<any>(this.httpUrl + '/manual/getSalDtl'+acct_id).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async getIpFields(acct_id){
    const res = await this.http.get<any>(this.httpUrl + '/manual/getIpDtl'+acct_id).toPromise().then(res => {
      return res;
    });
    return res;
  }
  async manualJournalFire(obj){
    const resp = await this.http.post<any>(this.httpUrl + '/manualAdjustments/manual', obj).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }
  async manualSalFire(obj){
    const resp = await this.http.post<any>(this.httpUrl + '/deployment/tempreq', obj).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }
  async manualIpFire(obj){
    const resp = await this.http.post<any>(this.httpUrl + '/deployment/tempreq', obj).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }

  async manualEventFire(obj){
    const resp = await this.http.post<any>(this.httpUrl + '/manualAdjustments/manual', obj).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }

  async getDataStore(acct_id){
    const res = await this.http.get<any>(this.httpUrl + '/platformData/getDataStore'+acct_id).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async getAllSourceFields(acct_id) {
    const res = await this.http.get<any>(this.httpUrl + '/source/getSourceFields' + acct_id).toPromise().then(res => {

      return res;
    });
    return res;
  }



}