import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Photo } from './models/photo.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Album } from './models/album.model';

const PHOTOS_API_URL = environment.apiUrl + '/api/photos';
const ALBUMS_API_URL = environment.apiUrl + '/api/albums';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private photos: Photo[] = [];
  private albums: Album[] = [];
  private photosUpdated = new Subject<Photo[]>();
  private albumsUpdated = new Subject<Album[]>();

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  getPhotosObservable() {
    return this.photosUpdated.asObservable();
  }

  addPhoto(title: string, image: File, parentId: string = '') {
    const photoData = new FormData();
    photoData.append('title', title);
    photoData.append('parentId', parentId);
    photoData.append('image', image, title);

    this.httpClient.post<{ message: string, photo: Photo }>(PHOTOS_API_URL, photoData)
      .subscribe((addedPost) => {
        this.photos.push(addedPost.photo);
        this.photosUpdated.next([...this.photos]);
      });
  }

  updatePhoto(id: string, title: string, image: File | string, thumbnail: string, parentId: string = '') {
    let photoData: Photo | FormData;
    if (typeof(image) === 'object') {
      photoData = new FormData();
      photoData.append('_id', id);
      photoData.append('title', title);
      photoData.append('image', image, title);
      photoData.append('parentId', parentId);
    } else {
      photoData = {_id: id, title: title, image: image, thumbnail: thumbnail, parentId: parentId, userId: null};
    }
    this.httpClient.put<{ message: string, photo: Photo }>(PHOTOS_API_URL + '/' + id, photoData)
      .subscribe(response => {
        const updatedPosts = [...this.photos];
        const oldPostIndex = updatedPosts.findIndex(p => p._id === id);
        updatedPosts[oldPostIndex] = response.photo;
        this.photos = updatedPosts;
        this.photosUpdated.next([...this.photos]);
      });
  }

  getPhoto(id: string) {
    return this.httpClient
      .get<{ _id: string, title: string, image: string, thumbnail: string, parentId: string, userId: string }>(PHOTOS_API_URL + '/' + id);
  }

  deletePhoto(id: string) {
    return this.httpClient.delete(PHOTOS_API_URL + '/' + id);
  }

  getPhotos(parentId: string = '') {
    this.httpClient.get<{ message: string, photos: Photo[] }>(PHOTOS_API_URL + '?parentId=' + parentId)
      .subscribe(
        (response) => {
          this.photos = response.photos;
          this.photosUpdated.next([...this.photos]);
        }
      );
  }

  getAlbumsObservable() {
    return this.albumsUpdated.asObservable();
  }

  addAlbum(title: string, parentId: string = '') {
    const albumData = {title: title, parentId: parentId};

    this.httpClient.post<{ message: string, album: Album }>(ALBUMS_API_URL, albumData)
      .subscribe((addedPost) => {
        this.albums.push(addedPost.album);
        this.albumsUpdated.next([...this.albums]);
      });
  }

  updateAlbum(id: string, title: string, parentId: string = '') {
    const albumData: Album = {_id: id, title: title, parentId: parentId, userId: null};
    this.httpClient.put<{ message: string, album: Album }>(ALBUMS_API_URL + '/' + id, albumData)
      .subscribe(response => {
        const updatedPosts = [...this.albums];
        const oldPostIndex = updatedPosts.findIndex(p => p._id === id);
        updatedPosts[oldPostIndex] = response.album;
        this.albums = updatedPosts;
        this.albumsUpdated.next([...this.albums]);
      });
  }

  getAlbum(id: string) {
    return this.httpClient
      .get<{ _id: string, title: string, parentId: string, userId: string }>(ALBUMS_API_URL + '/' + id);
  }

  deleteAlbum(id: string) {
    return this.httpClient.delete(ALBUMS_API_URL + '/' + id);
  }

  getAlbums(parentId: string = '') {
    this.httpClient.get<{ message: string, albums: any }>(ALBUMS_API_URL + '?parentId=' + parentId)
      .subscribe(
        (response) => {
          this.albums = response.albums;
          this.albumsUpdated.next([...this.albums]);
        }
      );
  }

  getAllAlbums() {
    return this.httpClient.get<{ message: string, albums: any }>(ALBUMS_API_URL);
  }
}
