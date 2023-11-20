import { Component } from '@angular/core';
import { Sighting } from '../../classes/sighting';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styles: ['img { width: 200px; }'],
})
export class PopupComponent {
  constructor() {}
  sighting!: Sighting;
}
