import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable()
export class UserInterceptor implements HttpInterceptor{

  constructor(private userService: UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.userService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('authorization', 'Bearer ' + authToken)
    });
    return next.handle(authRequest);
  }

}
