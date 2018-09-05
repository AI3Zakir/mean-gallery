import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from './gallery.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { AddAlbumDialogComponent } from './add-album-dialog/add-album-dialog.component';
import { UploadPhotoDialogComponent } from './upload-photo-dialog/upload-photo-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    AngularMaterialModule
  ],
  declarations: [
    GalleryComponent,
    AddAlbumDialogComponent,
    UploadPhotoDialogComponent
  ]
})
export class GalleryModule { }
