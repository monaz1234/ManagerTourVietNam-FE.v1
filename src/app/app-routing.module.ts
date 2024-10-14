import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerUserComponent } from './manager-user/manager-user.component';
import { AddComponent } from './manager-user/add/add.component';
import { EditComponent } from './manager-user/edit/edit.component';

const routes: Routes = [
{path : 'gioithieu', component : ManagerUserComponent, children :[
  {path: 'add', component: AddComponent},
  {path: 'edit/:iduser', component: EditComponent},


]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
