import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgPipesModule } from 'ngx-pipes';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { ListTabComponent } from './components/list-tab/list-tab.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { SummaryFooterComponent } from './components/summary-footer/summary-footer.component';
import { NgZorroAntdModule } from './ng-zorro-antd.module';
import { ListTableComponent } from './pages/list-table/list-table.component';

const declaration = [HeaderComponent, LeftSidebarComponent, RightSidebarComponent, FooterComponent, SummaryFooterComponent];
const modules = [
  CommonModule,
  FormsModule,
  RouterModule,
  ReactiveFormsModule,
  NgPipesModule,
  RxReactiveFormsModule,
  NgZorroAntdModule,
  NgxPermissionsModule,
  PasswordStrengthMeterModule
];
const routes: Routes = [{ path: 'Lists', component: ListTableComponent }];
@NgModule({
  declarations: [...declaration, ListTabComponent, ListTableComponent],
  imports: [...modules, RouterModule.forChild(routes)],
  exports: [...modules, ...declaration, RouterModule],
  providers: []
})
export class SharedModule {}
