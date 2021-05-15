import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AuthService } from '@tps/core/services/auth.service';
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
import { CommunityZipcode } from './../../../../models/community';
import { CreateCategory, GetCategories, GetCommunityImage, GetCommunityZipcode } from './../actions/community.action';

export interface CommunityStateModel {
  loading: boolean;
  zipCodes: CommunityZipcode;
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

@State<CommunityStateModel>({
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
export class CommunityState {
  currentCommunityId: number;
  constructor(
    private readonly communityApiService: CommunityApiService,
    private readonly notification: NzNotificationService,
    private readonly authService: AuthService
  ) {}

  @Selector()
  static loading(state: CommunityStateModel): any {
    return state.loading;
  }
  @Selector()
  static loadingSelectedCommunity(state: CommunityStateModel): any {
    return state.loadingSelectedCommunity;
  }

  @Selector()
  static zipcodes(state: CommunityStateModel): CommunityZipcode {
    return state.zipCodes;
  }

  @Selector()
  static images(state: CommunityStateModel): any {
    return state.images;
  }

  @Selector()
  static getCategoryList(state: CommunityStateModel): any {
    return state.categories;
  }

  @Selector()
  static getCommunityById(state: CommunityStateModel): any {
    return state.community;
  }

  @Selector()
  static getCommunitiesList(state: CommunityStateModel): Community[] {
    return state.communities;
  }
  @Selector()
  static getLocationBasedCommunities(state: CommunityStateModel): Community[] {
    return state.locationBasedCommunities;
  }
  @Selector()
  static getThematicBasedCommunities(state: CommunityStateModel): Community[] {
    return state.thematicBasedCommunities;
  }
  @Selector()
  static loadSurveys(state: CommunityStateModel): boolean {
    return state.loadSurveys;
  }

  @Selector()
  static totalSurvey(state: CommunityStateModel): number {
    return state.surveys ? state.surveys.length : 0;
  }

  @Selector()
  static chunkedSurvey(state: CommunityStateModel): Survey[][] {
    const chunkedState = state.surveys ? chunk(state.surveys, 3) : [];
    if (chunkedState.length > 0) {
      return chunkedState.slice(0, state.index + 1);
    }

    return [];
  }
  @Selector()
  static getSurveysList(state: CommunityStateModel): Survey[] {
    return state.surveys;
  }

  @Selector()
  static paginatedCommunitiesList(state: CommunityStateModel): any {
    return state.paginatedCommunities;
  }

  @Action(CreateCategory)
  addCategory({ patchState, dispatch }: StateContext<CommunityStateModel>, payload: CreateCategory): any {
    patchState({
      loading: true
    });

    return this.communityApiService.createCategory(payload.category).pipe(
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

  @Action(CreateCommunity)
  addCommunity({ patchState, dispatch }: StateContext<CommunityStateModel>, payload: CreateCommunity): any {
    patchState({
      loading: true
    });

    return this.communityApiService.createCommunity(payload.community).pipe(
      tap((data: Community) => {
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
  getCategories({ patchState }: StateContext<CommunityStateModel>): any {
    patchState({
      loading: true
    });

    return this.communityApiService.getAllCategories().pipe(
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

  @Action(GetCommunityZipcode)
  getCommunityZipcodes({ patchState }: StateContext<CommunityStateModel>): any {
    return this.communityApiService.getZipcode().pipe(tap((result: CommunityZipcode) => patchState({ zipCodes: result })));
  }

  @Action(GetCommunityImage)
  getCommunityImages({ patchState }: StateContext<CommunityStateModel>): any {
    return this.communityApiService.getAllImages().pipe(tap((result: string[]) => patchState({ images: result })));
  }

  @Action(GetCommunityById)
  getCommunityById({ patchState, dispatch }: StateContext<CommunityStateModel>, payload: GetCommunityById): any {
    patchState({
      loadingSelectedCommunity: true
    });

    return this.communityApiService.getCommunityById(payload.payload).pipe(
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
  @Action(GetLocationBasedCommunities)
  getLocationBasedCommunities({ patchState }: StateContext<CommunityStateModel>): any {
    patchState({
      loading: true
    });

    return this.communityApiService.getLocationBasedCommunities().pipe(
      tap((result: any[]) => {
        patchState({
          locationBasedCommunities: result,
          loading: false
        });
      }),
      catchError((error) => {
        of(patchState({ loading: false }));
        throw error;
      })
    );
  }

  @Action(GetThematicBasedCommunities)
  getThematicBasedCommunities({ patchState }: StateContext<CommunityStateModel>): any {
    patchState({
      loading: true
    });

    return this.communityApiService.getThematicBasedCommunities().pipe(
      tap((result: any[]) => {
        patchState({
          thematicBasedCommunities: result,
          loading: false
        });
      }),
      catchError((error) => {
        of(patchState({ loading: false }));
        throw error;
      })
    );
  }

  @Action(GetCommunities)
  getCommunities({ patchState }: StateContext<CommunityStateModel>): any {
    patchState({
      loading: true
    });

    return this.communityApiService.getAllCommunities().pipe(
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
  @Action(SaveSelectedCommunity)
  saveCommunity({ patchState, dispatch }: StateContext<CommunityStateModel>, payload: SaveSelectedCommunity): any {
    patchState({
      loading: true
    });

    return this.communityApiService.saveSelectedCommunity(payload.selectedCommunity).pipe(
      tap((data: ResponseJoinCommunity) => {
        patchState({ loading: false });
        const joinedCommunities = this.authService.currentUserValue.userProfile.communitiesIFollow;
        const index = findIndex(joinedCommunities, (community) => community.id === payload.selectedCommunity.id);
        if (index === -1) {
          joinedCommunities.push(payload.selectedCommunity);
          this.authService.addCommunitiesIFollow(joinedCommunities);
        }

        return data;
      }),
      catchError((selectedCommunityError) => {
        of(patchState({ loading: false }));

        throw selectedCommunityError;
      })
    );
  }

  @Action(CommunityUnJoin)
  communityUnJoin({ patchState, dispatch }: StateContext<CommunityStateModel>, payload: CommunityUnJoin): any {
    patchState({
      loading: true
    });

    return this.communityApiService.communityUnJoin(payload.selectedCommunity).pipe(
      tap((data: ResponseJoinCommunity) => {
        patchState({ loading: false });
        const joinedCommunities = this.authService.currentUserValue.userProfile.communitiesIFollow;
        const index = findIndex(joinedCommunities, (community) => community.id === payload.selectedCommunity.id);
        if (index !== -1) {
          joinedCommunities.splice(index, 1);
          this.authService.addCommunitiesIFollow(joinedCommunities);
        }

        return data;
      }),
      catchError((error) => {
        of(patchState({ loading: false }));
        throw error;
      })
    );
  }

  @Action(GetAllAttachedToCommunity)
  getSurveys({ patchState }: StateContext<CommunityStateModel>): any {
    patchState({
      loading: true
    });

    return this.communityApiService.getAllSurveys().pipe(
      tap((result: any[]) => {
        patchState({
          surveys: result,
          loading: false
        });
      }),
      catchError((error) => {
        of(patchState({ loading: false }));
        throw error;
      })
    );
  }

  @Action(UpdateCommunity)
  updateCommunity({ patchState }: StateContext<CommunityStateModel>, payload: UpdateCommunity): any {
    this.currentCommunityId = payload?.community?.id;
    patchState({
      loadingSelectedCommunity: true
    });

    return this.communityApiService.updateCommunity(payload.community).pipe(
      tap((data: Community) => {
        this.updateLocalStorageData(data);
        patchState({ loadingSelectedCommunity: false });

        return data;
      }),
      catchError((error) => {
        of(patchState({ loadingSelectedCommunity: false }));
        this.notification.create('error', 'Error', error.error, { nzPlacement: 'bottomLeft' });

        throw error;
      })
    );
  }

  @Action(GetCommunitySearchList)
  getCommunitySearch({ patchState }: StateContext<CommunityStateModel>, payload: GetCommunitySearchList): any {
    patchState({
      loading: true
    });

    return this.communityApiService.getCommunitySearchList(payload.payload).pipe(
      tap((result: HttpResponse<Community[]>) => {
        const paginatedCommunity = getPaginatedData<Community>(result);
        patchState({
          communities: result.body,
          loading: false,
          paginatedCommunities: paginatedCommunity
        });
      }),
      catchError((fetchCommunitiesError) => {
        of(patchState({ loading: false }));

        throw fetchCommunitiesError;
      })
    );
  }

  updateLocalStorageData(data: Community): void {
    let currentCommunities = this.authService.currentUserValue.userProfile.communitiesIFollow;
    const temp: Community[] = [];
    const index = 0;
    temp[index] = {};
    temp[0] = data;
    currentCommunities = currentCommunities.filter((item) => item.id !== this.currentCommunityId);
    currentCommunities.forEach((element) => {
      temp.push(element);
    });
    this.authService.addCommunitiesIFollow(temp);
  }
}
