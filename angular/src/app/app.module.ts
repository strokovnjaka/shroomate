import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { MapComponent } from './shared/components/map/map.component';
import { FrameworkComponent } from './shared/components/framework/framework.component';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { DateAgoPipe } from './shared/pipes/date-ago.pipe';
import { UserNamePipe } from './shared/pipes/user-name.pipe';
import { SpeciesNamePipe } from './shared/pipes/species-name.pipe';
import { AppRoutingModule } from './modules/app-routing/app-routing.module';
import { PopupComponent } from './shared/components/popup/popup.component';
import { PhotoUrlPipe } from './shared/pipes/photo-url.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from './shared/components/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './shared/components/login/login.component';
import { ToastrModule } from 'ngx-toastr';
import { SettingsComponent } from './shared/components/settings/settings.component';
import { SightingComponent } from './shared/components/sighting/sighting.component';

@NgModule({
  declarations: [
    MapComponent,
    FrameworkComponent,
    NavigationComponent,
    DateAgoPipe,
    SpeciesNamePipe,
    UserNamePipe,
    PopupComponent,
    PhotoUrlPipe,
    SignupComponent,
    LoginComponent,
    SettingsComponent,
    SightingComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    ToastrModule.forRoot({
      // disableTimeOut: true,
      preventDuplicates: true,
      // closeButton: true,
      // tapToDismiss: false,
      positionClass: 'toast-bottom-right',
      enableHtml: true,
      maxOpened: 7,
      autoDismiss: true,
      countDuplicates: true,
      includeTitleDuplicates: true,
    }),
  ],
  providers: [
    DateAgoPipe,
    SpeciesNamePipe,
    UserNamePipe,
  ],
  bootstrap: [FrameworkComponent]
})
export class AppModule { }
