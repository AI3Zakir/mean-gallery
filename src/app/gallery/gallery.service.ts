import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Photo } from './models/photo.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

const PHOTOS_API_URL = environment.apiUrl + '/api/photos';
const ALBUMS_API_URL = environment.apiUrl + '/api/photos';
@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private photos: Photo[] = [];
  private photosUpdated = new Subject<{photos: Photo[]}>();

  constructor(private httpClient: HttpClient, private router: Router) { }

  getPhotosObservable() {
    return this.photosUpdated.asObservable();
  }

  addPhoto(title: string, image: File, parentId: string) {
    const photoData = new FormData();
    photoData.append('title', title);
    photoData.append('parentId', parentId);
    photoData.append('image', image, title);

    this.httpClient.post<{message: string, photo: Photo}>(PHOTOS_API_URL, photoData)
      .subscribe((addedPost) => {
        this.photos.push(addedPost.photo);
        this.photosUpdated.next({ photos: [...this.photos] });
        this.router.navigate(['/']);
      });
  }

  updatePhoto(id: string, title: string, image: File | string, parentId: string) {
    let photoData: Photo | FormData;
    if (typeof(image) === 'object') {
      photoData = new FormData();
      photoData.append('_id', id);
      photoData.append('title', title);
      photoData.append('image', image, title);
      photoData.append('parentId', parentId);
    } else {
      photoData = { _id: id, title: title, image: image, parentId: parentId, userId: null};
    }
    this.httpClient.put(PHOTOS_API_URL + '/' + id, photoData)
      .subscribe(response => {
        const updatedPosts = [...this.photos];
        const oldPostIndex = updatedPosts.findIndex(p => p._id === id);
        updatedPosts[oldPostIndex] = {_id: id, title: title, image: '', parentId: parentId, userId: ''};
        this.photos = updatedPosts;
        this.photosUpdated.next({ photos: [...this.photos] });
        this.router.navigate(['/']);
      });
  }

  getPhoto(id: string) {
    return this.httpClient
      .get<{_id: string, title: string, image: string, parentId: string, userId: string}>(PHOTOS_API_URL + '/' + id);
  }

  deletePhoto(id: string) {
    return this.httpClient.delete(PHOTOS_API_URL + '/' + id);
  }
}
