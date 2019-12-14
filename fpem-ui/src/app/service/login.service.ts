import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl;
  }
  async signUp(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/signup', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  async forgotPass(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/sendUserPassword', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }
  
  async getInd(){
    const res = await this.http.get<any>(this.httpUrl + '/getindustries').toPromise().then(res => {
      return res;
    });
    return res;
  }
  async signIn(obj){
    const resp = await this.http.post<any>(this.httpUrl + '/login', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async sendPass(obj){
    console.log(obj);
    const resp = await this.http.post<any>(this.httpUrl + '/senduserpassword', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}
