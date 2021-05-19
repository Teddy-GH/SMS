import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default/default-layout.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/item/item.module').then((mod) => mod.ItemModule)
      },
      {
        path: 'item',
        data: {
        },
        loadChildren: () => import('./features/item/item.module').then((mod) => mod.ItemModule)
      },


    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
