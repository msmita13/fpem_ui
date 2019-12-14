import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl+'/profile';
  }
  async getImage(user_id) {
    const obj = new Object();
    obj['user_id'] = user_id;
  const resp = await this.http.post(this.httpUrl + '/getprofileimage', obj, { responseType: 'blob' }).toPromise().then(res => {
      console.log(res);
      return res;
    });
    if (resp) {
      return resp;
    }
  }
  async getUserProfileInfo(user_id){
  
    const res = await this.http.get<any>(this.httpUrl + '/getuserinfo'+user_id).toPromise().then(res => {
      console.log(res)
      return res;

    });
    return res;

  }
  async updateProfile(obj){
    const resp = await this.http.put<any>(this.httpUrl + '/updateprofile', obj).toPromise().then(res => {
      console.log(res)
      return res;
     });
    return resp;
   }
}