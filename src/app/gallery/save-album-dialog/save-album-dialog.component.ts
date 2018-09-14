import { Component, Inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Photo } from '../models/photo.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Album } from '../models/album.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GalleryService } from '../gallery.service';

@Component({
  selector: 'app-save-album-dialog',
  templateUrl: './save-album-dialog.component.html',
  styleUrls: ['./save-album-dialog.component.css']
})
export class SaveAlbumDialogComponent implements OnInit {
  private mode = 'CREATE';
  private id: string;
  private albumsSubscriber: Subscription;
  album: Album;
  isLoading = false;
  form: FormGroup;
  serverUrl = environment.apiUrl;

  constructor(
    public dialogRef: MatDialogRef<SaveAlbumDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private galleryService: GalleryService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]})
    });
    this.mode = 'CREATE';
    this.id = null;

    if (this.data.id) {
      this.mode = 'EDIT';
      this.id = this.data.id;
      this.isLoading = true;
      this.galleryService.getAlbum(this.id).subscribe((album) => {
        this.isLoading = false;
        this.album = album;
        this.form.setValue({
          'title': this.album.title
        });
      });
    }

    this.albumsSubscriber = this.galleryService.getAlbumsObservable()
      .subscribe(() => {
        this.dialogRef.close();
      }, () => {
        this.dialogRef.close();
      });
  }

  onPhotoSaved() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'CREATE') {
      this.galleryService.addAlbum(this.form.value.title, this.data.parentId);
    } else {
      this.galleryService.updateAlbum(this.id, this.form.value.title, this.data.parentId);
    }
    this.form.reset();
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
