import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from '../../classes/user';
import { AuthenticationService } from "../../services/authentication.service";
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styles: ['.need-account { text-align: right; }']
})
export class LoginComponent {
  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private authenticationService: AuthenticationService,
    private connectionService: ConnectionService,
  ) { }

  protected formError!: string;

  protected credentials: User = new User();

  ratherSignup() {
    this.activeModal.dismiss('signup');
  }

  login() {
    this.formError = "";
    if (!this.credentials.email || !this.credentials.password) {
      this.formError = "All fields are required.";
      return;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.credentials.email)) {
      this.formError = "Invalid email entry.";
      return;
    }
    this.authenticationService
      .login(this.credentials)
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

  public isConnected(): boolean {
    return this.connectionService.isConnected;
  }
}
