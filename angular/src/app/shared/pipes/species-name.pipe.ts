import { Pipe, PipeTransform } from '@angular/core';
import { ShroomateDataService } from '../services/shroomatedata.service';

@Pipe({
  name: 'speciesName'
})
export class SpeciesNamePipe implements PipeTransform {

  constructor(private shroomateDataService: ShroomateDataService) {}

  transform(value: string, ...args: unknown[]): string {
    return value && this.shroomateDataService.species?.get(value)?.latin_name || value;
  }

}
