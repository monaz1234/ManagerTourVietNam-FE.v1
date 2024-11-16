
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { ManagerUserComponent } from './manager-user/manager-user.component';
import { AddComponent } from './manager-user/add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { AddAccountComponent } from './account/add-account/add-account.component';
import { EditAccountComponent } from './account/edit-account/edit-account.component';

import { ManagerPromotionComponent } from './manager-promotion/manager-promotion.component';
import { AddPromotionComponent } from './manager-promotion/add-promotion/add-promotion.component';
import { EditPromoComponent } from './manager-promotion/edit-promotion/edit-promo.component';

import { RegisterComponent } from './register/register.component';

import { InfoUserComponent } from './info-user/info-user.component';

import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerdetailComponent } from './customerdetail/customerdetail.component';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent, // Thêm AdminComponent vào đây
    CustomerComponent,

    ManagerUserComponent,
    AddComponent,
    EditComponent,

    RegisterComponent,
    LoginComponent,

    ManagerVehicleComponent,
    AddVehicleComponent,
    EditVehicleComponent,

    ManagerHotelComponent,
    AddHotelComponent,
    EditHotelComponent,

    ManagerPromotionComponent,
    AddPromotionComponent,
    EditPromoComponent,

    TypeUserComponent,
    AddTypeComponent,
    EditTypeUserComponent,

    AccountComponent,
    AddAccountComponent,
    EditAccountComponent,

    LoginComponent,
    AdminComponent,
    RegisterComponent,
    InfoUserComponent,
    CustomerdetailComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule, // Thêm RouterModule

  ],
  providers: [
    provideHttpClient()
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }

