import { Component, OnInit } from '@angular/core';
import { LoggerService } from '@tps/core/services/logger.service';

@Component({
  selector: 'tps-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {
  constructor(private readonly logger: LoggerService) {}

  ngOnInit(): void {}

  compareObject = (c1: any, c2: any) => (c1 && c2 ? c1.id === c2.id : c1 === c2);
}
