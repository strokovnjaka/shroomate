import { Pipe, PipeTransform } from '@angular/core';
import { ShroomateDataService } from '../services/shroomatedata.service';

@Pipe({
  name: 'photoUrl'
})
export class PhotoUrlPipe implements PipeTransform {

  constructor(private shroomateDataService: ShroomateDataService) { }

  transform(value: string, ...args: unknown[]): unknown {
    return value && this.shroomateDataService.getPhotoAddress(value) || value;
  }

}
