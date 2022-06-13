import { TestBed } from '@angular/core/testing';
import { Feature } from 'geojson';
import { get, pick } from 'lodash';
import { Struttura } from '../../models/struttura/struttura';
import { FeatureToStrutturaService } from './feature-to-struttura.service';

describe('FeatureToStrutturaService', () => {
    let transformer: FeatureToStrutturaService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        transformer = TestBed.inject(FeatureToStrutturaService);
    });

    it('should be created', () => {
        expect(transformer).toBeTruthy();
    });

    it('should have a mapping object', () => {
        expect(transformer.mappings).toBeDefined();

    });

    it('should transform a geojson feature to an object of type Struttura', () => {
        let feature: Feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    12.6053846,
                    45.4905415
                ]
            },
            "id": "316af9f8-32e0-40a2-9539-44847abd16b6",
            "properties": {
                "cap": 30016,
                "fax": "6624.27.00",
                "lago": "0",
                "mare": "1",

                "zona": "jesolo-eraclea",
                "email": "info@hotel-international.it",
                "sauna": "0",
                "comune": "JESOLO",
                "stelle": "2 **",
                "fitness": "0",
                "inglese": "1",
                "interno": "",
                "piscina": "0",
                "tedesco": "1",
                "termale": "0",
                "francese": "1",
                "localita": "LIDO DI JESOLO",
                "www": "www.hotel-international.it",
                "solarium": "0",
                "spagnolo": "1",
                "telefono": "6609.47.00",
                "toponimo": "VIA MONTEVERDI,5,Jesolo,VENEZIA",
                "aeroporto": "0",
                "categoria": null,
                "collinare": "0",
                "indirizzo": "VIA MONTEVERDI",
                "periferia": "0",
                "provincia": "VENEZIA",
                "tipologia": "ALBERGO",
                "autostrada": "0",
                "parcheggio": "1",
                "ristorante": "1",
                "zonaFiera": "0",
                "stazioneFs": "0",
                "giochiBimbi": "0",
                "altriServizi": "tv sat; wi-fi",
                "denominazione": "INTERNATIONAL",
                "numeroCivico": "5",
                "centroStorico": "0",
                "animaliAmmessi": "1",
                "piscinaCoperta": "0",
                "salaConferenze": "0",
                "ariaCondizionata": "0",
                "impiantiRisalita": "0",
                "accessoDisabili": "0",
                "chiusuraTemporanea": "0",
                "dataUltimaModifica": "02/11/2017",
                "tipologiaSecondaria": "Albergo",
                "codiceIdentificativo": 42409,
                "nuovaClassificazioneLr11": "2 **"
            }
        };
        let expectedStruttura: Struttura = new Struttura();
        expectedStruttura.trasporti = pick(feature.properties, ["aeroporto", "autostrada", "stazioneFs"]);
        expectedStruttura.posizione = pick(feature.properties, ["centroStorico", "periferia", "zonaFiera", "collinare", "lago", "mare"]);
        expectedStruttura.servizi = pick(feature.properties, ["ristorante", "ariaCondizionata", "parcheggio"]);
        expectedStruttura.wellness = pick(feature.properties, ["termale", "fitness", "sauna", "piscina", "piscinaCoperta", "solarium", "impiantiRisalita"]);
        expectedStruttura.lingue = pick(feature.properties, ["inglese", "spagnolo", "tedesco", "francese"]);
        expectedStruttura.contatti = pick(feature.properties, ["www", "email", "fax", "telefono"]);

        expectedStruttura.cap = get(feature.properties, 'cap');
        expectedStruttura.zona = get(feature.properties, 'zona');
        expectedStruttura.comune = get(feature.properties, 'comune');
        expectedStruttura.stelle = get(feature.properties, 'stelle');
        expectedStruttura.interno = get(feature.properties, 'interno');
        expectedStruttura.localita = get(feature.properties, 'localita');
        expectedStruttura.categoria = get(feature.properties, 'categoria');
        expectedStruttura.indirizzo = get(feature.properties, 'indirizzo');
        expectedStruttura.provincia = get(feature.properties, 'provincia');
        expectedStruttura.tipologia = get(feature.properties, 'tipologia');
        expectedStruttura.giochiBimbi = get(feature.properties, 'giochiBimbi');
        expectedStruttura.altriServizi = get(feature.properties, 'altriServizi');
        expectedStruttura.denominazione = get(feature.properties, 'denominazione');
        expectedStruttura.numeroCivico = get(feature.properties, 'numeroCivico');
        expectedStruttura.animaliAmmessi = get(feature.properties, 'animaliAmmessi');
        expectedStruttura.accessoDisabili = get(feature.properties, 'accessoDisabili');
        expectedStruttura.chiusuraTemporanea = get(feature.properties, 'chiusuraTemporanea');
        expectedStruttura.dataUltimaModifica = get(feature.properties, 'dataUltimaModifica');
        expectedStruttura.tipologiaSecondaria = get(feature.properties, 'tipologiaSecondaria');
        expectedStruttura.codiceIdentificativo = get(feature.properties, 'codiceIdentificativo');
        expectedStruttura.nuovaClassificazioneLr11 = get(feature.properties, 'nuovaClassificazioneLr11');
        let struttura: Struttura = transformer.featureToStruttura(feature);
        expect(struttura).toBeDefined();
        expect(struttura).toMatchObject(expectedStruttura);
        
    });
});
