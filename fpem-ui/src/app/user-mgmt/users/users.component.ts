import {UserService} from '../../service/user.service';
import { Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {Router} from '@angular/router'
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from "ngx-spinner";

import {ProfileService} from '../../service/profile.service';
import { DomSanitizer } from '@angular/platform-browser';
import {MainService} from '../../service/main.service';



declare var  $: any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email','phone','delete'];
  email;
  password;
  confirm_pass;
  users = [];
  dataSource;
  user_id;
  index;
  
  FirstName;
  LastName;
  User_Email;

  acct_id;
  fpemUser
  constructor(private userService: UserService, private spinner: NgxSpinnerService,public toastr: ToastrManager,private sanitizer: DomSanitizer,private mainService: MainService) { }
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  async ngOnInit() {
    this.fpemUser=JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id=this.fpemUser.acct_id;
    var resp= await this.userService.getUsers(this.acct_id);
    console.log(resp);
     if(resp['error']==false){
       this.users=resp.data;
       this.dataSource = new MatTableDataSource(this.users);
       this.dataSource.paginator = this.paginator;
   
      this.dataSource.sort = this.sort;
     }
   
  }

  

  async deleteUser(element,i){
    console.log(element)
  this.spinner.show();
     var resp=await this.userService.deleteUser(element.user_id);
     if(resp['error']==false){
       this.users.splice(i,1);
       this.dataSource=new MatTableDataSource(this.users);
     this.dataSource.paginator = this.paginator;
 
    this.dataSource.sort = this.sort;
       this.spinner.hide();
      this.toastr.successToastr('User Deleted Successfully.', 'Success!');

   }else{
       this.spinner.hide();
       this.toastr.successToastr('Process State changed Successfully.', 'Success!');

     }
  }

 

  
  applyFilter(filterValue: string) {
    
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  

}
