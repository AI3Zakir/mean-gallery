import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GalleryService } from '../gallery.service';
import { Album } from '../models/album.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Photo } from '../models/photo.model';

@Component({
  selector: 'app-move-dialog',
  templateUrl: './move-dialog.component.html',
  styleUrls: ['./move-dialog.component.css']
})
export class MoveDialogComponent implements OnInit {

  isLoading = false;
  albums: Album[];
  form: FormGroup;
  currentMedia: any;
  mediaType: string;

  constructor(
    public dialogRef: MatDialogRef<MoveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private galleryService: GalleryService
  ) {
  }

  ngOnInit() {
    this.currentMedia = this.data.media;
    this.mediaType = this.data.type;
    this.isLoading = true;
    this.galleryService.getAllAlbums()
      .subscribe((response) => {
        this.form = new FormGroup({
          'album': new FormControl(null, {validators: [Validators.required]})
        });
        this.form.setValue({
            'album': this.currentMedia.parentId
          }
        );
        this.albums = response.albums.filter((el) => el._id !== this.currentMedia._id);
        this.isLoading = false;
      });
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  onChangeAlbum() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mediaType === 'album') {
      this.galleryService.updateAlbum(this.currentMedia._id, this.currentMedia.title, this.form.value.album);
    } else {
      this.galleryService.updatePhoto(
        this.currentMedia._id,
        this.currentMedia.title,
        this.currentMedia.image,
        this.currentMedia.thumbnail,
        this.form.value.album);
    }
    this.form.reset();
  }
}
