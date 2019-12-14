import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FinancialsService } from '../../service/financials.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router'
import { NgxSpinnerService } from "ngx-spinner";
import { repeat } from 'rxjs/operators';
@Component({
  selector: 'app-saved-reports',
  templateUrl: './saved-reports.component.html',
  styleUrls: ['./saved-reports.component.css']
})
export class SavedReportsComponent implements OnInit {

  constructor(private toastr: ToastrManager, private financialService: FinancialsService, private spinner: NgxSpinnerService, private router: Router) { }

  data=[];
  dataSource;
  acct_id;
  fpemUser;

  displayedColumns: string[] = ['report_name', 'delete','check_report'];


  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;

  
  async ngOnInit() {
    this.fpemUser = JSON.parse(localStorage.getItem('fpemUser'));
    this.acct_id=this.fpemUser.acct_id;

    await this.getAllReports();
  }
  async getAllReports() {
    var resp = await this.financialService.getSavedReports(this.acct_id);
    console.log(resp)
    if(resp['error']==false){

      this.data=resp['data'];
      this.dataSource=new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
 
  }


  Open(i,element){
    this.financialService.flag=1;
    this.financialService.saved_repot=JSON.parse(element.report_specs);
    this.financialService.report_id=element.report_id;
    this.router.navigate(['/financials/commonreports']);

  }

  async delete(i,element){
    this.spinner.show();
    var resp = await this.financialService.deleteSavedReports(element.report_id);
    if(resp['error']==false){
      this.data.splice(i,1);
      this.dataSource=new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.spinner.hide();
      this.toastr.successToastr('Report Delete Successfully.', 'Success!');

    }
    else{
      this.spinner.hide();

      this.toastr.errorToastr('Somethings is Wrong.', 'Oops!');
    }


  }
  applyFilter(filterValue: string) {
    
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
