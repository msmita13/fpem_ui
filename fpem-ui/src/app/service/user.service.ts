import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {MainService} from './main.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpUrl;
  httpUrl1
  constructor(private http: HttpClient, private main: MainService) {
    this.httpUrl = this.main.httpUrl+'/usermanagement';
    // this.httpUrl1 = this.main.httpUrl+'/profile';
    
  }
  async deleteCreatedRole(role_id){
    const resp = await this.http.delete<any>(this.httpUrl + '/deleteRole'+role_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }
async updateRole(obj){
  const resp = await this.http.post<any>(this.httpUrl + '/updaterole',obj).toPromise().then(res => {
    return res;
  });
  return resp;
}
async addNewRole(obj){
  const resp = await this.http.post<any>(this.httpUrl + '/addnewrole',obj).toPromise().then(res => {
    return res;
  });
  return resp;
}
 async getAllRoles(acct_id){
  const resp = await this.http.get<any>(this.httpUrl + '/getAllRoles'+acct_id).toPromise().then(res => {
    return res;
  });
  return resp;
 }
 async getAllInterfaces(){
  const resp = await this.http.get<any>(this.httpUrl + '/getSystemInterfaces').toPromise().then(res => {
    return res;
  });
  return resp;
 }
  async getUsers(acct_id){
    const resp = await this.http.get<any>(this.httpUrl + '/getallusers'+acct_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }
   async getRoles(acct_id){
  const resp = await this.http.get<any>(this.httpUrl + '/getAllRoles'+acct_id).toPromise().then(res => {
      return res;
     });
     return resp;
   }
  
   async getUsersRoles(acct_id){
    const res = await this.http.get<any>(this.httpUrl + '/getalluserrole'+acct_id).toPromise().then(res => {
       return res;
    });
     return res;
 }
  async deleteUser(user_id){
    const resp = await this.http.delete<any>(this.httpUrl + '/deleteuser'+user_id).toPromise().then(res => {
      return res;
    });
    return resp;
  }
 
  async deleteRole(obj){
    const resp = await this.http.post<any>(this.httpUrl + '/deleteRoleofuser',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async assignRole(obj){

    const resp = await this.http.post<any>(this.httpUrl + '/assignrole',obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updateUserRole(obj){
    const resp = await this.http.post<any>(this.httpUrl + '/updateuserRole', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}