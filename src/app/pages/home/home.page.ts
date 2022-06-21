import { Component, OnInit, ViewChild } from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import { get, isNil, uniq } from 'lodash';
import { Feature, FeatureCollection, Geometry } from 'geojson';
import SwiperCore, { Virtual } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { environment } from '../../../environments/environment';
import COLOR_MAP from '../../../assets/map-styles/data-points-colors.json';
import { FilterServiceProvider } from '../../services/filters/filter-service-provider.service';
import { FilterOperator } from '../../enums/filterOperator.enum';
import { MapUtilsService } from '../../services/utils/map-utils.service';
import { LngLatLike, MapboxEvent } from 'maplibre-gl';
import { ModalController } from '@ionic/angular';
import { AdvancedSearchPage } from '../advanced-search/advanced-search.page';
import { AttributeFilter } from '../../interfaces/attributeFilter.interface';
import { FeatureToMeterService } from '../../services/transformer/feature-to-meter.service';
import comuni from '../../../assets/data/comuni.json';
import { AboutPage } from '../about/about.page';

import { getDatabase, onValue, ref } from "firebase/database";



import { initializeApp } from "firebase/app";
import _ from 'lodash';
import { Moodmeter } from 'src/app/models/moodmeter/moodmeter';

SwiperCore.use([Virtual]);
@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    @ViewChild('searchContainer') searchContainer: HTMLDivElement;
    @ViewChild('mapContainer') mapContainer: HTMLDivElement;
    @ViewChild('aboutBtnContainer') aboutBtnContainer: HTMLDivElement;

    @ViewChild('swiperStrutture', { static: false }) swiperStrutture: SwiperComponent;

    public homeMap: maplibregl.Map;
    public selectedFeature: any = { lngLat: [0, 0] };
    public mapStyle = environment.mapStyle;
    public metersGeoJson: FeatureCollection = {
        "type": "FeatureCollection",
        "features": []
    };
    public comuneSelezionato: string = "";

    public meters: Moodmeter[] = [];
    public comuni: string[] = [];
    public moods: string[] = [];
    public slidesVisible: boolean = false;
    public moodSelezionati: string[] = [];
    private marker: maplibregl.Marker;

    firebaseConfig = {
        apiKey: "AIzaSyBrrHj-LuFs9IvKsNoHIq5a7-jJWK95QBk",
        authDomain: "moodmetervoid.firebaseapp.com",
        databaseURL: "https://moodmetervoid-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "moodmetervoid",
        storageBucket: "moodmetervoid.appspot.com",
        messagingSenderId: "45331867927",
        appId: "1:45331867927:web:cd34e172e861e40daf6f52"
    };
    public struttureCirclePaint: maplibregl.CirclePaint = {
        'circle-radius': {
            'base': 1.75,
            'stops': [
                [0, 2],
                [6, 4],
                [8, 5],
                [11, 6],
                [12, 12]
            ]
        },
        'circle-color': [
            'case',
            ['all',  ['==', ['get', 'mood'], "0"]],
            COLOR_MAP.mood["0"],
            ['all',  ['==', ['get', 'mood'], "1"]],
            COLOR_MAP.mood["1"],
            ['all',  ['==', ['get', 'mood'], "2"]],
            COLOR_MAP.mood["2"],

            COLOR_MAP.mood["3"]
        ],
        'circle-stroke-color': 'transparent',
        'circle-stroke-width': 1,
        'circle-opacity': [
            'case',
            ['!', ['boolean', ['feature-state', 'isHighlighted'], true]],
            0.5,
            1
        ]
    };
    public struttureLabelLayout: maplibregl.SymbolLayout =
        {
            "visibility": "visible",
            "text-field": ["get", "nome"
            ],
            "text-font": [
                "Open Sans Semibold",
                "Arial Unicode MS Bold"
            ],
            "text-offset": [
                0.5,
                0.5
            ],
            "text-anchor": "top",
            "text-size": [
                'interpolate', ['linear'], ['zoom'],
                10, 12,
                30, 30
            ]
        };
    public labelPaint: maplibregl.SymbolPaint = {

        "text-opacity": [
            'case',
            
            1,
            0
        ],
        "text-color": [
            'case',
            ['all',  ['==', ['get', 'mood'], "0"]],
            COLOR_MAP.mood["0"],
            ['all',  ['==', ['get', 'mood'], "1"]],
            COLOR_MAP.mood["1"],
            ['all',  ['==', ['get', 'mood'], "2"]],
            COLOR_MAP.mood["2"],
            COLOR_MAP.mood["3"]
        ]
    };

    constructor(private featureTransformer: FeatureToMeterService, private filterService: FilterServiceProvider, private mapUtils: MapUtilsService, public modalController: ModalController) {
    }


    ngOnInit(): void {
        this.openAboutModal();
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        let meters = this.metersGeoJson.features.map(feature => this.featureTransformer.featureToMeter(feature as Feature));

        this.moods = uniq(meters.map((m: Moodmeter) => `${m.mood}`)).sort();
        this.moodSelezionati = [...this.moods];
        this.filterService.addFilter({ property: 'mood', operator: FilterOperator.eq, value: this.moodSelezionati });




    }

    ngAfterViewInit(): void {
        //sets elements height to fill viewport even if app is not fullscreen
        (this.mapContainer as any).nativeElement.style.height = `${window.innerHeight}px`;
        (this.swiperStrutture as any).elementRef.nativeElement.style.top = `calc(${window.innerHeight}px - 26vh)`;
        (this.aboutBtnContainer as any).nativeElement.style.top = `calc(${window.innerHeight}px - 48px)`;
    }

    public mapLoaded(event: any) {
        this.homeMap = event;


        const app = initializeApp(this.firebaseConfig);

        // Initialize Realtime Database and get a reference to the service
        const db = getDatabase(app);
        const starCountRef = ref(db, '/');
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            // console.log(data);
         
            this.metersGeoJson.features = _.chain(data)
                .map((d, k) => {
                    let feat: Feature = {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                d.lon,
                                d.lat
                            ]
                        },
                        "properties": {
                            "nome": k,
                            "mood": d.mood+"",
                            "posizione": {
                                lat:d.lat,
                                lon:d.lon
                            }
                        }
                    };
                    return feat;
                })
                .value();
            
            this.metersGeoJson = { ...this.metersGeoJson };
            console.dir(this.metersGeoJson.features);
            this.meters = this.metersGeoJson.features.map((feature: Feature) => this.featureTransformer.featureToMeter(feature));
            
        });

        this.homeMap.on('mouseenter', 'strutture-layer', () => {
            this.homeMap.getCanvas().style.cursor = 'pointer';
        });
        this.homeMap.on('mouseleave', 'strutture-layer', () => {
            this.homeMap.getCanvas().style.cursor = '';

        });

        this.homeMap.on('mouseenter', 'strutture-label-layer', () => {
            this.homeMap.getCanvas().style.cursor = 'pointer';
        });
        this.homeMap.on('mouseleave', 'strutture-label-layer', () => {
            this.homeMap.getCanvas().style.cursor = '';

        });

        this.homeMap.on('click', 'strutture-layer', (e: any) => {
            let clickedFeature = get(e, 'features[0]', null);
            if (!isNil(clickedFeature)) {
                this.handleLayerClick(clickedFeature);
            }
        });
        this.homeMap.on('click', 'strutture-label-layer', (e: any) => {
            let clickedFeature = get(e, 'features[0]', null);
            if (!isNil(clickedFeature)) {
                this.handleLayerClick(clickedFeature);
            }
        });

        event.resize();
        let filterCoordinates: LngLatLike[] = this.metersGeoJson.features.map(f => (f.geometry as any).coordinates);
        this.fitResultsBBox(filterCoordinates);
    }


    public onDragEnd(evt: MapboxEvent<MouseEvent | TouchEvent | WheelEvent> & maplibregl.EventData) {
        // let isHuman = get(evt, 'originalEvent.isTrusted', true);
        // if (isHuman) {
        //     this.refreshSlides();
        // }

    }
    public mapZoomEnd(evt: MapboxEvent<MouseEvent | TouchEvent | WheelEvent> & maplibregl.EventData) {
        // let isHuman = get(evt, 'originalEvent.isTrusted', true);
        // if (isHuman) {
        //     this.refreshSlides();
        // }
    }
    private refreshSlides() {
        return;
    }


    private fitResultsBBox(filterCoordinates: maplibregl.LngLatLike[]) {
        let paddingObject = {
            top: (this.searchContainer as any).nativeElement.getBoundingClientRect().height + 100,
            left: 50,
            right: 50,
            bottom: (this.swiperStrutture as any).elementRef.nativeElement.getBoundingClientRect().height + 100
        };
        this.homeMap
            .fitBounds(this.mapUtils.getLatLngBounds(filterCoordinates), { padding: paddingObject });
    }

    private handleLayerClick(clickedFeature: Feature<Geometry, { [name: string]: any; }>) {
        let slideIdx = this.meters.findIndex(s => s.nome === clickedFeature.id);
        // this.setMarker(this.meters[slideIdx], (clickedFeature.geometry as any).coordinates);

        this.swiperStrutture.swiperRef.slideTo(slideIdx, 1200);
    }

    public searchComune(term: string = "", comune: string) {
        term = term.toLowerCase();
        return comune.toLowerCase().replace(' ', '').indexOf(term) > -1;

    }

    /**
     * zooms in map to selected city
     * @param searchTerm string: comune cercato
     */
    public onComuneChange(searchTerm: string = "") {
        let comune = comuni.find(c => c.name.toUpperCase() === searchTerm.toUpperCase());
        let filterCoordinates: LngLatLike = [comune.long, comune.lat];
        let easeOptions: any = {
            center: filterCoordinates,
            duration: 1200
        };
        if (this.homeMap.getZoom() < 13) {
            easeOptions.zoom = 13;
        }
        this.homeMap.easeTo(easeOptions);
    }

    public onChipClick(meter: Moodmeter) {
        console.log(meter);
        let slideIdx = this.meters.findIndex(s => s.nome === meter.nome);
        this.swiperStrutture.swiperRef.slideTo(slideIdx, 1200);
        let easeOptions: any = {
            center: [meter.posizione.lon, meter.posizione.lat],
            duration: 1200
        };
        if (this.homeMap.getZoom() < 13) {
            easeOptions.zoom = 13;
        }
        this.homeMap.easeTo(easeOptions);
    }

    private createMarker(color: string = 'red'): maplibregl.Marker {
        const el = document.createElement('div');
        el.className = 'marker-container';
        const markerDiv = document.createElement('div');
        markerDiv.className = 'marker';
        el.appendChild(markerDiv);
        let marker: maplibregl.Marker = new maplibregl.Marker({ color: color });
        return marker;
    }

    public onUserLocationClick() {
        let geoSuccess = evt => {
            // console.log(evt);
            let lng = evt.coords.longitude;
            let lat = evt.coords.latitude;

            let easeOptions: any = {
                center: [lng, lat],
                duration: 1200
            };
            if (this.homeMap.getZoom() < 13) {
                easeOptions.zoom = 13;
            }
            this.homeMap.easeTo(easeOptions);
        };
        let geoError = err => console.error(err);
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);

    }

    public onSlideChange(event: any) {
        let index = event.activeIndex;
        let struttura = this.meters[index];
        let geojsonPoint = this.metersGeoJson.features.find(f => f.properties.nome == struttura.nome);
        const coordinates = get(geojsonPoint, 'geometry.coordinates', []).slice();
        this.homeMap.panTo(coordinates, { duration: 250 });
    }


    // non necessario per moodmeter
    // private setMarker(meter: Moodmeter, coordinates: any) {
    //     if (this.marker) {
    //         this.marker.remove();
    //     }
    //     this.marker = this.createMarker();
    //     let color: string = get(COLOR_MAP, `mood[${meter.mood}]`, COLOR_MAP.mood["3"]);
    //     this.marker.getElement()
    //         .querySelector('svg g:nth-child(2)')
    //         .setAttribute("fill", color);
    //     this.marker
    //         .setLngLat(coordinates)
    //         .addTo(this.homeMap);
    // }

    async openSearchModal() {
        const modal = await this.modalController.create({
            component: AdvancedSearchPage,
            cssClass: 'monithon-about-modal'
        });

        modal.onDidDismiss().then((modalData) => {
            if (modalData !== null) {
                let filters: AttributeFilter[] = get(modalData, 'data.filters', []);
                filters.map((f: AttributeFilter) => this.filterService.addFilter(f));
                this.refreshSlides();
            }
        });

        return await modal.present();
    }

    async openAboutModal() {
        const modal = await this.modalController.create({
            component: AboutPage,
            cssClass: 'monithon-about-modal'
        });

        return await modal.present();
    }
}

