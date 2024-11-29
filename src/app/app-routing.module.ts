
import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';

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
import { AddServiceComponent } from './ManagerService/manager-service/add-service/add-service.component';
import { EditBookDetailComponent } from './bookdetail/edit-book-detail/edit-book-detail.component';

import { ClientLienHeComponent } from './client-lienhe/client-lienhe.component';
import { ClientHotelComponent } from './client-hotel/client-hotel.component';
import { ClienthoteldetailComponent } from './clienthoteldetail/clienthoteldetail.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { NewsComponent } from './news/news.component';
import { InvoiceComponent } from './invoice/invoice.component';


import { ReportComponent } from './report/report.component';
import { ManagerTourComponent } from './manager-tour/manager-tour/manager-tour.component';
import { AddTourComponent } from './manager-tour/manager-tour/add-tour/add-tour.component';
import { EditTourComponent } from './manager-tour/manager-tour/edit-tour/edit-tour.component';
import { TourDetailComponent } from './tour-detail/tour-detail.component';


const routes: Routes = [

{path: 'login', component : LoginComponent},
{path: 'register', component : RegisterComponent},
{path: 'infouser/:iduser', component : InfoUserComponent},
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

{ path: 'customer/lienhe', component: ClientLienHeComponent }, // Route cho trang liên hệ

{ path: 'customer/hotel', component: ClientHotelComponent }, // Route cho trang liên hệ
{ path: 'customer/hotel/:id_hotel', component:ClienthoteldetailComponent }, // Route cho

{ path: 'about-us', component: AboutUsComponent },
{ path: 'news', component: NewsComponent },
{ path: 'admin/book/detail/:id', component: BookdetailComponent },
{ path: 'admin/tour/detail/:id', component: TourDetailComponent },


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
      component: BookComponent,
      children: [
        { path: 'add', component: AddbookComponent },
        // { path: 'detail/:id', component: BookdetailComponent }  // Đảm bảo rằng đường dẫn này đúng
      ]
    },
    {
      path: 'tour', component: ManagerTourComponent, children : [
        {path : 'add', component : AddTourComponent},
        {path : 'edit', component: EditTourComponent},
        // { path: 'detail/:id', component: TourDetailComponent }
      ]
    },

      // {path: 'detail/:id', component: BookdetailComponent },

    // {
    //   path: 'detail_book', component: BookdetailComponent, children : [
    //     {path : 'add', component : AddBookdetailComponent},
    //     {path : 'edit', component : EditBookDetailComponent},
    //   ]
    // },

    {
      path:'service', component: ManagerServiceComponent, children : [
        {path : 'add', component : AddServiceComponent}
      ]
    },


    {
      path: 'report',
      component: ReportComponent,

    },

    {
      path: 'invoice',component: InvoiceComponent

    }


  ],
},
{ path: '', redirectTo: '/customer', pathMatch: 'full' }, // Điều hướng mặc định tới admin nếu cần
];
const routerOptions: ExtraOptions = {
  onSameUrlNavigation: 'reload'
};
@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
