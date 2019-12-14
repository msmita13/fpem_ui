import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import { UserService } from '../../service/user.service';
import { NgxSpinnerService } from "ngx-spinner";
declare var $: any;

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  dataSource;
  roles = [];
  userRoles = [];
  users = [];
  role;
  user;
  elem;
  role_id;
  displayedColumns: string[] = ['name', 'email', 'role', 'update', 'delete'];
  fpemUser;
  acct_id;
  roleid = [];
  flag = 0;
  user_role_id
  element_user_id: any;
  constructor(private userService: UserService, private spinner: NgxSpinnerService, private toastr: ToastrManager) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  async ngOnInit() {
    $("#userModal").draggable({
      handle: ".modal-dialog "
    });
    $("#userUpdateModal").draggable({
      handle: ".modal-dialog "
    });

    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id = this.fpemUser.acct_id;
    await this.getRoles(this.acct_id);
    await this.getUsersRoles(this.acct_id);
    await this.getAllUsers(this.acct_id);
  }

  async getUsersRoles(acct_id) {


    var resp = await this.userService.getUsersRoles(acct_id);
    if (resp['error'] == false) {
      this.userRoles = resp.data;
      console.log(this.userRoles)
      this.dataSource = new MatTableDataSource(this.userRoles);
      this.dataSource.paginator = this.paginator;

      this.dataSource.sort = this.sort;
    }
  }
  async getRoles(acct_id) {
    var resp = await this.userService.getRoles(acct_id);
    if (resp['error'] == false) {
      this.roles = resp.data;
    }
  }
  async getAllUsers(acct_id) {
    var resp = await this.userService.getUsers(acct_id);
    if (resp['error'] == false) {
      this.users = resp.data;
      console.log(this.users)
    } else {

    }
  }

  async openUpdateRole(element, i) {
    this.elem = element;
    this.element_user_id = this.elem.user_id

    //  $('#userUpdateModal').modal('show');
  }
  async updateUserRole() {

    var obj = new Object();
    obj['role_id'] = this.roleid;
    obj['user_id'] = this.element_user_id;
    var resp = await this.userService.updateUserRole(obj);
    if (resp['error'] == false) {
      $('#userUpdateModal').modal('hide');
      await this.getUsersRoles(this.acct_id);
      this.spinner.hide();
      this.toastr.successToastr('Role Successfully assign to user')
    } else {
      $('#userUpdateModal').modal('hide');
      this.spinner.hide();
      this.toastr.errorToastr('Some error occured')
    }



  }

  async deleteUserRole(element, i) {
    this.spinner.show();
    var obj = new Object();

    obj['user_id'] = element.user_id;
    var resp = await this.userService.deleteRole(obj);
    if (resp['error'] == false) {

      this.userRoles.splice(i, 1);
      this.dataSource = new MatTableDataSource(this.userRoles);
      this.dataSource.paginator = this.paginator;

      this.dataSource.sort = this.sort;
      this.spinner.hide();
      this.toastr.successToastr('Role Successfully Delete')

    } else {

      this.spinner.hide();
      this.toastr.errorToastr('Some error occured')
    }
  }
  applyFilter(filterValue: string) {

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  changeRole(event) {
    this.roleid = []
    for (var i = 0; i < event.length; i++) {
      this.roleid.push(event[i].role_id)
    }

    if (event == undefined || event == '') {
      return;
    }

  }
  changeUser(event) {
    this.element_user_id = event.user_id

    if (event == undefined || event == '') {
      return;
    }
  }

  async addUserRole() {
    this.spinner.show();

    for (var i = 0; i < this.userRoles.length; i++) {
      if (this.element_user_id == this.userRoles[i].user_id) {
        this.user_role_id = this.userRoles[i].role_id.split(',')
      }

    }
    for (var j = 0; j < this.roleid.length; j++) {
      for (var k = 0; k < this.user_role_id.length; k++) {
        if (this.roleid[j] == this.user_role_id[k]) {
          this.flag = 1;

          this.roleid.splice(j, 1);


        } else {
          this.flag = 0

        }

      }
    }
    if (this.flag == 1) {
      this.toastr.warningToastr('Role already assign to user')

    } else if (this.flag == 0) {
      var obj = new Object();
      obj['role_id'] = this.roleid;
      obj['user_id'] = this.user.user_id;
      var resp = await this.userService.assignRole(obj);
      if (resp['error'] == false) {
        $('#userModal').modal('hide');
        await this.getUsersRoles(this.acct_id);
        this.spinner.hide();
        this.toastr.successToastr('Role Successfully assign to user')


      } else {
        $('#userModal').modal('hide');
        this.spinner.hide();
        this.toastr.errorToastr('Some error occured')
      }
    }


  }
}
