import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from './gallery.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { UploadPhotoDialogComponent } from './upload-photo-dialog/upload-photo-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { SaveAlbumDialogComponent } from './save-album-dialog/save-album-dialog.component';
import { ImagePreviewDialogComponent } from './image-preview-dialog/image-preview-dialog.component';
import { ErrorComponent } from '../error/error.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    HttpClientModule
  ],
  declarations: [
    GalleryComponent,
    UploadPhotoDialogComponent,
    ConfirmationDialogComponent,
    SaveAlbumDialogComponent,
    ImagePreviewDialogComponent
  ],
  entryComponents: [
    UploadPhotoDialogComponent,
    SaveAlbumDialogComponent,
    ImagePreviewDialogComponent
  ]
})
export class GalleryModule { }
