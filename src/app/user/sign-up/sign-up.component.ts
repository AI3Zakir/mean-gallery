import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  isLoading = false;
  form: FormGroup;
  private authStatusSubscription: Subscription;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl(null, {validators: [Validators.required, Validators.email]}),
      'password': new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$')
        ]
      }),
      'firstName': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'lastName': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'birthDate': new FormControl(null, {validators: [Validators.required]}),
    });

    this.authStatusSubscription = this.userService.getAuthStatusListener().subscribe(
      (authStatus) => {
        this.isLoading = false;
      }, (error) => {
        this.isLoading = false;
      }
    );
  }

  onSignup() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.userService.createUser(
      this.form.value.email,
      this.form.value.password,
      this.form.value.firstName,
      this.form.value.lastName,
      this.form.value.birthDate,
    );
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }
}
