import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry, tap } from "rxjs/operators";
import { environment } from '../../../environments/environment';
import { Sighting } from '../classes/sighting';
import { Species } from '../classes/species';
import { User } from "../classes/user";
import { AuthResponse } from "../classes/auth-response";
import { BROWSER_STORAGE } from '../classes/storage';
import { STORAGE_PROP_TOKEN } from './authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ShroomateDataService {
  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private toastr: ToastrService,
  ) { 
    this._sightings = new Map();
    this._species = new Map();
    this._users = new Map();
  }

  private apiUrl = environment.apiUrl;
  private _sightings: Map<string, Sighting>;
  private _species: Map<string, Species>;
  private _users: Map<string, User>;

  public login(user: User): Observable<AuthResponse> {
    return this.makeAuthApiCall("login", user);
  }

  public signup(user: User): Observable<AuthResponse> {
    return this.makeAuthApiCall("signup", user);
  }

  private makeAuthApiCall(
    urlPath: string,
    user: User
  ): Observable<AuthResponse> {
    const url: string = `${this.apiUrl}/${urlPath}`;
    let body = new HttpParams().set("email", user.email).set("name", user.name);
    if (user.password)
      body = body.set("password", user.password);
    let headers = new HttpHeaders().set(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );
    return this.http
      .post<AuthResponse>(url, body, { headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  get sightings() { return this._sightings; }
  get species() { return this._species; }
  get users() { return this._users; }
  storeSightings(ret: Sighting[]) { this._sightings = new Map(ret.map(obj => [obj._id, obj])); }
  storeSpecies(ret: Species[]) { this._species = new Map(ret.map(obj => [obj._id, obj])); }
  storeUsers(ret: User[]) { this._users = new Map(ret.map(obj => [obj._id, obj])); }

  getSightings(): Observable<Sighting[]> {
    // const url: string = `${this.apiUrl}/sightings/distance?lon=${lon}&lat=${lat}&distance=${distance}&nResults=${nResults}`;
    const url: string = `${this.apiUrl}/sightings`;
    return this.http
      .get<Sighting[]>(url)
      .pipe(retry(1), catchError(this.handleError), tap(ret => this.storeSightings(ret)));
  }

  getUsers(): Observable<User[]> {
    const url: string = `${this.apiUrl}/users`;
    return this.http
      .get<User[]>(url)
      .pipe(retry(1), catchError(this.handleError), tap(ret => this.storeUsers(ret)));
  }

  getSpecies(): Observable<Species[]> {
    const url: string = `${this.apiUrl}/species`;
    return this.http
      .get<Species[]>(url)
      .pipe(retry(1), catchError(this.handleError), tap(ret => this.storeSpecies(ret)));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.message || error.statusText);
  }

  public getPhotoAddress(filename: string) {
    return `${this.apiUrl}/photos/${filename}`;
  }

  public getConfirmEmailAddress(email: string, token: string) {
    return `${this.apiUrl}/verify/?email=${email}&token=${token}`;
  }

  public saveUser(user: User): Observable<User> {
    const url: string = `${this.apiUrl}/users/${user._id}`;
    let body = new HttpParams({
      fromObject: {
        'location_friends': user.location_friends,
        'location_everyone': user.location_everyone,
        'friends': user.friends,
      }
    });
    let headers = new HttpHeaders()
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Authorization", `Bearer ${this.storage.getItem(STORAGE_PROP_TOKEN)}`)
      ;
    return this.http
      .put<User>(url, body, { headers })
      .pipe(
        retry(1), 
        catchError(this.handleError),
        tap((res) => {
          console.log(res);
        })
      );
  }

  public saveSighting(sighting: Sighting, photos: File[]): Observable<Sighting> {
    const url: string = sighting._id ? `${this.apiUrl}/sightings/${sighting._id}` : `${this.apiUrl}/sightings`;
    let formData: FormData = new FormData();
    formData.append('species', sighting.species);
    formData.append('visibility', sighting.visibility);
    formData.append('note', sighting.note);
    formData.append('lon', String(sighting.position[0]));
    formData.append('lat', String(sighting.position[1]));
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      formData.append('photos', photo);
    }
    let headers = new HttpHeaders()
      // .set("Content-Type", "multipart/form-data")
      .set("Authorization", `Bearer ${this.storage.getItem(STORAGE_PROP_TOKEN)}`);
    if (sighting._id)
      return this.http
        .put<Sighting>(url, formData, { headers })
        .pipe(
          retry(1), 
          catchError(this.handleError), 
          tap((sighting: Sighting) => {
            this._sightings.set(sighting._id, sighting);
            this.toastr.success('Sighting updated!');
          })
        );
    console.log('to post');
    return this.http
      .post<Sighting>(url, formData, { headers })
      .pipe(
        retry(1), 
        catchError(this.handleError),
        tap((sighting: Sighting) => {
          this._sightings.set(sighting._id, sighting);
          this.toastr.success('Sighting added!');
        })
      );
  }
}
