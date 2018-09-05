import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  isLoading = false;
  form: FormGroup;
  parentErrorStateMatcher = new ParentErrorStateMatcher();
  private authStatusSubscription: Subscription;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl(null, {validators: [Validators.required, Validators.email]}),
      'passwords': new FormGroup({
        'password': new FormControl(null, {
          validators: [
            Validators.required,
            Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$')
          ]
        }),
        'confirmPassword': new FormControl(null, {
          validators: [
            Validators.required,
            Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$')
          ]
        })
      }, {validators: [this.matchingPasswords('password', 'confirmPassword')]}),
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
      this.form.get('passwords').value.password,
      this.form.value.firstName,
      this.form.value.lastName,
      this.form.value.birthDate,
    );
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    };
  }
}

export class ParentErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = !!(form && form.submitted);
    const controlTouched = !!(control && (control.dirty || control.touched));
    const controlInvalid = !!(control && control.invalid);
    const parentInvalid = !!(control && control.parent && control.parent.invalid && (control.parent.dirty || control.parent.touched));

    return isSubmitted || (controlTouched && (controlInvalid || parentInvalid));
  }
}
