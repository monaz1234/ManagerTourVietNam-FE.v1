
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ManagerUserComponent } from './manager-user/manager-user.component';
import { AddComponent } from './manager-user/add/add.component';
import { FormsModule } from '@angular/forms';
import { EditComponent } from './manager-user/edit/edit.component';
import { ManagerVehicleComponent } from './manager-vehicle/manager-vehicle.component';
import { AddVehicleComponent } from './manager-vehicle/add-vehicle/add-vehicle.component';
import { ManagerHotelComponent } from './manager-hotel/manager-hotel.component';
import { AddHotelComponent } from './manager-hotel/add-hotel/add-hotel.component';
import { EditVehicleComponent } from './manager-vehicle/edit-vehicle/edit-vehicle.component';
import { EditHotelComponent } from './manager-hotel/edit-hotel/edit-hotel.component';

@NgModule({
  declarations: [
    AppComponent,
    ManagerUserComponent,
    AddComponent,
    EditComponent,
    ManagerVehicleComponent,
    AddVehicleComponent,
    ManagerHotelComponent,
    AddHotelComponent,
    EditVehicleComponent,
    EditHotelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

