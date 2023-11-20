import { Pipe, PipeTransform } from '@angular/core';
import { ShroomateDataService } from '../services/shroomatedata.service';

@Pipe({
  name: 'userName'
})
export class UserNamePipe implements PipeTransform {

  constructor(private shroomateDataService: ShroomateDataService) { }

  transform(value: string, ...args: unknown[]): string {
    return value && this.shroomateDataService.users?.get(value)?.name || value;
  }

}
