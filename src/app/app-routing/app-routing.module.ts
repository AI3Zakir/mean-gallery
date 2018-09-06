import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../user/login/login.component';
import { SignUpComponent } from '../user/sign-up/sign-up.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { UserGuard } from '../user/user.guard';
import { HomepageComponent } from '../homepage/homepage.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'gallery', component: GalleryComponent, canActivate: [UserGuard] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
