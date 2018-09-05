import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../user/model/user.model';
import { Subscription } from 'rxjs';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User;
  private currentUserSubscription: Subscription;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    this.currentUserSubscription = this.userService.getCurrentUserListener()
      .subscribe((user) => {
        this.currentUser = user;
      });
    this.currentUser = this.userService.getCurrentUser();
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }

  onLogout() {
    this.userService.logout();
  }
}
