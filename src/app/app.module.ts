import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco-root.module';
import { MoodmeterService } from './services/api/moodmeter.service';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, TranslocoRootModule],
    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, MoodmeterService],
    bootstrap: [AppComponent],
})
export class AppModule { }
