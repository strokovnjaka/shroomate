import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from '../signup/signup.component';
import { LoginComponent } from '../login/login.component';
import { AuthenticationService } from "../../services/authentication.service";
import { SettingsComponent } from '../settings/settings.component';
import { SightingComponent } from '../sighting/sighting.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styles: [
  ]
})
export class NavigationComponent {

  constructor(
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
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

}
