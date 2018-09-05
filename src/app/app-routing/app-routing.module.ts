import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../user/login/login.component';
import { SignUpComponent } from '../user/sign-up/sign-up.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { UserGuard } from '../user/user.guard';

const routes: Routes = [
  { path: 'sign-up', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: GalleryComponent, canActivate: [UserGuard] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
