import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'langtoflag'
})
export class LangToFlagPipe implements PipeTransform {

    transform(value: string, ...args: unknown[]): string {
        let flag = '';

        switch (value) {
            case 'francese':
                flag = "assets/icons/svg-flags/fr.svg";
                break;
            case 'inglese':
                flag = "assets/icons/svg-flags/gb.svg";
                break;
            case 'spagnolo':
                flag = "assets/icons/svg-flags/es.svg";
                break;
            case 'tedesco':
                flag = "assets/icons/svg-flags/de.svg";
                break;

            default:
                break;
        }
        return flag;
    }

}
