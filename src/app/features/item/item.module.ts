import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SharedModule } from '../../shared/shared.module';
import { ItemApiService } from './api/item.api.service';
import { ItemRoutingModule } from './item.routing';

import { ItemState } from './store/states/item.state';

@NgModule({
  declarations: [
    ItemFormComponent,


  ],

  imports: [
    NgxsModule.forFeature([ItemState]),
    FormsModule,
    CommonModule,
    ItemRoutingModule,
    NzDatePickerModule,
    NzDividerModule,
    NzDescriptionsModule,
    ImageCropperModule,
    SlickCarouselModule,
    SharedModule
  ],

  exports: [],
  providers: [ItemApiService, { provide: NZ_I18N, useValue: zh_CN }]
})
export class ItemModule {}
