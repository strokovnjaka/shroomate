import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from '../signup/signup.component';
import { LoginComponent } from '../login/login.component';
import { AuthenticationService } from "../../services/authentication.service";
import { SettingsComponent } from '../settings/settings.component';
import { SightingComponent } from '../sighting/sighting.component';
import { ConnectionService } from "../../services/connection.service";
import { User } from '../../classes/user';
import { faUser, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styles: [
  ]
})
export class NavigationComponent {
  faUser = faUser;
  faTriangleExclamation = faTriangleExclamation;

  constructor(
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private connectionService: ConnectionService,
    ) {}

  openSighting() {
    this.modalService.open(SightingComponent, { centered: true });
  }

  openFilter() {}
  
  openMessages() {}

  openSettings() {
    this.modalService.open(SettingsComponent, { centered: true });
   }

  openLogin() {
    this.modalService.open(LoginComponent, { centered: true });
  }

  openSignup() {
    this.modalService.open(SignupComponent, { centered: true });
  }

  logout() {
    this.authenticationService.logout();
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public getCurrentUserName(): string {
    const user: User | null = this.authenticationService.getCurrentUser();
    return user ? user.name : "Guest";
  }

  public isConnected(): boolean {
    return this.connectionService.isConnected;
  }
}
