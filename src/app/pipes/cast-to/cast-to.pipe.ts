import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'castTo'
})
export class CastToPipe implements PipeTransform {

    transform<T>(value: any, clss: new (...args: any[]) => T): T {
        return value as T;
    }

}
