import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import {UserService} from '../../service/user.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ThrowStmt } from '@angular/compiler';
declare var  $: any;

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.css']
})
export class CreateRoleComponent implements OnInit {
  fpemUser;
  acct_id;
  allRoles=[];
  allComp;
  selectedComp=[];
  dataSource;
  role_name;
  role_id;
  displayedColumns: string[] = ['role_name','update','delete'];
  constructor(private userService: UserService, private spinner: NgxSpinnerService,private toastr: ToastrManager) { }
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  async ngOnInit() {
    $("#updateRole").draggable({
      handle: ".modal-dialog "
    });
    $("#createRole").draggable({
      handle: ".modal-dialog "
    });
    this.fpemUser=JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id=this.fpemUser.acct_id;
    await this.getAllRoles(this.acct_id);
    await this.getAllComponents();
  }
  async getAllComponents(){
    var resp=await this.userService.getAllInterfaces();
    if(resp['error']==false){
      this.allComp=resp.data;
    }
  }
  async getAllRoles(acct_id){
    var resp=await this.userService.getAllRoles(acct_id);
    if(resp['error']==false){
      this.allRoles=resp.data;
      this.dataSource=new MatTableDataSource(this.allRoles);
      this.dataSource.paginator = this.paginator;
   
       this.dataSource.sort = this.sort;
    }
  }
  applyFilter(filterValue: string) {
    
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  clickUpdate(element,j){
    var ids=element.interface_id.split(',');
    var newIds=[];
    for(var i=0;i<ids.length;i++){
      newIds.push(parseInt(ids[i]));
    }
    this.selectedComp=newIds;
    this.role_name=element.role_name;
    this.role_id=element.role_id;

  }
  async addNewRole(){
    this.spinner.show();
    var obj=new Object();
    obj['acct_id']=this.acct_id;
    obj['interface_id']=this.selectedComp;
    obj['role_name']=this.role_name;
    var resp= await this.userService.addNewRole(obj);
    if(resp['error']==false){
      await this.getAllRoles(this.acct_id);
      this.spinner.hide();
      this.toastr.successToastr('Added Successfully','Success!');
    }else{
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'],'Oops!');
    }
  }
  async deleteRole(element,i){
    var resp= await this.userService.deleteCreatedRole(element.role_id);
    if(resp['error']==false){
      this.allRoles.splice(i,1);
      this.dataSource=new MatTableDataSource(this.allRoles);
      this.dataSource.paginator = this.paginator;
   
       this.dataSource.sort = this.sort;
      this.spinner.hide();
      this.toastr.successToastr('Deleted Successfully','Success!');
    }else{
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'],'Oops!');
    }

  }
  async updateRole(){
    this.spinner.show();
    var obj=new Object();
    obj['role_id']=this.role_id;
    obj['interface_id']=this.selectedComp;
    obj['role_name']=this.role_name;
    var resp= await this.userService.updateRole(obj);
    if(resp['error']==false){
      await this.getAllRoles(this.acct_id);
      this.spinner.hide();
      this.toastr.successToastr('Updated Successfully','Success!');
    }else{
      this.spinner.hide();
      this.toastr.errorToastr(resp['data'],'Oops!');
    }
  }

}
