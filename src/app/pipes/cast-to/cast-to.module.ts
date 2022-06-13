import { NgModule } from '@angular/core';
import { CastToPipe } from './cast-to.pipe';

@NgModule({
    imports: [],
    declarations: [CastToPipe],
    exports: [CastToPipe],
})

export class CastToPipeModule {

    static forRoot() {
        return {
            ngModule: CastToPipeModule,
            providers: [],
        };
    }
}