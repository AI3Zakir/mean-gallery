import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Photo } from '../models/photo.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from '../validators/mime-type.validator';
import { GalleryService } from '../gallery.service';

@Component({
  selector: 'app-upload-photo-dialog',
  templateUrl: './upload-photo-dialog.component.html',
  styleUrls: ['./upload-photo-dialog.component.css']
})
export class UploadPhotoDialogComponent implements OnInit {
  private mode = 'CREATE';
  private id: string;
  photo: Photo;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  serverUrl = environment.apiUrl;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public route: ActivatedRoute, private galleryService: GalleryService) {
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
        this.imagePreview = this.serverUrl + this.photo.image;
      });
    } else {
      console.log('CREATE');
      this.mode = 'CREATE';
      this.id = null;
    }
  }

  onPhotoSaved() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'CREATE') {
      this.galleryService.addPhoto(this.form.value.title, this.form.value.image, this.data.parentId);
    } else {
      this.galleryService.updatePhoto(this.id, this.form.value.title, this.form.value.image, this.data.parentId);
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
}
