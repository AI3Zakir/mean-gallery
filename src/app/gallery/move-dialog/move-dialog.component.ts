import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GalleryService } from '../gallery.service';
import { Album } from '../models/album.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Photo } from '../models/photo.model';
import { Subscription } from 'rxjs';

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
  private albumsSubscriber: Subscription;
  private photosSubscriber: Subscription;

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
        this.albums = this.unflattenAlbum(response.albums);
        this.isLoading = false;
      });
    this.albumsSubscriber = this.galleryService.getAlbumsObservable()
      .subscribe(() => {
        this.dialogRef.close();
      }, () => {
        this.dialogRef.close();
      });
    this.photosSubscriber = this.galleryService.getPhotosObservable()
      .subscribe(() => {
        this.dialogRef.close();
      }, () => {
        this.dialogRef.close();
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

  private unflattenAlbum(albums: Album[]) {
    const tree = [],
      mappedArr = {};
    let arrElem,
      mappedElem;

    for (let i = 0, len = albums.length; i < len; i++) {
      arrElem = albums[i];
      mappedArr[arrElem._id] = arrElem;
      mappedArr[arrElem._id]['children'] = [];
    }

    for (const id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        mappedElem = mappedArr[id];
        if (mappedElem.parentId) {
          mappedArr[mappedElem['parentId']]['children'].push(mappedElem);
        } else {
          tree.push(mappedElem);
        }
      }
    }
    return tree;
  }
}
