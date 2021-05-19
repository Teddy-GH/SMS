import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AddAlert } from './../../../core/src/lib/alert/store/actions/alert.action';
import { AlertState } from './../../../core/src/lib/alert/store/states/alert.state';

export enum messageType {
  info = 'info',
  success = 'success',
  warning = 'warning',
  error = 'error'
}

@Component({
  selector: 'tps-alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit {
  constructor(private readonly store: Store) {}

  @Select(AlertState.status) status$: Observable<boolean>;

  @Select(AlertState.message) text$: Observable<string>;

  @Select(AlertState.type) type$: Observable<string>;

  showToaster(message: string, time: number = 2, type: string = messageType.info): any {
    this.store.dispatch(new AddAlert({ message, time, type }));
  }

  ngOnInit(): any {}
}
