import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  httpUrl = 'http://34.93.84.140:3000';
   //httpUrl = 'http://103.97.185.146:8075';
   //httpUrl = 'http://192.168.43.197:3000';
  //httpUrl = 'http://192.168.0.4:3000';
  constructor() { }
  profileImageUrl;
  userprofileImageUrl;
}
