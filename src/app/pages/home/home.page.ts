import { Component, OnInit, ViewChild } from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import { get, isNil, remove, uniq } from 'lodash';
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
import distance from '@turf/distance';
import struttureGeoJson from '../../../assets/data/strutture.json';
import { Struttura } from '../../models/struttura/struttura';
import { FeatureToStrutturaService } from '../../services/transformer/feature-to-struttura.service';
import comuni from '../../../assets/data/comuni.json';
import { AboutPage } from '../about/about.page';
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
    public struttureGeoJson: FeatureCollection = (struttureGeoJson as FeatureCollection);
    public comuneSelezionato: string = "";

    public strutture: Struttura[] = [];
    public comuni: string[] = [];
    public tipologie: string[] = [];
    public slidesVisible: boolean = false;
    public tipologieSelezionate: string[] = [];
    private marker: maplibregl.Marker;

    public struttureCirclePaint: maplibregl.CirclePaint = {
        'circle-radius': {
            'base': 1.75,
            'stops': [
                [0, 0],
                [6, 1],
                [8, 2],
                [11, 4],
                [12, 5]
            ]
        },
        'circle-color': [
            'case',
            ['all', ['boolean', ['feature-state', 'isMatch'], true], ['==', ['get', 'tipologia'], "ALTRA_RICETTIVITA"]],
            COLOR_MAP.tipologia.ALTRA_RICETTIVITA,
            ['all', ['boolean', ['feature-state', 'isMatch'], true], ['==', ['get', 'tipologia'], "ALBERGO"]],
            COLOR_MAP.tipologia.ALBERGO,
            ['all', ['boolean', ['feature-state', 'isMatch'], true], ['==', ['get', 'tipologia'], "APPARTAMENTO"]],
            COLOR_MAP.tipologia.APPARTAMENTO,
            ['all', ['boolean', ['feature-state', 'isMatch'], true], ['==', ['get', 'tipologia'], "AGRITURISMO"]],
            COLOR_MAP.tipologia.AGRITURISMO,
            ['all', ['boolean', ['feature-state', 'isMatch'], true], ['==', ['get', 'tipologia'], "BED AND BREAKFAST"]],
            COLOR_MAP.tipologia.BED_AND_BREAKFAST,
            ['all', ['boolean', ['feature-state', 'isMatch'], true], ['==', ['get', 'tipologia'], "CAMPEGGIO"]],
            COLOR_MAP.tipologia.CAMPEGGIO,
            ['all', ['boolean', ['feature-state', 'isMatch'], true], ['==', ['get', 'tipologia'], "AFFITTACAMERE"]],
            COLOR_MAP.tipologia.AFFITTACAMERE,
            ['all', ['boolean', ['feature-state', 'isMatch'], true], ['==', ['get', 'tipologia'], "COUNTRY HOUSE"]],
            COLOR_MAP.tipologia.COUNTRY_HOUSE,
            ['all', ['boolean', ['feature-state', 'isMatch'], true], ['==', ['get', 'tipologia'], "RESIDENCE"]],
            COLOR_MAP.tipologia.RESIDENCE,
            'transparent'
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
            "text-field": ["get", "denominazione"
            ],
            "text-font": [
                "Open Sans Semibold",
                "Arial Unicode MS Bold"
            ],
            "text-offset": [
                0,
                0.5
            ],
            "text-anchor": "top",
            "text-size": [
                'interpolate', ['linear'], ['zoom'],
                10, 10,
                30, 24
            ]
        };
    public labelPaint: maplibregl.SymbolPaint = {

        "text-opacity": [
            'case',
            ['boolean', ['feature-state', 'isMatch'], true],
            1,
            0
        ],
        "text-color": [
            'case',
            ['all', ['boolean', ['feature-state', 'isMatch'], true], ['==', ['get', 'tipologia'], "ALTRA_RICETTIVITA"]],
            COLOR_MAP.tipologia.ALTRA_RICETTIVITA,
            ['all', ['boolean', ['feature-state', 'isMatch'], true], ['==', ['get', 'tipologia'], "ALBERGO"]],
            COLOR_MAP.tipologia.ALBERGO,
            ['all', ['boolean', ['feature-state', 'isMatch'], true], ['==', ['get', 'tipologia'], "APPARTAMENTO"]],
            COLOR_MAP.tipologia.APPARTAMENTO,
            ['all', ['boolean', ['feature-state', 'isMatch'], true], ['==', ['get', 'tipologia'], "AGRITURISMO"]],
            COLOR_MAP.tipologia.AGRITURISMO,
            ['all', ['boolean', ['feature-state', 'isMatch'], true], ['==', ['get', 'tipologia'], "BED AND BREAKFAST"]],
            COLOR_MAP.tipologia.BED_AND_BREAKFAST,
            ['all', ['boolean', ['feature-state', 'isMatch'], true], ['==', ['get', 'tipologia'], "CAMPEGGIO"]],
            COLOR_MAP.tipologia.CAMPEGGIO,
            ['all', ['boolean', ['feature-state', 'isMatch'], true], ['==', ['get', 'tipologia'], "AFFITTACAMERE"]],
            COLOR_MAP.tipologia.AFFITTACAMERE,
            ['all', ['boolean', ['feature-state', 'isMatch'], true], ['==', ['get', 'tipologia'], "COUNTRY HOUSE"]],
            COLOR_MAP.tipologia.COUNTRY_HOUSE,
            ['all', ['boolean', ['feature-state', 'isMatch'], true], ['==', ['get', 'tipologia'], "RESIDENCE"]],
            COLOR_MAP.tipologia.RESIDENCE,
            COLOR_MAP.tipologia.ALTRA_RICETTIVITA,
        ]
    };

    constructor(private featureTransformer: FeatureToStrutturaService, private filterService: FilterServiceProvider, private mapUtils: MapUtilsService, public modalController: ModalController) {
    }


    ngOnInit(): void {
        this.openAboutModal();
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        let strutture = this.struttureGeoJson.features.map(feature => this.featureTransformer.featureToStruttura(feature as Feature));
        this.comuni = uniq(strutture.map((s: Struttura) => s.comune)).sort();
        this.tipologie = uniq(strutture.map((s: Struttura) => s.tipologia)).sort();
        this.tipologieSelezionate = [...this.tipologie];
        this.filterService.addFilter({ property: 'tipologia', operator: FilterOperator.in, value: this.tipologieSelezionate });

    }

    ngAfterViewInit(): void {
        //sets elements height to fill viewport even if app is not fullscreen
        (this.mapContainer as any).nativeElement.style.height = `${window.innerHeight}px`;
        (this.swiperStrutture as any).elementRef.nativeElement.style.top = `calc(${window.innerHeight}px - 26vh)`;
        (this.aboutBtnContainer as any).nativeElement.style.top = `calc(${window.innerHeight}px - 48px)`;
    }

    public mapLoaded(event: any) {
        this.homeMap = event;

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
            if (!isNil(clickedFeature) && clickedFeature.state.isMatch) {
                this.handleLayerClick(clickedFeature);
            }
        });
        this.homeMap.on('click', 'strutture-label-layer', (e: any) => {
            let clickedFeature = get(e, 'features[0]', null);
            if (!isNil(clickedFeature) && clickedFeature.state.isMatch) {
                this.handleLayerClick(clickedFeature);
            }
        });

        event.resize();
        let filterCoordinates: LngLatLike[] = this.struttureGeoJson.features.map(f => (f.geometry as any).coordinates);
        this.fitResultsBBox(filterCoordinates);
    }


    public onDragEnd(evt: MapboxEvent<MouseEvent | TouchEvent | WheelEvent> & maplibregl.EventData) {
        let isHuman = get(evt, 'originalEvent.isTrusted', true);
        if (isHuman) {
            this.refreshSlides();
        }

    }
    public mapZoomEnd(evt: MapboxEvent<MouseEvent | TouchEvent | WheelEvent> & maplibregl.EventData) {
        let isHuman = get(evt, 'originalEvent.isTrusted', true);
        if (isHuman) {
            this.refreshSlides();
        }
    }
    private refreshSlides() {
        let mapCenter = [this.homeMap.getCenter().lng, this.homeMap.getCenter().lat];
        let renderedFeatures: maplibregl.MapboxGeoJSONFeature[] = this.homeMap
            .queryRenderedFeatures(null, { "layers": ["strutture-layer"] })
            .sort((f1: any, f2: any) => {
                let f1ToCenter = distance(mapCenter, f1.geometry.coordinates);
                let f2ToCenter = distance(mapCenter, f2.geometry.coordinates);
                return f1ToCenter - f2ToCenter;
                // return distance(f1.geometry.coordinates, f2.geometry.coordinates);
            })
        let filteredFeatures = this.filterService.applyFilters(renderedFeatures, "properties");
        let filterdIds: number[] = filteredFeatures.map(f => f.codiceIdentificativo);

        renderedFeatures.map(f => {
            let isMatch = filterdIds.includes(f.properties.codiceIdentificativo);
            this.homeMap.setFeatureState({ source: 'strutture', id: f.properties.codiceIdentificativo }, { "isMatch": isMatch });
        });
        if (this.homeMap.getZoom() > 10) {
            this.strutture = filteredFeatures
                .map((feature: Feature) => this.featureTransformer.featureToStruttura(feature));

            this.swiperStrutture.swiperRef.virtual.removeAllSlides();
            this.swiperStrutture.swiperRef.updateSlides();
            this.swiperStrutture.swiperRef.virtual.update(true);
            if (this.strutture.length) {
                this.swiperStrutture.swiperRef.slideTo(0);
                let coordinates: LngLatLike = (renderedFeatures.find(f => f.properties.codiceIdentificativo == this.strutture[0].codiceIdentificativo).geometry as any).coordinates;
                this.setMarker(this.strutture[0], coordinates);

            }

        } else {
            this.strutture = [];
        }
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
        let slideIdx = this.strutture.findIndex(s => s.codiceIdentificativo === clickedFeature.id);
        this.setMarker(this.strutture[slideIdx], (clickedFeature.geometry as any).coordinates);

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

    public onChipClick(tipologia: string) {
        if (this.tipologieSelezionate.includes(tipologia)) {
            remove(this.tipologieSelezionate, t => t == tipologia);
            if (!this.tipologieSelezionate.length) {
                this.tipologieSelezionate = [...this.tipologie];
            }
        } else {
            this.tipologieSelezionate.push(tipologia);
        }
        this.filterService.addFilter({ property: 'tipologia', operator: FilterOperator.in, value: this.tipologieSelezionate });
        this.refreshSlides();
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
        let struttura = this.strutture[index];
        let geojsonPoint = this.struttureGeoJson.features.find(f => f.properties.codiceIdentificativo == struttura.codiceIdentificativo);
        const coordinates = get(geojsonPoint, 'geometry.coordinates', []).slice();
        this.setMarker(struttura, coordinates);
        this.homeMap.panTo(coordinates, { duration: 250 });
    }


    private setMarker(struttura: Struttura, coordinates: any) {
        if (this.marker) {
            this.marker.remove();
        }
        this.marker = this.createMarker();
        let color: string = get(COLOR_MAP, `tipologia[${struttura.tipologia.replaceAll(' ', '_').toUpperCase()}]`, COLOR_MAP.tipologia.ALTRA_RICETTIVITA);
        this.marker.getElement()
            .querySelector('svg g:nth-child(2)')
            .setAttribute("fill", color);
        this.marker
            .setLngLat(coordinates)
            .addTo(this.homeMap);
    }

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

