
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
import { FacebookLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
//import { ReportComponent } from './report/report.component';

import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerdetailComponent } from './customerdetail/customerdetail.component';
import { BookComponent } from './book/book.component';
import { AddbookComponent } from './book/addbook/addbook.component';
import { EditbookComponent } from './book/editbook/editbook.component';
import { BookdetailComponent } from './bookdetail/bookdetail.component';

import { AddBookdetailComponent } from './bookdetail/add-bookdetail/add-bookdetail.component';
import { EditBookDetailComponent } from './bookdetail/edit-book-detail/edit-book-detail.component';
import { ManagerServiceComponent } from './ManagerService/manager-service/manager-service.component';
import { AddServiceComponent } from './ManagerService/manager-service/add-service/add-service.component';
import { EditServiceComponent } from './ManagerService/manager-service/edit-service/edit-service.component';

import { ClientLienHeComponent } from './client-lienhe/client-lienhe.component';
import { ClientHotelComponent } from './client-hotel/client-hotel.component';
import { ClienthoteldetailComponent } from './clienthoteldetail/clienthoteldetail.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { NewsComponent } from './news/news.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { ManagerTourComponent } from './manager-tour/manager-tour/manager-tour.component';
import { AddTourComponent } from './manager-tour/manager-tour/add-tour/add-tour.component';
import { EditTourComponent } from './manager-tour/manager-tour/edit-tour/edit-tour.component';
import { TourDetailComponent } from './tour-detail/tour-detail.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent, // Thêm AdminComponent vào đây
    CustomerComponent,
    LoginComponent,
    ManagerUserComponent,
    AddComponent,
    EditComponent,

    RegisterComponent,


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

    AdminComponent,
    RegisterComponent,
    InfoUserComponent,

    CustomerdetailComponent,
    BookComponent,
    AddbookComponent,
    EditbookComponent,
    BookdetailComponent,

    AddBookdetailComponent,
    EditBookDetailComponent,
    ManagerServiceComponent,
    AddServiceComponent,
    EditServiceComponent,



    ClientLienHeComponent,
    ClientHotelComponent,
    ClienthoteldetailComponent,
    AboutUsComponent,
    NewsComponent,


    //ReportComponent,

    InvoiceComponent,
      ManagerTourComponent,
      AddTourComponent,
      EditTourComponent,
      TourDetailComponent,
      InvoiceDetailComponent,





  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    RouterModule, // Thêm RouterModule

    SocialLoginModule


  ],
  providers: [
    provideHttpClient(),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('1130182508724914')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],


  bootstrap: [AppComponent]
})
export class AppModule { }

