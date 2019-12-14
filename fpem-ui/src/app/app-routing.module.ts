import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { PlatformDataDefinitionComponent } from './platform-data-definition/platform-data-definition.component';
import { AuditComponent } from './platform-data-definition/audit/audit.component';
import { FieldsComponent } from './platform-data-definition/fields/fields.component';
import { IpComponent } from './platform-data-definition/ip/ip.component';
import { SalComponent } from './platform-data-definition/sal/sal.component';
import { JournalComponent } from './platform-data-definition/journal/journal.component';import {HelpComponent} from './help/help.component';
import { SourceComponent } from './source/source.component';
import { RegisterSourceComponent } from './source/register-source/register-source.component';
import { SourceFieldsComponent } from './source/source-fields/source-fields.component';
import { SourceEventsComponent } from './source/source-events/source-events.component';
import {EnvironmentSetupComponent} from './environment-setup/environment-setup.component';
import {ProfileComponent} from './profile/profile.component';
import {EventlayoutComponent} from './source/eventlayout/eventlayout.component';
import { RulesEngineComponent } from './rules-engine/rules-engine.component';
import { RulesComponent } from './rules-engine/rules/rules.component';
import { CreateRuleComponent } from './rules-engine/create-rule/create-rule.component';
import { ManageComponent } from './rules-engine/manage/manage.component';
import { RuleLookupComponent } from './rules-engine/rule-lookup/rule-lookup.component';
import { TestComponent } from './rules-engine/test/test.component';
import { ProcessingComponent } from './processing/processing.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { UserMgmtComponent } from './user-mgmt/user-mgmt.component';
import { UsersComponent } from './user-mgmt/users/users.component';
import { RolesComponent } from './user-mgmt/roles/roles.component';
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
import { SavedReportsComponent } from './financials/saved-reports/saved-reports.component';
import { CommonReportComponent } from './financials/common-report/common-report.component';
import {FinancialsComponent} from './financials/financials.component';
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

const routes: Routes = [{
  path: '', component: LayoutComponent, children: [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    {path: 'help', component: HelpComponent},
    {path: 'processing', component: ProcessingComponent},
    {path: 'account', component: AccountComponent},
    {path: 'adjustment', component: ManualAdjustmentsComponent, children: [

      {path: 'ipadjust', component: ManualIpComponent},
      {path: 'journaladjust', component: ManualJournalComponent},
      {path: 'saladjust', component: ManualSalComponent},
      {path: 'eventadjust', component: EventsComponent},
      {path: 'manual-upload', component: ManualUploadComponent}

    ]
  },

    {
      path:'controls', component: ControlsComponent, children: [
        {path: 'reject',component:RejectComponent},
        {path: 'activity-dashboard',component:ActivityDashboardComponent},
        {path: 'accounting-period',component:AccountingPeriodComponent},
        {path: 'periodend',component:PeriodEndComponent}
       
      ]
    },
    {
      path:'financials', component: FinancialsComponent, children: [
        {path: 'commonreports',component:CommonReportComponent},
        {path: 'savedreports',component:SavedReportsComponent},
        
       
      ]
    },
    {
      path:'referencedata', component: ReferenceDataComponent, children: [
        {path : 'accountsetup', component: AcountSetupComponent},
        {path : 'excsetup', component: ExchangeRateComponent},
        {path : 'orgsetup', component: OrganisationComponent},
        {path: 'define',component:DefineComponent},
        {path: 'insert',component:InsertComponent},
        {path: 'upload',component:ReferenceUploadComponent}
       
      ]
    },
    
    {
      path: 'usermgmt', component: UserMgmtComponent, children: [
        { path: 'users', component: UsersComponent },
        { path: 'roles', component: RolesComponent },
        { path: 'createrole', component: CreateRoleComponent }

      ]
    },
    {
      path: 'source', component: SourceComponent, children: [
        { path: 'registerSource', component: RegisterSourceComponent },
        { path: 'sourceFields', component: SourceFieldsComponent },
        { path: 'sourceEvents', component: SourceEventsComponent },
        {path: 'eventlayout', component: EventlayoutComponent}
      ]
    },
    {
      path:'platformdefinition', component: PlatformDataDefinitionComponent, children: [
        {path: 'fields',component:FieldsComponent},
        {path: 'ip',component:IpComponent},
        {path: 'sal',component:SalComponent},
        {path: 'audit',component:AuditComponent},
        {path: 'journal',component:JournalComponent}
      ]
    },
    {
      path:'rules', component: RulesEngineComponent, children: [
        {path: 'createrule',component:CreateRuleComponent},
        {path: 'testrule',component:TestComponent},
        {path: 'managerule',component:ManageComponent},
        {path: 'rulelist',component:RulesComponent},
        {path: 'rulelookup',component:RuleLookupComponent}
      ]
    },
    {path: 'profile', component: ProfileComponent},
    {path: 'editprofile', component: EditprofileComponent},
  ]
},
{path: 'env', component: EnvironmentSetupComponent},
{ path: 'signup', component: SignupComponent },
{ path: 'login', component: LoginComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
