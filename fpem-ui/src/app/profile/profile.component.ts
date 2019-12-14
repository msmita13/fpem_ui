import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import {MainService} from '../service/main.service';
import {ProfileService} from '../service/profile.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user_id;
  user_email;
  imgURL;
  fpemUser
  constructor( private router:Router,private profileService: ProfileService,  private sanitizer: DomSanitizer, private mainService: MainService) {}
  profile={acc_id: 0,
    acct_name: "NONE",
    address1: "UNKNOWN",
    address2: "UNKNOWN",
    country: "UNKNOWN",
    creation_date: "2019-09-24T05:53:03.000Z",
    designation: "UNKNOWN",
    email: "UNKNOWN",
    first_name: "Unknown",
    last_name: "Unknown",
    password: "",
    phone_no: 0,
    postal_code: "UNKNOWN",
    city:"UNKNOWN",
    state: "UNKNOWN",
    user_id: 0,
    work_email: "UNKNOWN",
    work_phone_no: "UNKNOWN",
    work_phone_no_country_cd:"+91",
    country_cd:"+91"
    }
  edit=0;
  city;
  async ngOnInit() {
    this.fpemUser=JSON.parse(localStorage.getItem('fpemUser'));
    //this.acct_id=this.fpemUser.acct_id;
//this.user_email= localStorage.getItem('email');
    this.user_id = this.fpemUser.user_id;
    this.imgURL = './assets/img/new_logo.png';

    const res = await this.profileService.getImage(this.user_id);
    if (res) {
      const unsafeImageUrl = window.URL.createObjectURL(res); // URL.createObjectURL(res);
      this.imgURL = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
      this.mainService.profileImageUrl=this.imgURL;
      
    }
    var resp= await this.profileService.getUserProfileInfo(this.user_id);
    if(resp['error']==false){
      console.log(resp.data[0])
      this.profile=resp.data[0];
    }else{

    }


  }
  editProfile(){
    this.router.navigate(['/editprofile'])
  }
  // saveProfile(){
  //   this.edit=0;

  // }

}



 
    
  