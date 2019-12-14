import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentSetupService {

  httpUrl;
  httpUrlPlatform;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl + '/environment';
    this.httpUrlPlatform = this.main.httpUrl + '/platformdata';
  }

 async  getAllSystemDataCureency(){
  const resp = await this.http.get<any>(this.httpUrlPlatform + '/getavailablecurrencies').toPromise().then(res => {
      
    return res;
  });
  return resp;
  }

  async  getAllProcess(){
    const resp = await this.http.get<any>(this.httpUrlPlatform + '/getallprocesses').toPromise().then(res => {
        
      return res;
    });
    return resp;
    }

  async  getAllLogicalFields(){
      const resp = await this.http.get<any>(this.httpUrlPlatform + '/getAllLogicalFields').toPromise().then(res => {
          
        return res;
      });
      return resp;
      }

  async getDefaultGeneralData(ind_id){
    const resp = await this.http.get<any>(this.httpUrl + '/getDefaultGeneralData'+ind_id).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }

  async getDefaultFields(ind_id){
    const resp = await this.http.get<any>(this.httpUrl + '/getDefaultFields'+ind_id).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }

  async getDefaultProcess(ind_id){
    const resp = await this.http.get<any>(this.httpUrl + '/getDefaultprocesses'+ind_id).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }

  async getDefaultSalInfo(ind_id){
    const resp = await this.http.get<any>(this.httpUrl + '/getDefaultSalInfo'+ind_id).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }

  async getDefaultIpInfo(ind_id){
    const resp = await this.http.get<any>(this.httpUrl + '/getDefaultIpInfo'+ind_id).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }

  async getDefaultJournalInfo(ind_id){
    const resp = await this.http.get<any>(this.httpUrl + '/getDefaultJournalInfo'+ind_id).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }

  async getDefaultAuditInfo(ind_id){
    const resp = await this.http.get<any>(this.httpUrl + '/getDefaultAuditInfo'+ind_id).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }

  async  getSavedGeneralData(acct_id){
    const resp = await this.http.get<any>(this.httpUrl + '/getSavedGeneralData'+acct_id).toPromise().then(res => {
        
      return res;
    });
    return resp;
    }

 
  async getconfiguredProcesses(obj){
    const resp = await this.http.get<any>(this.httpUrl + '/getconfiguredProcesses'+obj).toPromise().then(res => {
      
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


  async saveGeneralInfo(obj){
    const resp = await this.http.post<any>(this.httpUrl + '/saveGeneraldata', obj).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }

  async SaveProcessAndFields(obj){
    const resp = await this.http.post<any>(this.httpUrl + '/saveconfiguredProcessesandfields', obj).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }

 

  async CreateStructures(obj){
    const resp = await this.http.post<any>(this.httpUrl + '/CreateStructures',obj).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }
  

  
  
  async updateGeneralInfo(obj){
    const resp = await this.http.put<any>(this.httpUrl + '/updateGeneraldata', obj).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }

  async updateconfiguredProcessesAndFields(obj){
    const resp = await this.http.put<any>(this.httpUrl + '/updateconfiguredProcessesandfields',obj).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }


  


}
