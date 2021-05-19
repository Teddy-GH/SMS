import { ItemApiService } from './../../api/item.api.service';
import { CreateItem, GetItems } from './../actions/item.action';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AuthService } from '@tps/core/services/auth.service';
import { Item } from '@tps/models/item';
import { Paginated } from '@tps/models/pagination';
import { ResponseJoinCommunity } from '@tps/models/response-join-community';
import { Survey } from '@tps/models/survey';
import { chunk, findIndex } from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { getPaginatedData } from 'src/app/helpers/pagination.helper';
import { Community } from '../../../../models/community';
import { CommunityApiService } from '../../apis/community.api.service';
import {
  CommunityUnJoin,
  CreateCommunity,
  GetAllAttachedToCommunity,
  GetCommunities,
  GetCommunityById,
  GetCommunitySearchList,
  GetLocationBasedCommunities,
  GetThematicBasedCommunities,
  SaveSelectedCommunity,
  UpdateCommunity
} from '../actions/community.action';
import { Category } from './../../../../models/category';
import { CreateCategory, GetCategories, GetCommunityImage, GetCommunityZipcode } from './../actions/community.action';

export interface ItemStateModel {
  loading: boolean;
  images: string[];
  categories: Category[];
  community: Community;
  communities: Community[];
  paginatedCommunities: Paginated<Community>;
  locationBasedCommunities: Community[];
  thematicBasedCommunities: Community[];
  surveys: Survey[];
  index: number;
  loadSurveys: boolean;
  loadingSelectedCommunity: boolean;
}

@State<ItemStateModel>({
  name: 'CommunityState',
  defaults: {
    index: 0,
    loading: false,
    zipCodes: undefined,
    images: undefined,
    categories: undefined,
    community: undefined,
    communities: undefined,
    paginatedCommunities: undefined,
    locationBasedCommunities: undefined,
    thematicBasedCommunities: undefined,
    surveys: undefined,
    loadSurveys: false,
    loadingSelectedCommunity: false
  }
})
@Injectable()
export class ItemState {
  currentCommunityId: number;
  constructor(
    private readonly itemApiService: ItemApiService,
    private readonly notification: NzNotificationService,
    private readonly authService: AuthService
  ) {}

  @Selector()
  static loading(state: ItemStateModel): any {
    return state.loading;
  }
  @Selector()
  static loadingSelectedCommunity(state: ItemStateModel): any {
    return state.loadingSelectedCommunity;
  }
  @Selector()
  static getCategoryList(state: ItemStateModel): any {
    return state.categories;
  }

  @Selector()
  static getCommunityById(state: ItemStateModel): any {
    return state.community;
  }

  @Selector()
  static getCommunitiesList(state: ItemStateModel): Item[] {
    return state.communities;
  }

  @Selector()
  static paginatedCommunitiesList(state: ItemStateModel): any {
    return state.paginatedCommunities;
  }

  @Action(CreateCategory)
  addCategory({ patchState, dispatch }: StateContext<ItemStateModel>, payload: CreateCategory): any {
    patchState({
      loading: true
    });

    return this.itemApiService.createCategory(payload.category).pipe(
      tap((data: Category) => {
        patchState({ loading: false });
        dispatch(new GetCategories());
        this.notification.create('success', 'Success', 'Category Added Successfully!!', { nzPlacement: 'bottomLeft' });

        return data;
      }),
      catchError((error) => {
        of(patchState({ loading: false }));

        throw error;
      })
    );
  }

  @Action(CreateItem)
  addCommunity({ patchState, dispatch }: StateContext<ItemStateModel>, payload: CreateItem): any {
    patchState({
      loading: true
    });

    return this.itemApiService.createItem(payload.item).pipe(
      tap((data: Item) => {
        patchState({ loading: false });

        return data;
      }),
      catchError((error) => {
        of(patchState({ loading: false }));
        this.notification.create('error', 'Error', error.error, { nzPlacement: 'bottomLeft' });

        throw error;
      })
    );
  }

  @Action(GetCategories)
  getCategories({ patchState }: StateContext<ItemStateModel>): any {
    patchState({
      loading: true
    });

    return this.itemApiService.getAllCategories().pipe(
      tap((result: Category[]) => {
        patchState({
          categories: result,
          loading: false
        });
      }),
      catchError((categoriesError) => {
        of(patchState({ loading: false }));

        throw categoriesError;
      })
    );
  }



  @Action(GetCommunityById)
  getCommunityById({ patchState, dispatch }: StateContext<ItemStateModel>, payload: GetCommunityById): any {
    patchState({
      loadingSelectedCommunity: true
    });

    return this.itemApiService.getCommunityById(payload.payload).pipe(
      tap((data: Community) => {
        patchState({
          community: data,
          loadingSelectedCommunity: false
        });

        return data;
      }),
      catchError((error) => {
        of(patchState({ loadingSelectedCommunity: false }));

        throw error;
      })
    );
  }

  @Action(GetItems)
  getItems({ patchState }: StateContext<ItemStateModel>): any {
    patchState({
      loading: true
    });

    return this.itemApiService.getAllCommunities().pipe(
      tap((result: any[]) => {
        const a = result;
        patchState({
          communities: a,
          loading: false
        });
      }),
      catchError((error) => {
        of(patchState({ loading: false }));
        throw error;
      })
    );
  }






}
