import { NgModule } from '@angular/core';
import {
  NzAlertModule,
  NzCarouselModule,
  NzCollapseModule,
  NzDividerModule,
  NzDrawerModule,
  NzDropDownModule,
  NzGridModule,
  NzListModule,
  NzMenuModule,
  NzMessageModule,
  NzModalModule,
  NzPaginationModule,
  NzPopoverModule,
  NzProgressModule,
  NzSpinModule,
  NzTableModule,
  NzTabsModule,
  NzTagModule,
  NzTimePickerModule,
  NzToolTipModule,
  NzTypographyModule,
  NzUploadModule
} from 'ng-zorro-antd';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzI18nModule } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';

const modules = [
  // NzAffixModule,
  NzAlertModule,
  // NzAnchorModule,
  // NzAutocompleteModule,
  // NzAvatarModule,
  // NzBackTopModule,
  // NzBadgeModule,
  NzButtonModule,
  // NzBreadCrumbModule,
  // NzCalendarModule,
  NzCardModule,
  NzCarouselModule,
  // NzCascaderModule,
  NzCheckboxModule,
  NzCollapseModule,
  // NzCommentModule,
  NzDatePickerModule,
  // NzDescriptionsModule,
  NzDividerModule,
  NzDrawerModule,
  NzDropDownModule,
  // NzEmptyModule,
  NzFormModule,
  NzGridModule,
  NzI18nModule,
  NzIconModule,
  NzInputModule,
  NzInputNumberModule,
  // NzLayoutModule,
  NzListModule,
  // NzMentionModule,
  NzMenuModule,
  NzMessageModule,
  NzModalModule,
  // NzNoAnimationModule,
  NzNotificationModule,
  // NzModalService,
  // NzPageHeaderModule,
  // NzPaginationModule,
  // NzPopconfirmModule,
  NzPopoverModule,
  NzProgressModule,
  // NzRadioModule,
  // NzRateModule,
  // NzResultModule,
  NzSelectModule,
  // NzSkeletonModule,
  // NzSliderModule,
  NzSpinModule,
  // NzStatisticModule,
  // NzStepsModule,
  // NzSwitchModule,
  NzTableModule,
  NzPaginationModule,
  NzTabsModule,
  NzTagModule,
  NzTimePickerModule,
  // NzTimelineModule,
  NzToolTipModule,
  // tslint:disable-next-line: no-commented-code
  // NzTransButtonModule,
  // NzTransferModule,
  // NzTreeModule,
  // NzTreeSelectModule,
  NzTypographyModule,
  NzUploadModule
  // NzWaveModule,
  // NzResizableModule
];

@NgModule({
  imports: [...modules],
  exports: [...modules]
})
export class NgZorroAntdModule {}
