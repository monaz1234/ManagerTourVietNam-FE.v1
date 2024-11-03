
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerUserComponent } from './manager-user/manager-user.component';
import { AddComponent } from './manager-user/add/add.component';
import { EditComponent } from './manager-user/edit/edit.component';
import { ManagerVehicleComponent } from './manager-vehicle/manager-vehicle.component';
import { AddVehicleComponent } from './manager-vehicle/add-vehicle/add-vehicle.component';
import { EditVehicleComponent } from './manager-vehicle/edit-vehicle/edit-vehicle.component';
import { ManagerHotelComponent } from './manager-hotel/manager-hotel.component';
import { TypeUserComponent } from './type-user/type-user.component';
import { AddTypeComponent } from './type-user/add/add.component';

import { AddHotelComponent } from './manager-hotel/add-hotel/add-hotel.component';
import { EditHotelComponent } from './manager-hotel/edit-hotel/edit-hotel.component';
import { EditTypeUserComponent } from './type-user/edit-type-user/edit-type-user.component';
const routes: Routes = [
{path : 'gioithieu', component : ManagerUserComponent, children :[
  {path: 'add', component: AddComponent},
  {path: 'edit/:iduser', component: EditComponent},

]},
{path : 'type_user', component : TypeUserComponent, children :[
  {path : 'add', component : AddTypeComponent},
  {path : 'edit_type_user/:idtypeuser', component: EditTypeUserComponent}
]},
{path : 'phuongtien', component : ManagerVehicleComponent,children:[
  {path: 'add',component: AddVehicleComponent }
]},
{path : 'khachsan', component : ManagerHotelComponent,children:[
  {path: 'add',component:AddVehicleComponent }
]},

{
  path: 'phuongtien',
  component: ManagerVehicleComponent,
  children: [
    { path: 'add', component: AddVehicleComponent },
    { path: 'edit/:idvehicle', component: EditVehicleComponent }
  ]
},
{
  path: 'khachsan',
  component: ManagerHotelComponent,
  children: [
    { path: 'add', component: AddHotelComponent },
    { path: 'edit/:idhotel', component: EditHotelComponent }
  ]
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
