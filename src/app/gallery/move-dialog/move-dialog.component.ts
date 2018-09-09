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
  albums: any;
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
        // make proper ordering
        this.albums = this.unFlattenAlbum(response.albums);
        // flatten array back
        this.albums = this.flattenAlbum({
          _id: '',
          title: '(No Album)',
          children: this.albums,
          lvl: 0
        }, 'children');
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

  counter(i: number) {
    return new Array(i);
  }

  private unFlattenAlbum(array, parent = null,  lvl = 0) {
    const self = this;

    let tree = [];
    parent = parent ? parent : { _id: '' };

    const children = array.filter(function(child) { return child.parentId === parent._id; });

    if (children.length) {
      if (parent._id === '') {
        tree = children;
      } else {
        parent['children'] = children;
      }
      children.forEach(function(child) {
        child['lvl'] = lvl;
        self.unFlattenAlbum( array, child, lvl + 1 );
      } );
    }

    return tree;
  }

  private flattenAlbum(root, key) {
    const flatten = [Object.assign({}, root)];
    delete flatten[0][key];

    if (root[key] && root[key].length > 0) {
      return flatten.concat(root[key]
        .map((child) => this.flattenAlbum(child, key))
        .reduce((a, b) => a.concat(b), [])
      );
    }

    return flatten;
  }
}
