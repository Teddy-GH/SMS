import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCommunityComponent } from './pages/community-create/community-create.component';
import { CommunityDetailComponent } from './pages/community-detail/community-detail.component';
import { CommunityListViewPageComponent } from './pages/community-list-view-page/community-list-view-page.component';
import { CommunitySearchPageComponent } from './pages/community-search-page/community-search-Page.component';
import { CommunityUpdateComponent } from './pages/community-update/community-update.component';
import { MoreCommunitiesPageComponent } from './pages/more-communities-page/more-communities-page.component';

const routes: Routes = [
  { path: '', component: CreateCommunityComponent },
  { path: 'view/:id', component: CommunityDetailComponent },
  { path: 'search', component: CommunitySearchPageComponent },
  { path: 'edit/:id', component: CommunityUpdateComponent },
  { path: 'admin/view/:id', component: CommunityListViewPageComponent },
  { path: 'more', component: MoreCommunitiesPageComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityRoutingModule {}
