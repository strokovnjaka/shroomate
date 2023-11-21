import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ShroomateDataService } from '../../services/shroomatedata.service';
import { Sighting } from '../../classes/sighting';
import { Species } from '../../classes/species';
import { AuthenticationService } from '../../services/authentication.service';
import { Photo } from '../../classes/photo';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-sighting',
  templateUrl: 'sighting.component.html',
  styles: ['.preview { max-width: 100%; max-height: 150px }']
})
export class SightingComponent {
  constructor(
    private shroomateDataService: ShroomateDataService,
    private authenticationService: AuthenticationService,
    public activeModal: NgbActiveModal,
    private connectionService: ConnectionService,
  ) {
    this.sighting.position[0] += Math.random() * 0.0005;
    this.sighting.position[1] += Math.random() * 0.0005;
  }

  selectedFiles: File[] = [];
  formError: string = '';
  previews: string[] = [];
  protected species: Species[] = Array.from(this.shroomateDataService.species.values());
  public sighting: Sighting = {
    _id: '',
    note: '',
    user: this.authenticationService.getCurrentUser()._id,
    timestamp: new Date(),
    visibility: 'everyone',
    species: this.species[0]._id,
    position: [14.4898288499807, 46.05790685420475],
    photos: [], // new Array<Photo>(),
  };
  protected title: string = this.sighting._id ? "Update sighting" : 'New sighting!';

  private isFormValid(): boolean {
    return !!(this.sighting.visibility && this.sighting.species && this.sighting.timestamp && this.sighting.position);
  }

  selectFiles(event: any): void {
    let files = event.target.files;
    this.previews = [];
    this.selectedFiles = [];
    if (files && files[0]) {
      const numberOfFiles = files.length < 3 ? files.length : 3;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = ((f) => { 
          return (e: any) => {
            console.log(f);
            console.log(e.target.result);
            this.previews.push(e.target.result);
            this.selectedFiles.push(f);
          }
        })(files[i]);
        reader.readAsDataURL(files[i]);
      }
    }
  }

  save() {
    this.formError = '';
    if (!this.isFormValid) {
      this.formError = 'Fill in the required fields!'
      return;
    }
    if (this.selectedFiles.length < 1 || this.selectedFiles.length > 3) {
      this.formError = 'Add one to three photos of the sighting!'
      return;
    }
    this.shroomateDataService
      .saveSighting(this.sighting, this.selectedFiles)
      .subscribe( () => {
        this.activeModal.dismiss('saved sighting');
        // TODO: redo markers?
      });
  }

  public isConnected(): boolean {
    return this.connectionService.isConnected;
  }
}
