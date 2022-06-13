import { NgModule } from '@angular/core';
import { LangToFlagPipe } from './lang-to-flag.pipe';

@NgModule({
    imports: [],
    declarations: [LangToFlagPipe],
    exports: [LangToFlagPipe],
})

export class LangToFlagPipeModule {

    static forRoot() {
        return {
            ngModule: LangToFlagPipeModule,
            providers: [],
        };
    }
}