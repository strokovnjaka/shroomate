import { Component, AfterViewInit, Injector, ViewContainerRef, NgModuleRef, createNgModule, NgModule, Type } from '@angular/core';
import * as L from 'leaflet';
import { ShroomateDataService } from '../../services/shroomatedata.service';
import { GeopositionService } from "../../services/geoposition.service";
import { PopupComponent } from '../popup/popup.component';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

// @NgModule({ imports: [], declarations: [], exports: [], }) class ComponentModule { }; 
// const module: Type<ComponentModule> = (<any>ComponentModule);

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map: any;
  private currentPosition = new L.LatLng(46.0590820208, 14.489496);
  private currentZoom = 16;

  private initMap(): void {
    this.map = L.map('map', {
      center: this.currentPosition,
      zoom: this.currentZoom,
    });
    this.map.zoomControl.setPosition('bottomleft');
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  constructor(
    private shroomateDataService: ShroomateDataService, 
    private viewContainerRef: ViewContainerRef,
    private geoPositionService: GeopositionService,
    // public injector: Injector,
    ) { 
    this.getCurrentPosition();
  }

  ngAfterViewInit(): void { 
    this.initMap();
    this.getSightings();
  }

  private getSightings() {
    this.shroomateDataService.getUsers().subscribe(() => {
      this.shroomateDataService.getSpecies().subscribe(() => {
        this.shroomateDataService.getSightings().subscribe((sightings) => {
          sightings.forEach( s => {
            this.viewContainerRef.clear();
            const {instance, changeDetectorRef, location} = this.viewContainerRef.createComponent(PopupComponent);
            instance.sighting = s;
            changeDetectorRef.detectChanges();
            L.marker([s.position[1], s.position[0]]).bindPopup(location.nativeElement).addTo(this.map);
            this.viewContainerRef.clear();
          });
        });
      });
    });
  }

  private centerMap = (location: any) => {
    this.map.flyTo([location.coords.latitude, location.coords.longitude], 18);
  }

  private displayError = (error: any) => {
    console.log(error.message);
  };

  private noGeoLocation = () => {
    console.log("Web browser does not support geolocation!");
  };

  private getCurrentPosition = () => {
    this.geoPositionService.getGeoPosition(
      this.centerMap,
      this.displayError,
      this.noGeoLocation
    );
  }
}