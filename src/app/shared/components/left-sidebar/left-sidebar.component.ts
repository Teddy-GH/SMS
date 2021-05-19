import { Component, OnInit } from '@angular/core';
import { LoggerService } from '@tps/core/services/logger.service';
import { SignalRService } from '@tps/core/services/signal-r.services';
import { AuthService } from './../../../core/services/auth.service';
import { AppRoles } from './../../../core/src/lib/models/roles';
@Component({
  selector: 'tps-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {
  notifyIcon: boolean;
  constructor(private readonly logger: LoggerService, readonly authService: AuthService, private readonly signalRService: SignalRService) {}

  appRoles = new AppRoles();
  newSessionExists = true;

  ngOnInit(): void {
    this.signalRService.getValue().subscribe((value) => {
      this.notifyIcon = value;
    });
  }

  compareObject = (c1: any, c2: any) => (c1 && c2 ? c1.id === c2.id : c1 === c2);

  setSessionStatus(value: boolean): any {
    this.signalRService.setValue(false);
  }
}
