import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Photo } from '../models/photo.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from '../validators/mime-type.validator';
import { GalleryService } from '../gallery.service';
import { Subscription } from 'rxjs';
import { ErrorComponent } from '../../error/error.component';

@Component({
  selector: 'app-upload-photo-dialog',
  templateUrl: './upload-photo-dialog.component.html',
  styleUrls: ['./upload-photo-dialog.component.css']
})
export class UploadPhotoDialogComponent implements OnInit {
  private mode = 'CREATE';
  private id: string;
  private photosSubscriber: Subscription;
  photo: Photo;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  serverUrl = environment.apiUrl;

  constructor(
    public dialogRef: MatDialogRef<UploadPhotoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private galleryService: GalleryService,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
    if (this.data.id) {
      this.mode = 'EDIT';
      this.id = this.data.id;
      this.isLoading = true;
      this.galleryService.getPhoto(this.id).subscribe((photo) => {
        this.isLoading = false;
        this.photo = photo;
        this.form.setValue({
          'title': this.photo.title,
          'image': this.photo.image
        });
        this.imagePreview = this.serverUrl + this.photo.thumbnail;
      });
    } else {
      this.mode = 'CREATE';
      this.id = null;
    }
    this.photosSubscriber = this.galleryService.getPhotosObservable()
      .subscribe(() => {
        this.dialogRef.close();
      }, () => {
        this.dialogRef.close();
      });
  }

  onPhotoSaved() {
    if (this.form.invalid) {
      if (this.form.get('image').invalid) {
        this.dialog.open(ErrorComponent, {
          data: {
            message: 'Please upload Image'
          }
        });
        return;
      }
    }

    this.isLoading = true;
    if (this.mode === 'CREATE') {
      this.galleryService.addPhoto(this.form.value.title, this.form.value.image, this.data.parentId);
    } else {
      this.galleryService.updatePhoto(this.id, this.form.value.title, this.form.value.image, this.photo.thumbnail, this.data.parentId);
    }
    this.form.reset();
  }

  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
