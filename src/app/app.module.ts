import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GalleryModule } from './gallery/gallery.module';
import { UserModule } from './user/user.module';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HeaderComponent } from './header/header.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserInterceptor } from './user/user.interceptor';
import { HomepageComponent } from './homepage/homepage.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ErrorInterceptor } from './error.interceptor';
import { ErrorComponent } from './error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomepageComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    GalleryModule,
    UserModule,
    AngularMaterialModule,
    BrowserAnimationsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: UserInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmationDialogComponent,
    ErrorComponent
  ]
})
export class AppModule {
}
