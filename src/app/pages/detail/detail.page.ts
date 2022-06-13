import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Struttura } from '../../models/struttura/struttura';
import { StrutturaService } from '../../services/api/struttura.service';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.page.html',
    styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
    struttura: Struttura;

    constructor(private strutturaService: StrutturaService, private actRoute: ActivatedRoute) {

    }

    ngOnInit() {
        this.actRoute.params.subscribe(params => {
            this.struttura = this.strutturaService.getDetail(params.id);
            console.log(this.struttura);
        });
    }
    goToSite() {
        let site: string = this.struttura.contatti["www"];
        let url: URL;
        try {
            if (site.match(/http[s]?:/)) {
                url = new URL(site);
            } else {
                url = new URL(`http://${site}`);
            }
            window.open(url, '_blank');
        } catch (e) {
            alert("indirizzo non valido!")
        }
    }
    writeTo() {
        window.open(`mailto:${this.struttura.contatti["mail"]}`, '_blank');
    }
    phoneTo() {
        window.open(`tel:${this.struttura.contatti["telefono"]}`, '_se_blanklf');
    }
}
