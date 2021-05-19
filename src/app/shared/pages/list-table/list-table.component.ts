import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { DomainState } from '@tps/features/domain/store/states/domain.state';
import { Community } from '@tps/models/community';
import { Survey } from '@tps/models/survey';
import { Observable } from 'rxjs';

@Component({
  selector: 'tps-list-table',
  templateUrl: './list-table.component.html',
  styleUrls: ['./list-table.component.scss']
})
export class ListTableComponent implements OnInit {
  @Select(DomainState.getCommunitiesList) communities$: Observable<Community[]>;
  @Select(DomainState.getSurveysList) surveys$: Observable<Survey[]>;
  @Select(DomainState.loading) loading$: Observable<boolean>;

  constructor(private readonly store: Store) {}

  ngOnInit(): any {}
}
