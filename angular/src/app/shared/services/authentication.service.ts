import { Inject, Injectable } from "@angular/core";
import { BROWSER_STORAGE } from "../classes/storage";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { User } from "../classes/user";
import { AuthResponse } from "../classes/auth-response";
import { ShroomateDataService } from "./shroomatedata.service";
import { ToastrService } from "ngx-toastr";

export const STORAGE_PROP_TOKEN = "shroomate-token";
export const STORAGE_PROP_USER  = "current-user";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private shroomateDataService: ShroomateDataService,
    private toastr: ToastrService,
  ) { }

  public login(user: User): Observable<AuthResponse> {
    return this.shroomateDataService.login(user).pipe(
      tap((authResponse: AuthResponse) => {
        this.toastr.success('You are now logged in...');
        this.storage.setItem(STORAGE_PROP_USER, JSON.stringify(authResponse.user));
        this.storage.setItem(STORAGE_PROP_TOKEN, authResponse.token);
      })
    );
  }

  public signup(user: User): Observable<AuthResponse> {
    return this.shroomateDataService.signup(user).pipe(
      tap((authResponse: AuthResponse) => {
        console.log(authResponse);
        const r = this.shroomateDataService.getConfirmEmailAddress(authResponse.email, authResponse.token);
        this.toastr.warning(`
Please check your emails and confirm the account!<br/>
For now just click <a href="${r}">this link</a>, and come back here...
`, "Sign up successful", { disableTimeOut: true });
      })
    );
  }

  public logout(): void {
    this.storage.removeItem(STORAGE_PROP_TOKEN);
    this.storage.removeItem(STORAGE_PROP_USER);
    this.toastr.success('You have successfully logged out...');
  }

  public getToken(): string | null {
    return this.storage.getItem(STORAGE_PROP_TOKEN);
  }

  public isLoggedIn(): boolean {
    const token: string | null = this.storage.getItem(STORAGE_PROP_TOKEN);;
    if (token) {
      const payload = JSON.parse(window.atob(token.split(".")[1]));
      return payload.exp > Date.now() / 1000;
    }
    return false;
  }

  public getCurrentUser(): User {
    let user: User = new User();
    if (this.isLoggedIn()) {
      const it = this.storage.getItem(STORAGE_PROP_USER);
      if (it) {
        user = JSON.parse(it);
      }
    }
    return user;
  }

}