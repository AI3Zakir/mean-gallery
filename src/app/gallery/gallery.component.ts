import { Component, OnInit } from '@angular/core';
import { UploadPhotoDialogComponent } from './upload-photo-dialog/upload-photo-dialog.component';
import { MatDialog } from '@angular/material';
import { Photo } from './models/photo.model';
import { Subscription } from 'rxjs';
import { GalleryService } from './gallery.service';
import { environment } from '../../environments/environment';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { SaveAlbumDialogComponent } from './save-album-dialog/save-album-dialog.component';
import { Album } from './models/album.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ImagePreviewDialogComponent } from './image-preview-dialog/image-preview-dialog.component';
import { MoveDialogComponent } from './move-dialog/move-dialog.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  private photosSubscriber: Subscription;
  private albumsSubscriber: Subscription;
  photos: Photo[];
  albums: Album[];
  id = '';
  currentAlbum: Album;
  isLoading = false;
  serverUrl = environment.apiUrl;

  constructor(
    public dialog: MatDialog,
    private galleryService: GalleryService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.photosSubscriber = this.galleryService.getPhotosObservable()
      .subscribe((photos: Photo[]) => {
        this.photos = photos;
        this.isLoading = false;
      });
    this.albumsSubscriber = this.galleryService.getAlbumsObservable()
      .subscribe((albums: Album[]) => {
        this.albums = albums;
        this.isLoading = false;
      });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.id = paramMap.get('id');
        this.galleryService.getAlbum(this.id)
          .subscribe((album: Album) => {
            this.currentAlbum = album;
            this.galleryService.getPhotos(this.id);
            this.galleryService.getAlbums(this.id);
            this.isLoading = false;
          });
      } else {
        this.galleryService.getPhotos();
        this.galleryService.getAlbums();
      }
    });

  }

  openUploadPhotoDialog(id: string = null) {
    const dialogRef = this.dialog.open(UploadPhotoDialogComponent, {
      width: '500px',
      data: {
        id: id,
        parentId: this.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDeletePhotoDialog(id: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px'
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

  openSaveAlbumDialog(id: string = null) {
    const dialogRef = this.dialog.open(SaveAlbumDialogComponent, {
      width: '500px',
      data: {
        id: id,
        parentId: this.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDeleteAlbumDialog(id: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(confirm => {
      this.isLoading = true;
      if (confirm) {
        console.log(confirm);
        this.galleryService.deleteAlbum(id).subscribe(() => {
          this.galleryService.getAlbums();
        }, () => {
          this.isLoading = false;
        });
      }
    });
  }

  onPhotoPreview(id: string) {
    const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
      width: '90%',
      height: '90%',
      maxWidth: '90%',
      maxHeight: '90%',
      panelClass: 'transparent-dialog',
      data: {
        id: id,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openChangeDialog(id: string, type: string) {
    const mediaGetter = (type === 'album') ?
      this.galleryService.getAlbum(id) :
      this.galleryService.getPhoto(id);
    mediaGetter.subscribe((media) => {
      const dialogRef = this.dialog.open(MoveDialogComponent, {
        width: '300px',
        data: {
          media: media,
          type: type
        }
      });
    });
  }
}
