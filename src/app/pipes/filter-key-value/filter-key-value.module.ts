import { NgModule } from '@angular/core';
import { FilterKeyValuePipe } from './filter-key-value.pipe';

@NgModule({
    imports: [],
    declarations: [FilterKeyValuePipe],
    exports: [FilterKeyValuePipe],
})

export class FilterKeyValuePipeModule {

    static forRoot() {
        return {
            ngModule: FilterKeyValuePipeModule,
            providers: [],
        };
    }
}