import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { SourceComponent } from './source/source.component';
import { RegisterSourceComponent } from './source/register-source/register-source.component';
import { SourceFieldsComponent } from './source/source-fields/source-fields.component';
import { SourceEventsComponent } from './source/source-events/source-events.component';
import { HttpClientModule } from '@angular/common/http';
import { EnvironmentSetupComponent } from './environment-setup/environment-setup.component';
import { ToastrModule } from 'ng6-toastr-notifications';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatNativeDateModule} from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { FinancialsComponent } from './financials/financials.component';
import { SavedReportsComponent } from './financials/saved-reports/saved-reports.component';
import { ArrangementListingComponent } from './financials/arrangement-listing/arrangement-listing.component';
import { JournalListingComponent } from './financials/journal-listing/journal-listing.component';
import { CommonReportComponent } from './financials/common-report/common-report.component';
import { HelpComponent } from './help/help.component';
import { ProfileComponent } from './profile/profile.component';
import { EventlayoutComponent } from './source/eventlayout/eventlayout.component';
import { PlatformDataDefinitionComponent } from './platform-data-definition/platform-data-definition.component';
import { AuditComponent } from './platform-data-definition/audit/audit.component';
import { FieldsComponent } from './platform-data-definition/fields/fields.component';
import { IpComponent } from './platform-data-definition/ip/ip.component';
import { SalComponent } from './platform-data-definition/sal/sal.component';
import { JournalComponent } from './platform-data-definition/journal/journal.component';
import { RulesEngineComponent } from './rules-engine/rules-engine.component';
import { RulesComponent } from './rules-engine/rules/rules.component';
import { CreateRuleComponent } from './rules-engine/create-rule/create-rule.component';
import { ManageComponent } from './rules-engine/manage/manage.component';
import { RuleLookupComponent } from './rules-engine/rule-lookup/rule-lookup.component';
import { TestComponent } from './rules-engine/test/test.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { ProcessingComponent } from './processing/processing.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { EditprofileComponent } from './editprofile/editprofile.component';
import {FileUploadModule} from 'ng2-file-upload';
import { UserMgmtComponent } from './user-mgmt/user-mgmt.component';
import { UsersComponent } from './user-mgmt/users/users.component';
import { RolesComponent } from './user-mgmt/roles/roles.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AccountComponent } from './account/account.component';
import { ControlsComponent } from './controls/controls.component';
import { AccountingPeriodComponent } from './controls/accounting-period/accounting-period.component';
import { ActivityDashboardComponent } from './controls/activity-dashboard/activity-dashboard.component';
import { RejectComponent } from './controls/reject/reject.component';
import { CreateRoleComponent } from './user-mgmt/create-role/create-role.component';
import { ReferenceDataComponent } from './reference-data/reference-data.component';
import { DefineComponent } from './reference-data/define/define.component';
import { InsertComponent } from './reference-data/insert/insert.component';
import { ReferenceUploadComponent } from './reference-data/reference-upload/reference-upload.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ManualAdjustmentsComponent } from './manual-adjustments/manual-adjustments.component';
import { EventsComponent } from './manual-adjustments/events/events.component';
import { ManualIpComponent } from './manual-adjustments/manual-ip/manual-ip.component';
import { ManualJournalComponent } from './manual-adjustments/manual-journal/manual-journal.component';
import { ManualSalComponent } from './manual-adjustments/manual-sal/manual-sal.component';
import { ManualUploadComponent } from './manual-adjustments/manual-upload/manual-upload.component';
import { AcountSetupComponent } from './reference-data/acount-setup/acount-setup.component';
import { ExchangeRateComponent } from './reference-data/exchange-rate/exchange-rate.component';
import { OrganisationComponent } from './reference-data/organisation/organisation.component';
import { PeriodEndComponent } from './controls/period-end/period-end.component';
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    SourceComponent,
    RegisterSourceComponent,
    SourceFieldsComponent,
    SourceEventsComponent,
    EnvironmentSetupComponent,
    FinancialsComponent,
    SavedReportsComponent,
    ArrangementListingComponent,
    JournalListingComponent,
    CommonReportComponent,
    HelpComponent,
    ProfileComponent,
    EventlayoutComponent,
    PlatformDataDefinitionComponent,
    AuditComponent,
    FieldsComponent,
    IpComponent,
    SalComponent,
    JournalComponent,
    RulesEngineComponent,
    RulesComponent,
    CreateRuleComponent,
    ManageComponent,
    RuleLookupComponent,
    TestComponent,
    ProcessingComponent,
    EditprofileComponent,
    UserMgmtComponent,
    UsersComponent,
    RolesComponent,
    AccountComponent,
    ControlsComponent,
    AccountingPeriodComponent,
    ActivityDashboardComponent,
    RejectComponent,
    CreateRoleComponent,
    ReferenceDataComponent,
    DefineComponent,
    InsertComponent,
    ReferenceUploadComponent,
    ManualAdjustmentsComponent,
    EventsComponent,
    ManualIpComponent,
    ManualJournalComponent,
    ManualSalComponent,
    ManualUploadComponent,
    AcountSetupComponent,
    ExchangeRateComponent,
    OrganisationComponent,
    PeriodEndComponent
  ],
  imports: [
    ToastrModule.forRoot(),
    Ng2SearchPipeModule,
    MatCheckboxModule,
    FileUploadModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatToolbarModule,
    DragDropModule,
    NgbModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatSortModule,
    NgSelectModule,
    NgxSpinnerModule,
    BrowserModule,
    AppRoutingModule,FormsModule,Ng2SmartTableModule,HttpClientModule, BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
