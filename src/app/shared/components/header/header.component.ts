import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AutoLogoutService } from '@tps/core/services/autologout.service';
import { LoggerService } from '@tps/core/services/logger.service';
import jwt_decode from 'jwt-decode';
import { DecodedModel } from '../../../models/decoded-model';
import { AuthService } from './../../../core/services/auth.service';
import { AppRoles } from './../../../core/src/lib/models/roles';
import { Logout } from './../../../core/store/actions/auth.action';

@Component({
  selector: 'tps-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(
    private readonly logger: LoggerService,
    private readonly store: Store,
    private readonly router: Router,
    readonly authService: AuthService,
    private readonly autoLogoutService: AutoLogoutService,
    private readonly route: ActivatedRoute
  ) {}

  roleName = '';
  showPopover = false;
  appRoles = new AppRoles();
  decoded: DecodedModel;

  ngOnInit(): void {
    const token = this.authService.currentUserValue;
    this.decoded = jwt_decode(token?.accessToken);
    this.roleName = this.decoded?.primarygroupsid;

    // session expired checked
    localStorage.setItem('lastAction', Date.now().toString());

    this.autoLogoutService.itemValue.subscribe(() => {
      // read remember me flag from local storage
      const rememberMe = localStorage.getItem('rememberCurrentUser');
      if (rememberMe === 'false') {
        this.checkTokenDateExpire(token.expiration);
      }
    });
  }

  compareObject = (c1: any, c2: any) => (c1 && c2 ? c1.id === c2.id : c1 === c2);
  hidePopOver(): any {
    this.showPopover = false;
  }

  logOut(): void {
    this.store.dispatch(new Logout()).subscribe(() => this.router.navigateByUrl('/auth/login'));
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberCurrentUser');
    localStorage.removeItem('lastAction');
  }

  checkTokenDateExpire(tokenDate: Date): void {
    const pickUpDate = new Date();
    const tokenDates = new Date(tokenDate);
    if (tokenDates.getDate() === pickUpDate.getDate() && tokenDates.getMinutes() < pickUpDate.getMinutes()) {
      this.logOut();
    }
    if (tokenDates.getDate() < pickUpDate.getDate()) {
      this.logOut();
    }
  }
}
