import { Injectable } from '@angular/core';
import { LngLatBoundsLike, LngLatLike } from 'maplibre-gl';

@Injectable({
    providedIn: 'root'
})
export class MapUtilsService {

    constructor() { }

    public getLatLngBounds(latLngObjs: maplibregl.LngLatLike[] = []): LngLatBoundsLike {
        let x0: number, x1: number, y0: number, y1: number;
        latLngObjs.map(pair => {
            if (x0 == null) {
                x0 = x1 = pair[0];
                y0 = y1 = pair[1];
            } else {
                if (pair[0] > x1) x1 = pair[0];
                if (pair[0] < x0) x0 = pair[0];
                if (pair[1] > y1) y1 = pair[1];
                if (pair[1] < y0) y0 = pair[1];
            }
        });

        let NE: LngLatLike = [x1, y1];
        let SW: LngLatLike = [x0, y0];
        return [NE, SW];

    }
}
