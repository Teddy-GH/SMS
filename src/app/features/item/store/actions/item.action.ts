import { QueryParams } from '@tps/models/pagination-params';
import { Community } from '../../../../models/community';

export class CreateCategory {
  static readonly type = '[CommunityState] CreateCategory';
  constructor(readonly category: string) {}
}

export class CreateCommunity {
  static readonly type = '[CommunityState] CreateCommunity';
  constructor(readonly community: Community) {}
}

export class GetCategories {
  static readonly type = '[CommunityState] GetCategories';
  constructor(readonly payload?: any) {}
}
export class GetCommunityZipcode {
  static readonly type = '[CommunityState] GetCommunityZipcode';
  constructor(public payload?: any) {}
}
export class GetCommunities {
  static readonly type = '[CommunityState] GetCommunities';
  constructor(public payload?: any) {}
}
export class GetLocationBasedCommunities {
  static readonly type = '[CommunityState] GetLocationBasedCommunities';
  constructor(public payload?: any) {}
}
export class GetThematicBasedCommunities {
  static readonly type = '[CommunityState] GetThematicBasedCommunities';
  constructor(public payload?: any) {}
}
export class GetCommunityImage {
  static readonly type = '[CommunityState] GetCommunityImage';
  constructor(public payload?: any) {}
}

export class GetCommunityById {
  static readonly type = '[CommunityState] GetCommunityById';
  constructor(readonly payload?: any) {}
}
export class SaveSelectedCommunity {
  static readonly type = '[CommunityState] SaveSelectedCommunity';
  constructor(readonly selectedCommunity: Community) {}
}
export class CommunityUnJoin {
  static readonly type = '[CommunitySearchState] CommunityUnJoin';
  constructor(readonly selectedCommunity: Community) {}
}
export class GetAllAttachedToCommunity {
  static readonly type = '[CommunityState] GetAllAttachedToCommunity';
  constructor(public payload?: any) {}
}
export class UpdateCommunity {
  static readonly type = '[CommunityState] UpdateCommunity';
  constructor(public community: Community) {}
}

export class GetCommunitySearchList {
  static readonly type = '[CommunityState] GetCommunitySearchList';
  constructor(readonly payload: QueryParams) {}
}
