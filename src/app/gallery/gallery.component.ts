import { Component, OnInit } from '@angular/core';
import { UploadPhotoDialogComponent } from './upload-photo-dialog/upload-photo-dialog.component';
import { MatDialog } from '@angular/material';
import { Photo } from './models/photo.model';
import { Subscription } from 'rxjs';
import { GalleryService } from './gallery.service';
import { environment } from '../../environments/environment';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  private photosSubscriber: Subscription;
  photos: Photo[];
  isLoading = false;
  serverUrl = environment.apiUrl;

  constructor(public dialog: MatDialog, private galleryService: GalleryService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.photosSubscriber = this.galleryService.getPhotosObservable()
      .subscribe((photos: Photo[]) => {
        this.photos = photos;
        this.isLoading = false;
      });
    this.galleryService.getPhotos();
  }

  openUploadPhotoDialog(id: string = null) {
    const dialogRef = this.dialog.open(UploadPhotoDialogComponent, {
      width: '500px',
      data: {id: id}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDeletePhotoDialog(id: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(confirm => {
      this.isLoading = true;
      if (confirm) {
        console.log(confirm);
        this.galleryService.deletePhoto(id).subscribe(() => {
          this.galleryService.getPhotos();
        }, () => {
          this.isLoading = false;
        });
      }
    });
  }
}
