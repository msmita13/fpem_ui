import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';
@Injectable({
  providedIn: 'root'
})
export class ProcessingService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl+'/processing';
  }


  
  async getProcessInfo(acct_id){
    console.log(acct_id)
     const res = await this.http.get<any>(this.httpUrl + '/getprocessinfo'+acct_id).toPromise().then(res => {
       console.log(res)
       return res;
     });
     return res;
  }
  // async changeState(obj){
  //   const resp = await this.http.put<any>(this.httpUrl + '/updateprocessinfo', obj).toPromise().then(res => {
  //     return res;
  //   });
  //   return resp;
  // }
  async getsystemprocess(){
  
    const res = await this.http.get<any>(this.httpUrl + '/getsystemprocesses').toPromise().then(res => {
      console.log(res)
      return res;
    });
    return res;
  }
  

   
   async Activestate(obj){
     console.log(obj)
    const res= await this.http.post<any>(this.httpUrl+'/activateprocess',obj).toPromise().then(res=>{
      return res;
    
    })
    return res
    }
    async Inactivestate(obj){
      
      const resp = await this.http.put<any>(this.httpUrl + '/deactivateprocess',obj).toPromise().then(res => {
        console.log(res)
        return res;
      });
      return resp;
    }
}