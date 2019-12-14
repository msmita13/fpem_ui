import { Injectable } from '@angular/core';

import { HttpClient, HttpEventType } from '@angular/common/http';
import { MainService } from './main.service';
@Injectable({
  providedIn: 'root'
})


export class SourceService {
  httpUrl;
  constructor(private http: HttpClient, private main: MainService) {
    // console.log(this.main.httpUrl);

    // this.httpUrl = this.main.httpUrl + '/source';
    this.httpUrl = this.main.httpUrl + '/source';


  }
  async getSources(acct_id) {
    const res = await this.http.get<any>(this.httpUrl + '/getsources' + acct_id).toPromise().then(res => {

      return res;
    });
    return res;
  }

  async addSource(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/createsource', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }

  async createSource(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/updateSource', obj).toPromise().then(res => {
      return res;
    });
    return resp;

  }

  async deleteSource(id) {
    const resp = await this.http.delete<any>(this.httpUrl + '/deletesource' + id).toPromise().then(res => {
      return res;
    });
    return resp;
  }


  async getSourceFields(acct_id) {
    console.log(this.httpUrl);
    const res = await this.http.get<any>(this.httpUrl + '/fields/getSourceFields' + acct_id).toPromise().then(res => {

      return res;
    });
    return res;
  }

  async getEventLayouts(acct_id) {
    console.log(this.httpUrl);
    const res = await this.http.get<any>(this.httpUrl + '/eventlayout/geteventlayouts' + acct_id).toPromise().then(res => {

      return res;
    });
    return res;
  }

  async addSourcefield(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/fields/createsourcefield', obj).toPromise().then(res => {
      return res;

    })
    return res
  }
  async getEventFields(id) {
    const res = await this.http.get<any>(this.httpUrl + '/eventlayout/geteventlayoutFields' + id).toPromise().then(res => {

      return res;
    });
    return res;
  }
  async getEvents(acct_id) {
    const res = await this.http.get<any>(this.httpUrl + '/event/getevents' + acct_id).toPromise().then(res => {

      return res;
    });
    return res;
  }
  async addEventLayout(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/eventlayout/createeventlayout', obj).toPromise().then(res => {
      return res;

    })
    return res
  }
  async addEvent(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/event/createevent', obj).toPromise().then(res => {
      return res;

    })
    return res
  }
  async deleteLayout(obj) {
    const res = await this.http.post<any>(this.httpUrl + '/eventlayout/deleteeventlayout', obj).toPromise().then(res => {
      return res;

    })
    return res
  }
  async createSourcefield(obj) {
    console.log(obj);
    const resp = await this.http.put<any>(this.httpUrl + '/fields/updateSourcefield', obj).toPromise().then(res => {
      console.log(res)
      return res;
    });
    return resp;
  }


  async deleteSourcefield(id) {
    const resp = await this.http.delete<any>(this.httpUrl + '/fields/deletefield' + id).toPromise().then(res => {
      console.log(res)
      return res;
    });
    return resp;
  }
  async deleteEvent(id) {
    const resp = await this.http.delete<any>(this.httpUrl + '/event/deleteEvent' + id).toPromise().then(res => {
      console.log(res)
      return res;
    });
    return resp;
  }
  async updateEvent(obj) {
    const resp = await this.http.put<any>(this.httpUrl + '/event/updateEvent', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
  async updateEventLayout(obj){
    const resp = await this.http.post<any>(this.httpUrl + '/eventlayout/updateEventlayout', obj).toPromise().then(res => {
      return res;
    });
    return resp;
  }
}