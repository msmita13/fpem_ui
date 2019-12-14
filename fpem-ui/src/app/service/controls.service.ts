import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';
@Injectable({
  providedIn: 'root'
})
export class ControlsService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl + '/controls';
  }


  async getPpd(acct_id){
    const res = await this.http.get<any>(this.httpUrl + '/getcurrentppd' + acct_id).toPromise().then(res => {
       return res;
     });
     return res;

  }

  async getStartEndMonth(acct_id){
    const res = await this.http.get<any>(this.httpUrl + '/getStartEndMonth' + acct_id).toPromise().then(res => {
      return res;
    });
    return res;
  }

  async getAllPpdRunId(acct_id){

    const res = await this.http.get<any>(this.httpUrl + '/getppdrunids' +acct_id).toPromise().then(res => {
      return res;
    });
   
    return res;
  }

  async advancePpd(acct_id){
    var obj=new Object();
    obj['acct_id']=acct_id;

    const resp = await this.http.post<any>(this.httpUrl + '/advanceppd', obj).toPromise().then(res => {
      
      return res;
    });
    return resp;
  }
 

  async RollBack(obj){
    const resp = await this.http.post<any>(this.httpUrl + '/rollback',obj).toPromise().then(res => { 
      return res;
    });
    return resp;
  }

 async  getAllActivity(acct_id){
  const resp = await this.http.get<any>(this.httpUrl + '/getactivities'+acct_id).toPromise().then(res => { 
    return res;
  });
  return resp;

  }
 async getAccount(acct_id){
    const resp = await this.http.get<any>( this.main.httpUrl + '/reference/getaccount'+26).toPromise().then(res => { 
      console.log(res)
      return res;
    });
    return resp;
  }
}