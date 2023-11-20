import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ShroomateDataService } from '../../services/shroomatedata.service';
import { User } from '../../classes/user';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.component.html',
  styles: []
})
export class SettingsComponent {
  constructor(
    private shroomateDataService: ShroomateDataService,
    private authenticationService: AuthenticationService,
    public activeModal: NgbActiveModal,
  ) {
  }

  protected formError: string = '';
  public settings: User = this.authenticationService.getCurrentUser();
  public users: User[] = Array.from(this.shroomateDataService.users.values());

  others(): User[] {
    return this.users.filter(u => u._id != this.settings._id);
  }

  save() {
    this.formError = '';
    if (!this.settings) {
      this.formError = "User not logged in. How did you get here?";
      return;
    }
    this.shroomateDataService
      .saveUser(this.settings)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.formError = error.toString();
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.activeModal.dismiss('saved settings');
      });
  }
}
