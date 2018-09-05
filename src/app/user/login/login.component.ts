import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { ParentErrorStateMatcher } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  form: FormGroup;
  private authStatusSubscription: Subscription;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
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
  }

  onLogin() {
    if (this.form.invalid) {
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
