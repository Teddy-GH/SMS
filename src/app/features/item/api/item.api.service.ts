import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Item } from '../../../models/item';
import { ItemEndpoints } from './../../../../src/app/features/item/apis/item.endpoint';
import { Category } from './../../../models/category';

@Injectable()
export class ItemApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store,
  ) {}

  contentType = 'Content-Type';
  applicationType = 'application/json';

  createCategory(category: string): Observable<Category> {
    const headers = new HttpHeaders().set(this.contentType, this.applicationType);

    return this.http.post<Category>(ItemEndpoints.category, category, { headers });
  }

  createItem(form: any): Observable<Item> {
    const formData = new FormData();
    formData.append('Name', form.name);
    formData.append('Description', form.description);
    formData.append('Category', form.Category);
    formData.append('MeasureUnit', form.MeasureUnit);
    formData.append('Quantity', form.Category);


    return this.http.post<Item>(ItemEndpoints.create, formData);
  }

  getItemById(itemId: number): Observable<Item> {
    return this.http.get<Item>(ItemEndpoints.getCommunityById(itemId));
  }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(ItemEndpoints.itemList);
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(ItemEndpoints.categoryList);
  }





}
