import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MAX_LOGIN_ATTEMPTS, UserService } from '../user.service';
import { ErrorComponent } from '../../error/error.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  form: FormGroup;
  loginCounter = 0;
  maxLoginAttempts = MAX_LOGIN_ATTEMPTS;
  private authStatusSubscription: Subscription;
  private loginCounterSubscription: Subscription;

  constructor(
    private userService: UserService,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.loginCounter = this.userService.getLoginCounter();
    this.form = new FormGroup({
      'email': new FormControl(null, {validators: [Validators.required, Validators.email]}),
      'password': new FormControl(null, {validators: [Validators.required]}),
    });

    this.authStatusSubscription = this.userService.getAuthStatusListener().subscribe(
      (authStatus) => {
        this.isLoading = false;
      }, (error) => {
        this.isLoading = false;
      }
    );
    this.loginCounterSubscription = this.userService.getLoginCounterListener()
      .subscribe((count) => {
        this.loginCounter = count;
      });
  }

  onLogin() {
    if (this.form.invalid) {
      return;
    }

    if (this.loginCounter >= MAX_LOGIN_ATTEMPTS - 1) {
      const blockTime = new Date(+this.userService.getBlockedUntil());
      const formattedDate = blockTime.getHours() + ':' + blockTime.getMinutes() + ':' + blockTime.getSeconds() +
        ' ' + blockTime.getDate() + '/' + (blockTime.getMonth() + 1) + '/' + blockTime.getFullYear();
      this.dialog.open(ErrorComponent, {
        data: {
          message: 'Exceeded maximum number of login attempts.' +
            'You will be unlocked at:' + formattedDate
        }
      });

      return;
    }

    this.isLoading = true;
    this.userService.login(
      this.form.value.email,
      this.form.value.password,
    );
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }

}
