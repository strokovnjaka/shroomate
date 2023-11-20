import { Component } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router"; 
import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators"; 
import { User } from '../../classes/user';
import { AuthenticationService } from "../../services/authentication.service";

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.component.html',
  styles: ['.already-have { text-align: right; }']
})
export class SignupComponent {
  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { }

  protected formError!: string;

  protected credentials: User = new User()
  
  ratherLogin() {
    this.activeModal.dismiss('login');
  }

  signup() {
    console.log('signup clicked');

    this.formError = "";
    if (
      !this.credentials.name ||
      !this.credentials.email ||
      !this.credentials.password
    ) {
      this.formError = "All fields are required, please try again.";
      return;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.credentials.email)) {
      this.formError = "Please enter a valid email address.";
      return;
    }
    if (this.credentials.password.length < 5) {
      this.formError = "Password must be at least 5 characters long.";
      return;
    }

    this.authenticationService
      .signup(this.credentials)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.formError = error.toString();
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.activeModal.dismiss('signed up');
        this.router.navigateByUrl("/");
      });
  }
}
