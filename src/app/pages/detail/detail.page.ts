import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Moodmeter } from 'src/app/models/Moodmeter/Moodmeter';
import { Struttura } from '../../models/struttura/struttura';
import { MoodmeterService } from '../../services/api/moodmeter.service';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.page.html',
    styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
    struttura: Moodmeter;

    constructor(private strutturaService: MoodmeterService, private actRoute: ActivatedRoute) {

    }

    ngOnInit() {
        this.actRoute.params.subscribe(params => {
            this.struttura = this.strutturaService.getDetail(params.id);
            console.log(this.struttura);
        });
    }
    goToSite() {
     
    }
    writeTo() {
        
    }
    phoneTo() {
       
    }
}
