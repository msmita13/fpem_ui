import { Component, OnInit } from '@angular/core';
import {Router,NavigationStart,NavigationEnd} from '@angular/router';
import { $ } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  title = '';
  constructor(private router:Router){}

  fpemUser;
  ngOnInit(){
    //help component icon
    //search left
    //Deployment -  Source Definition else all same
    //Data Definition - Platform Data Definition
    this.fpemUser=localStorage.getItem('fpemUser');
    if(this.fpemUser==undefined || this.fpemUser==null){
      this.router.navigate(['/login']);
    }else{
      this.fpemUser=JSON.parse(this.fpemUser);
      if(this.fpemUser.steps_completed<3){
        this.router.navigate(['/env']);
      }
    }

  }

}
