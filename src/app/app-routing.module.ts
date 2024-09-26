import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerUserComponent } from './manager-user/manager-user.component';

const routes: Routes = [
{path : 'gioithieu', component : ManagerUserComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
