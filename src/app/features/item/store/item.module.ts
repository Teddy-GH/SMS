import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SharedModule } from '../../shared/shared.module';
import { CommunityApiService } from './apis/community.api.service';
import { CommunityRoutingModule } from './community.routing';
import { CommunityFormComponent } from './components/community-form/community-form.component';
import { CommunityListViewComponent } from './components/community-list-view/community-list-view.component';
import { CommunitySearchComponent } from './components/community-search/community-search.component';
import { MoreCommunitiesComponent } from './components/more-communities/more-communities.component';
import { ViewCommunityComponent } from './components/view-community/view-community.component';
import { CreateCommunityComponent } from './pages/community-create/community-create.component';
import { CommunityDetailComponent } from './pages/community-detail/community-detail.component';
import { CommunityListViewPageComponent } from './pages/community-list-view-page/community-list-view-page.component';
import { CommunitySearchPageComponent } from './pages/community-search-page/community-search-Page.component';
import { CommunityUpdateComponent } from './pages/community-update/community-update.component';
import { MoreCommunitiesPageComponent } from './pages/more-communities-page/more-communities-page.component';
import { CommunityState } from './store/states/community.state';

@NgModule({
  declarations: [
    CommunityFormComponent,
    ViewCommunityComponent,
    CreateCommunityComponent,
    MoreCommunitiesComponent,
    CommunitySearchComponent,
    CommunitySearchPageComponent,
    CommunityDetailComponent,
    CommunityUpdateComponent,
    CommunityListViewComponent,
    CommunityListViewPageComponent,
    MoreCommunitiesPageComponent
  ],

  imports: [
    NgxsModule.forFeature([CommunityState]),
    FormsModule,
    CommonModule,
    CommunityRoutingModule,
    NzDatePickerModule,
    NzDividerModule,
    NzDescriptionsModule,
    ImageCropperModule,
    SlickCarouselModule,
    SharedModule
  ],

  exports: [],
  providers: [CommunityApiService, { provide: NZ_I18N, useValue: zh_CN }]
})
export class CommunityModule {}
