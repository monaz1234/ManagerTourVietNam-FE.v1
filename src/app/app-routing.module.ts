
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManagerUserComponent } from './manager-user/manager-user.component';
import { AddComponent } from './manager-user/add/add.component';
import { EditComponent } from './manager-user/edit/edit.component';

import { ManagerVehicleComponent } from './manager-vehicle/manager-vehicle.component';
import { AddVehicleComponent } from './manager-vehicle/add-vehicle/add-vehicle.component';
import { ManagerHotelComponent } from './manager-hotel/manager-hotel.component';

import { ManagerPromotionComponent } from './manager-promotion/manager-promotion.component';
import { AddPromotionComponent } from './manager-promotion/add-promotion/add-promotion.component';
import { EditPromoComponent } from './manager-promotion/edit-promotion/edit-promo.component';


const routes: Routes = [
{path : 'gioithieu', component : ManagerUserComponent, children :[
  {path: 'add', component: AddComponent},
  {path: 'edit/:iduser', component: EditComponent},

  {path : 'phuongtien', component : ManagerVehicleComponent,children:[
    {path: 'add',component:AddVehicleComponent }
  ]},

  {path : 'khachsan', component : ManagerHotelComponent,children:[
    {path: 'add',component:AddVehicleComponent }
  ]}


]},

{path : 'khuyenmai', component : ManagerPromotionComponent, children :[
  {path: 'add', component: AddPromotionComponent},
  {path: 'edit/:promotion_code', component: EditPromoComponent},
]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
