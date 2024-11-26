
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManagerUserComponent } from './manager-user/manager-user.component';
import { AddComponent } from './manager-user/add/add.component';
import { EditComponent } from './manager-user/edit/edit.component';

import { ManagerVehicleComponent } from './manager-vehicle/manager-vehicle.component';
import { AddVehicleComponent } from './manager-vehicle/add-vehicle/add-vehicle.component';
import { EditVehicleComponent } from './manager-vehicle/edit-vehicle/edit-vehicle.component';

import { ManagerHotelComponent } from './manager-hotel/manager-hotel.component';
import { AddHotelComponent } from './manager-hotel/add-hotel/add-hotel.component';
import { EditHotelComponent } from './manager-hotel/edit-hotel/edit-hotel.component';

import { TypeUserComponent } from './type-user/type-user.component';
import { AddTypeComponent } from './type-user/add/add.component';
import { EditTypeUserComponent } from './type-user/edit-type-user/edit-type-user.component';

import { AccountComponent } from './account/account.component';


import { ManagerPromotionComponent } from './manager-promotion/manager-promotion.component';
import { AddPromotionComponent } from './manager-promotion/add-promotion/add-promotion.component';
import { EditPromoComponent } from './manager-promotion/edit-promotion/edit-promo.component';
import { AddAccountComponent } from './account/add-account/add-account.component';
import { EditAccountComponent } from './account/edit-account/edit-account.component';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { RegisterComponent } from './register/register.component';

import { InfoUserComponent } from './info-user/info-user.component';
import { CustomerComponent} from './customer/customer.component';
import { CustomerdetailComponent} from './customerdetail/customerdetail.component';
import { BookComponent } from './book/book.component';
import { AddbookComponent } from './book/addbook/addbook.component';
import { BookdetailComponent } from './bookdetail/bookdetail.component';
import { AddBookdetailComponent } from './bookdetail/add-bookdetail/add-bookdetail.component';
import { ManagerServiceComponent } from './ManagerService/manager-service/manager-service.component';

const routes: Routes = [

{path: 'login', component : LoginComponent},
{path: 'register', component : RegisterComponent},
{path: 'infouser', component : InfoUserComponent},
{
  path: 'customer',
  component : CustomerComponent,
  children: [
    {
      path: 'login',
      component: LoginComponent,
    },
    {
      path: 'register',
      component: RegisterComponent,
    },
    {
      path: 'customer/tour/:id',
      component: CustomerdetailComponent,
    }, // Route cho chi tiết tour

  ],
},


{ path: 'customer/tour/:idtour', component: CustomerdetailComponent }, // Route cho chi tiết tour
{
  path: 'admin',
  component: AdminComponent,
  children: [
    {
      path: 'gioithieu',
      component: ManagerUserComponent,
      children: [
        { path: 'add', component: AddComponent },
        { path: 'edit/:iduser', component: EditComponent },
      ],
    },
    {
      path: 'type_user',
      component: TypeUserComponent,
      children: [
        { path: 'add', component: AddTypeComponent },
        { path: 'edit_type_user/:idtypeuser', component: EditTypeUserComponent },
      ],
    },
    {
      path: 'phuongtien',
      component: ManagerVehicleComponent,
      children: [
        { path: 'add', component: AddVehicleComponent },
        { path: 'edit/:idvehicle', component: EditVehicleComponent },
      ],
    },
    {
      path: 'khuyenmai',
      component: ManagerPromotionComponent,
      children: [
        { path: 'add', component: AddPromotionComponent },
        { path: 'edit/:promotion_code', component: EditPromoComponent },
      ],
    },
    {
      path: 'khachsan',
      component: ManagerHotelComponent,
      children: [
        { path: 'add', component: AddHotelComponent },
        { path: 'edit/:idhotel', component: EditHotelComponent },
      ],
    },
    {
      path: 'account',
      component: AccountComponent,
      children: [
        { path: 'add', component: AddAccountComponent },
        { path: 'edit', component: EditAccountComponent },
      ],
    },
    {
      path: 'book',
      component: BookComponent, children: [
        {path: 'add', component: AddbookComponent},

      ]

    },
    {
      path: 'detail_book', component: BookdetailComponent, children : [
        {path : 'add', component : AddBookdetailComponent}
      ]
    },

    {
      path:'service', component: ManagerServiceComponent, children : [
        // {path : 'add'}
      ]
    }
  ],
},
{ path: '', redirectTo: '/customer', pathMatch: 'full' }, // Điều hướng mặc định tới admin nếu cần
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
