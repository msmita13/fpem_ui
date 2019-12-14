

import { Component, OnInit } from '@angular/core';
import {ProfileService} from '../../service/profile.service';
import { DomSanitizer } from '@angular/platform-browser';
import {MainService} from '../../service/main.service';
import {Router} from '@angular/router';

declare var $
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  fpemUser
  user_id
  imgURL
  constructor(private router : Router,public mainService: MainService,private profileService: ProfileService, private sanitizer: DomSanitizer) { }
  searchText;

  options = [
    { id: 2, name: 'Manual Event' , route: '/adjustment/eventadjust'},
    { id: 3, name: 'Rules' , route: '/rules/createrule'},
    { id: 4, name: 'Reference Data' , route: '/referencedata/insert' },
    { id: 4, name: 'User Management' , route: '/usermgmt/users' },
    { id: 4, name: 'PPD' , route: '/controls/accounting-period' },
    { id: 4, name: 'Activity' , route: '/controls/activity-dashboard' },
    
  ];
 async ngOnInit() {
  $(document).ready(function () {
    
  });

this.fpemUser=JSON.parse(localStorage.getItem('fpemUser'));

this.user_id = this.fpemUser.user_id;
this.imgURL = './assets/img/new_logo.png';

const res = await this.profileService.getImage(this.user_id);
if (res) {
  const unsafeImageUrl = window.URL.createObjectURL(res);
  this.imgURL = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
  this.mainService.profileImageUrl=this.imgURL;
}
  }


}


