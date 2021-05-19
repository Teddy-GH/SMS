import { Component, Input, OnInit } from '@angular/core';
import { Community } from '@tps/models/community';
import { Domain } from '@tps/models/domain';
import { Survey } from '@tps/models/survey';

@Component({
  selector: 'tps-list-tab',
  templateUrl: './list-tab.component.html',
  styleUrls: ['./list-tab.component.scss']
})
export class ListTabComponent implements OnInit {
  @Input() domains: Domain[];

  @Input() communities: Community[];
  @Input() surveys: Survey[];
  @Input() loading: boolean;

  tab = 'tab1';

  ngOnInit(): void {}

  identity(index, item): number {
    return item.id;
  }
}
