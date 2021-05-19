import { environment } from '../../../../environments/environment';

export const ItemEndpoints = {
  create: `${environment.urls.api}/api/Item/Create`,
  itemList: `${environment.urls.api}/api/Item/GetItems `,

};
