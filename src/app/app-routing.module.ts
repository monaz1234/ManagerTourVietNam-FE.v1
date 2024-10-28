
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerUserComponent } from './manager-user/manager-user.component';
import { AddComponent } from './manager-user/add/add.component';
import { EditComponent } from './manager-user/edit/edit.component';
import { ManagerVehicleComponent } from './manager-vehicle/manager-vehicle.component';
import { AddVehicleComponent } from './manager-vehicle/add-vehicle/add-vehicle.component';
import { ManagerHotelComponent } from './manager-hotel/manager-hotel.component';
import { TypeUserComponent } from './type-user/type-user.component';


const routes: Routes = [
{path : 'gioithieu', component : ManagerUserComponent, children :[
  {path: 'add', component: AddComponent},
  {path: 'edit/:iduser', component: EditComponent},
]},
{path : 'type_user', component : TypeUserComponent, children :[

]},
{path : 'phuongtien', component : ManagerVehicleComponent,children:[
  {path: 'add',component: AddVehicleComponent }
]},
{path : 'khachsan', component : ManagerHotelComponent,children:[
  {path: 'add',component:AddVehicleComponent }
]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
