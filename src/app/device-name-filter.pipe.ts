import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';
import { debounceTime, delay } from 'rxjs/internal/operators';

@Pipe({
  name: 'deviceNameFilter'
})
export class DeviceNameFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return of(value);
    }
    const filtered =  value.filter((val) => {
      const included = (val.name.toLocaleLowerCase().includes(args));
      return included;
    });
    return of(filtered);
  }

}
