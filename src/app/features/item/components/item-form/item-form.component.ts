import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@tps/core/services/auth.service';
import { AppRoles } from '@tps/core/src/lib/models/roles';
import { findIndex } from 'lodash-es';
import { NzDateMode, NzModalRef, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { base64ToFile, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { Subject } from 'rxjs';
import { environment } from './../../../../../environments/environment';
import { Category } from './../../../../models/category';
import { Community, CommunityZipcode } from './../../../../models/community';

@Component({
  selector: 'tps-community-form',
  templateUrl: './community-form.component.html',
  styleUrls: ['./community-form.component.scss']
})
export class CommunityFormComponent implements OnInit, OnDestroy, OnChanges {
  communityForm: FormGroup;
  imageUrl: any;
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

  @Input() imageChangedEvent: any = '';
  @Input() resizeToWidth = 705;
  @Input() resizeToHeight = 116;
  @Input() cropperMinWidth = 705;
  @Input() cropperMinHeight = 116;
  @Input() accept = 'image/jpeg, image/png';
  @Input() multiple = false;
  @Input() imagesList: string[];
  @Input() categoryList!: Category[];
  @Input() selectedCommunity: Community;

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

  @Input() community: Community;
  @Input() zipcode: CommunityZipcode;
  @Input() loading: boolean;
  @Input() selectedCommunityForEdit: Community;
  @Input() loadingSelectedCommunity: boolean;
  @Input() listOfZipcodes: CommunityZipcode;

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

  identifyZipcode(index, item): string {
    return index;
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => this.confirmationValidatorValue(control);

  confirmationValidatorValue(control: FormControl): { [s: string]: boolean } {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.communityForm.controls.password.value) {
      return { confirm: true, error: true };
    }

    return {};
  }

  submitForm(): void {
    Object.keys(this.communityForm.controls).forEach((key) => {
      this.markControlAsDirty(this.communityForm.get(key));
    });
    if (this.communityForm.valid) {
      this.communityForm.patchValue({ image: this.fileToUpload });
      const community = this.communityForm.value;
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
    this.setConditionalValidator();
  }

  ngOnChanges(changes: SimpleChanges): any {
    if (changes?.selectedCommunityForEdit) {
      if (this.selectedCommunityForEdit?.type === 'location-based') {
        this.resetCommunityForm();
      }
      if (this.selectedCommunityForEdit?.type === 'non-location-based') {
        this.resetNonLocationBaseCommunityForm();
      }
      this.patchSelectedCommunity();
    }
    if (changes.categoryList) {
      this.checkedCategory = changes.categoryList.currentValue?.reduce((reduced, item: Category) => {
        const id = item.id;
        reduced[id] = false;

        return reduced;
      }, {});
    }
  }
  resetCommunityForm(): void {
    this.communityForm = this.fb.group({
      zipcode: this.fb.control('', Validators.required),
      name: this.fb.control(''),
      category: this.fb.control(''),
      type: this.fb.control(''),
      description: this.fb.control(undefined, [this.validateDescriptionInput]),
      image: this.fb.control(''),
      imageUrl: this.fb.control('')
    });
    this.addCategoryForm = this.fb.group({
      name: this.fb.control(undefined, [Validators.required, this.validateInput])
    });
  }
  // reset Community form for non-location based
  resetNonLocationBaseCommunityForm(): void {
    this.communityForm = this.fb.group({
      zipcode: this.fb.control(''),
      name: this.fb.control(''),
      category: this.fb.control(''),
      type: this.fb.control(''),
      description: this.fb.control(undefined, [this.validateDescriptionInput]),
      image: this.fb.control(''),
      imageUrl: this.fb.control('')
    });
    this.addCategoryForm = this.fb.group({
      name: this.fb.control(undefined, [Validators.required, this.validateInput])
    });
  }
  patchSelectedCommunity(): any {
    if (this.selectedCommunityForEdit) {
      this.selectedZipcode = `${this.selectedCommunityForEdit?.zipCode}` + '##' + `${this.selectedCommunityForEdit?.city}`;
      if (this.selectedCommunityForEdit?.type === 'location-based') {
        this.selectedCommunityForEdit.type = '1';

        this.communityForm.patchValue({ zipcode: this.selectedZipcode });
        this.commType = '1';
      }
      if (this.selectedCommunityForEdit?.type === 'non-location-based') {
        this.selectedCommunityForEdit.type = '0';

        this.communityForm.patchValue({ name: this.selectedCommunityForEdit?.name });
        this.commType = '0';
        this.selectedCommunityForEdit?.categories.forEach((element) => {
          this.listOfCategories.add(element);
        });
        this.communityForm.patchValue({ listOfCategories: this.listOfCategories });
      }
      if (this.selectedCommunityForEdit?.imageUrl !== null) {
        const tempImageUrl = this.selectedCommunityForEdit?.imageUrl.slice(1);
        this.imageUrl = `${this.imageSrc + tempImageUrl.toString()}`;
      }
      this.communityForm.patchValue(this.selectedCommunityForEdit);
    }
  }
  setConditionalValidator(): void {
    const nameField = this.communityForm.get('name');
    const zipcodeField = this.communityForm.get('zipcode');
    const categoryField = this.communityForm.get('category');
    this.communityForm.get('type').valueChanges.subscribe((type) => {
      if (type === '1') {
        nameField.setValidators([]);
        zipcodeField.setValidators([Validators.required]);
        categoryField.setValidators([]);
      } else {
        zipcodeField.setValidators([]);
        nameField.setValidators([Validators.required, this.validateInput]);
        categoryField.setValidators([Validators.required]);
      }
    });
  }

  removeImage(): any {
    this.imageUrl = undefined;
    this.imageChangedEvent = undefined;
  }

  confirmDeletion(index): any {
    this.confirmModal = this.modal.confirm({
      nzWrapClassName: 'vertical-center-modal',
      nzTitle: 'Remove Image',
      nzContent: 'Are you sure you want to remove this image?',
      nzOkText: 'Remove image',
      nzCancelText: 'Cancel',

      nzOnOk: () => this.removeImage()
    });
  }

  uploadImage(): void {
    this.hasImage = false;
    this.imageChangedEvent = undefined;
    this.isUploadVisible = true;
  }

  getTabSet(index: any): void {
    this.tabIndex = index;
  }

  zoomOut(): void {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn(): void {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.hasImage = true;
    this.croppedImage = event.base64; // preview
    const fileBeforeCrop = this.imageChangedEvent.target.files[0]; // converting for upload
    this.fileToUpload = new File([base64ToFile(event.base64)], fileBeforeCrop.name, { type: fileBeforeCrop.type });
    this.communityForm.patchValue({ image: this.fileToUpload });
  }

  rotateLeft(): void {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight(): void {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate(): void {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }

  flipHorizontal(): void {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  flipVertical(): void {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  resetImage(): void {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  loadImageFailed(): void {
    this.notification.create('error', 'Error', 'Invalid file type or format!!', { nzPlacement: 'bottomLeft' });
  }

  imageLoaded(): void {
    this.showCropper = true;
  }

  addFile(): void {
    this.file.nativeElement.click();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  addImage(): void {
    if (this.croppedImage !== '') {
      this.imageUrl = this.croppedImage;
    }
    if (this.tempImageUrl) {
      this.hasImage = true;
      this.imageUrl = this.imageSrc + this.imageVal;
      this.communityForm.patchValue({ imageUrl: this.imageVal });
      this.tempImageUrl = !this.tempImageUrl;
    }
    this.isUploadVisible = false;
    this.isConfirmVisible = false;
  }

  handleCancel(): void {
    this.hasImage = false;
    this.imageChangedEvent = undefined;
    this.isUploadVisible = false;
    this.isConfirmVisible = false;
  }

  removeSelectedImage(): void {
    const allElements = document.getElementsByClassName('image-fit-div');
    let i = 0;
    while (i < allElements.length) {
      allElements[i].classList.remove('selected-image');
      i++;
    }
  }

  addUploadedImage(imageVal: string, index: number): void {
    this.hasImage = true;
    this.imageVal = imageVal;
    this.tempImageUrl = true;
    this.removeSelectedImage();
    const element = document.getElementsByClassName('image-fit-div')[index];
    element?.classList.add('selected-image');
  }

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

  identifyListOfImages(index, item): number {
    return item.id;
  }
}
