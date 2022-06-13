import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
    version: string;

    constructor(private modalController: ModalController) {
        this.version = environment.version;
    }
    ngOnInit() {
    }

    async closeModal() {
        const close: string = "Modal Removed";
        await this.modalController.dismiss(close);
    }

}
