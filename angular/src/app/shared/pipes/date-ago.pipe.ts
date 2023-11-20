import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo',
  pure: true,
})
export class DateAgoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      const s = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (s < 30)
        return 'just now';
      const intervals: { [index: string]: number} = {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1
      };
      for (const k in intervals) {
        const c = Math.floor(s / intervals[k]);
        if (c > 0)
          return `${c} ${k}${c===1 ? '' : 's'} ago`;
      }
    }
    return value;
  }
}
