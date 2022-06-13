import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterkeyvalue'
})
export class FilterKeyValuePipe implements PipeTransform {

    transform(value: any[], ...args: unknown[]): any {
        return value.filter(el => el.value);
    }

}
