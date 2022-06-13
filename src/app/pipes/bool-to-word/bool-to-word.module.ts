import { NgModule } from '@angular/core';
import { BoolToWordPipe } from './bool-to-word.pipe';

@NgModule({
    imports: [],
    declarations: [BoolToWordPipe],
    exports: [BoolToWordPipe],
})

export class BoolToWordPipeModule {

    static forRoot() {
        return {
            ngModule: BoolToWordPipeModule,
            providers: [],
        };
    }
}