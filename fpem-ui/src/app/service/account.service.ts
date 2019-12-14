import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl + '/profile';
  }


  async getAccountInfo(acct_id){
    const res = await this.http.get<any>(this.httpUrl + '/getAccountInfo' + acct_id).toPromise().then(res => {
       return res;
     });
     return res;

  }
}
