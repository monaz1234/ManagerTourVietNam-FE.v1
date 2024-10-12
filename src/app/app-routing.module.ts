import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerUserComponent } from './manager-user/manager-user.component';
import { AddComponent } from './manager-user/add/add.component';

const routes: Routes = [
{path : 'gioithieu', component : ManagerUserComponent, children :[
  {path: 'add', component: AddComponent},

]},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
