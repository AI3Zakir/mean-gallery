import { Component, Inject, OnInit } from '@angular/core';
import { Photo } from '../models/photo.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GalleryService } from '../gallery.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-image-preview-dialog',
  templateUrl: './image-preview-dialog.component.html',
  styleUrls: ['./image-preview-dialog.component.css']
})
export class ImagePreviewDialogComponent implements OnInit {
  serverUrl = environment.apiUrl;
  photo: Photo;

  constructor(
    public dialogRef: MatDialogRef<ImagePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private galleryService: GalleryService
  ) { }

  ngOnInit() {
    this.galleryService.getPhoto(this.data.id)
      .subscribe((photo) => {
        this.photo = photo;
      });
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
