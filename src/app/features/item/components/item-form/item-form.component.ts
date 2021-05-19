import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '@tps/core/services/auth.service';
import { AppRoles } from '@tps/core/src/lib/models/roles';
import { findIndex } from 'lodash-es';
import { NzDateMode, NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { ImageTransform } from 'ngx-image-cropper';
import { Subject } from 'rxjs';
import { Item } from '../../../../models/item';
import { environment } from './../../../../../environments/environment';
import { Category } from './../../../../models/category';
import { Community } from './../../../../models/community';

@Component({
  selector: 'sms-item-form',
  templateUrl: './sms-item.component.html',
  styleUrls: ['./sms-item.component.scss']
})
export class ItemFormComponent implements OnInit, OnDestroy, OnChanges {
 itemForm: FormGroup;

  listOfCategories = new Set<Category>();
  apiUrl: string;
  confirmModal?: NzModalRef;
  commType = '1';
  tabIndex = 1;
  uploading = false;
  uploadedImageUrl: string;
  imageSrc = environment.urls.pics;
  categoryForm: FormGroup;
  addCategoryForm: FormGroup;
  isListFull = false;
  customCategoryName: string;
  appRoles = new AppRoles();
  updatedCommunity: Community;
  images = true;
  tabs = [
    {
      active: true,
      name: 'Uploaded Image',
      disabled: false
    },
    {
      active: true,
      name: 'Upload Image',
      disabled: false
    }
  ];
  selectedZipcode;
  isUploadVisible = false;
  isConfirmVisible = false;
  hasImage = false;



  checkedCategory: { [category: number]: boolean };

  @ViewChild('file') file;

  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  fileToUpload: File;
  isVisibleMiddle = false;
  tempImageUrl: any;
  imageVal: string;

  private readonly destroy$ = new Subject<any>();

  @Output() readonly OnSubmit: EventEmitter<Community> = new EventEmitter();
  @Output() readonly OnCategoryAdded: EventEmitter<Category> = new EventEmitter();

  @Input() item: Item;
  @Input() loading: boolean;


  dateMode: NzDateMode = 'time';
  plainFooter = 'plain extra footer';
  footerRender = () => ' ';

  constructor(
    private readonly fb: FormBuilder,
    private readonly modal: NzModalService,
    private readonly notification: NzNotificationService,
    readonly authService: AuthService
  ) {
    this.resetCommunityForm();
  }

  addNewCategory(): void {
    this.isVisibleMiddle = true;
  }

  handleCancelAddCategory(): void {
    this.isVisibleMiddle = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  confirmationValidator = (control: FormControl): { [s: string]: boolean } => this.confirmationValidatorValue(control);

  confirmationValidatorValue(control: FormControl): { [s: string]: boolean } {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.itemForm.controls.password.value) {
      return { confirm: true, error: true };
    }

    return {};
  }

  submitForm(): void {
    Object.keys(this.itemForm.controls).forEach((key) => {
      this.markControlAsDirty(this.itemForm.get(key));
    });
    if (this.itemForm.valid) {
      this.itemForm.patchValue({ image: this.fileToUpload });
      const item = this.itemForm.value;
      this.OnSubmit.emit({
        zipCode: community.zipcode,
        type: community.type,
        city: community.city,
        description: community.description,
        image: community.image,
        imageUrl: community.imageUrl,
        name: community.name,
        categories: Array.from(this.listOfCategories),
        more: 0
      });
    }
  }

  markControlAsDirty(control: AbstractControl): void {
    control.markAsDirty();
    control.updateValueAndValidity();
  }

  ngOnInit(): void {
  }

//





  onClose(value: Category): void {
    this.listOfCategories.delete(value);
    this.checkedCategory[value.id] = false;
    this.isListFull = false;
  }

  onCategorySelected(item: Category): any {
    const index = findIndex(Array.from(this.listOfCategories), (category) => item.id === category.id);
    if (index !== -1) {
      this.onClose(item);
    } else {
      if (item !== undefined && item !== null && this.listOfCategories.size < 3) {
        this.listOfCategories.add(item);
        this.checkedCategory[item.id] = !this.checkedCategory[item.id];

        if (this.listOfCategories.size === 3) {
          this.isListFull = true;
        }
      } else if (item === null || item === undefined) {
        this.notification.create('error', 'Error', 'At least one category is required!!', { nzPlacement: 'bottomLeft' });
      }
    }
  }

  stackFull(): any {
    if (this.listOfCategories.size >= 3 && this.isListFull) {
      return this.notification.create(
        'warning',
        'Warning',
        'You have reached the maximum number of categories (3) that can be selected!!',
        {
          nzPlacement: 'bottomLeft'
        }
      );
    }
  }

  submitCategory(): void {
    Object.keys(this.addCategoryForm.controls).forEach((key) => {
      this.markControlAsDirty(this.addCategoryForm.get(key));
    });
    if (this.addCategoryForm.valid) {
      let tempCategoryName = this.addCategoryForm.get('name').value;
      tempCategoryName = tempCategoryName.trim();
      tempCategoryName = tempCategoryName
        .split(' ')
        .map((w) => `${w[0]?.toUpperCase()}` + `${w?.substr(1)?.toLowerCase()}`)
        .join(' ');
      const found = this.categoryList.filter((e) => e.name?.toLowerCase() === tempCategoryName?.toLowerCase());

      if (found.length === 0) {
        this.addCategoryForm.patchValue({ name: tempCategoryName });
        const category = this.addCategoryForm.value;
        this.OnCategoryAdded.emit({
          name: category.name
        });

        this.clearCategoryForm();
      } else {
        this.notification.create('error', 'Error', 'Category already exist!!', { nzPlacement: 'bottomLeft' });
      }
      this.isVisibleMiddle = false;
    }
  }

  validateDescriptionInput = (control: FormControl): { [s: string]: boolean } => this.validateDescriptionInputValue(control);

  validateDescriptionInputValue(control: FormControl): { [s: string]: boolean } {
    if (control?.value?.length > 255) {
      return { maxLength: true, error: true };
    }

    return {};
  }

  validateInput = (control: FormControl): { [s: string]: boolean } => this.validateInputValue(control);

  validateInputValue(control: FormControl): { [s: string]: boolean } {
    if (control?.value?.length > 50) {
      return { maxInputLength: true, error: true };
    }

    return {};
  }

  clearCategoryForm(): void {
    this.addCategoryForm.get('name').reset();
  }

  onEvent(event): void {
    event.stopPropagation();
  }

  customCategory(event: any): any {
    this.customCategoryName = event.target.value;
  }

  identifyCategories(index, item): number {
    return item.id;
  }

  identifyListOfCategories(index, item): number {
    return item.id;
  }


}
