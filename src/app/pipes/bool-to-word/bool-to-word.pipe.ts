import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Pipe({
    name: 'boolToWord'
})
export class BoolToWordPipe implements PipeTransform {

    constructor(private transloco: TranslocoService) {

    }
    transform(value: boolean | number): string {
        return value ? this.transloco.translate('global.true') : this.transloco.translate('global.false');
    }

}
