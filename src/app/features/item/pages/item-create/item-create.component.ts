import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { NzNotificationService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { CreateCategory, CreateCommunity, GetCommunityZipcode } from '../../store/actions/community.action';
import { Category } from './../../../../models/category';
import { Community, CommunityZipcode } from './../../../../models/community';
import { GetCategories, GetCommunityImage } from './../../store/actions/community.action';
import { CommunityState } from './../../store/states/community.state';

@Component({
  selector: 'tps-community-create',
  templateUrl: './community-create.component.html',
  styleUrls: ['./community-create.component.scss']
})
export class CreateCommunityComponent implements OnInit {
  value = 1;
  constructor(private readonly store: Store, private readonly router: Router, private readonly notification: NzNotificationService) {}

  @Select(CommunityState.zipcodes) zipcode$: Observable<CommunityZipcode>;
  @Select(CommunityState.loading) loading$: Observable<boolean>;
  @Select(CommunityState.images) images$: Observable<string[]>;
  @Select(CommunityState.getCategoryList) categories$: Observable<Category[]>;

  @Input()
  ngOnInit(): void {
    this.store.dispatch(new GetCommunityZipcode());
    this.store.dispatch(new GetCommunityImage());
    this.store.dispatch(new GetCategories());
  }

  onFormSubmitted(community: Community): void {
    this.store.dispatch(new CreateCommunity(community)).subscribe(() => {
      this.notification.create('success', 'Success', 'Community Created Successfully!!', { nzPlacement: 'bottomLeft' });
      this.router.navigate(['/admin/lists'], { queryParams: { routeTo: this.value } }).catch((err) => 'Error');
    });
  }

  onCategoryAdded(category: string): void {
    this.store.dispatch(new CreateCategory(category));
  }
}
