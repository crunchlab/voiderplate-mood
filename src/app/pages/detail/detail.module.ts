import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPageRoutingModule } from './detail-routing.module';

import { DetailPage } from './detail.page';
import { TranslocoModule } from '@ngneat/transloco';
import { BoolToWordPipeModule } from 'src/app/pipes/bool-to-word/bool-to-word.module';
import { LangToFlagPipeModule } from 'src/app/pipes/lang-to-flag/lang-to-flag.module';
import { FilterKeyValuePipeModule } from 'src/app/pipes/filter-key-value/filter-key-value.module';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DetailPageRoutingModule,
        TranslocoModule,
        BoolToWordPipeModule,
        LangToFlagPipeModule,
        FilterKeyValuePipeModule],
    declarations: [DetailPage]
})
export class DetailPageModule { }
