import { TestBed } from '@angular/core/testing';
import { isArray } from 'lodash';
import { Tipologia } from '../../enums/tipologia.enum';
import { FilterOperator } from '../../enums/filterOperator.enum';
import { AttributeFilter } from '../../interfaces/attributeFilter.interface';

import { FilterServiceProvider } from './filter-service-provider.service';

import * as strutture from '../../../assets/data/strutture.json';
import { Feature, Geometry } from 'geojson';


describe('FilterServiceProvider', () => {
    let service: FilterServiceProvider;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FilterServiceProvider);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should mantain current filters state', () => {
        expect(isArray(service.getFilters())).toBeTruthy();
        let filterAttribute: AttributeFilter = {
            property: 'tipologia',
            operator: FilterOperator.eq,
            value: Tipologia.ALBERGO
        };
        service.addFilter(filterAttribute);
        expect(service.filters.findIndex(a => a.property == filterAttribute.property)).toBeGreaterThan(-1);
        filterAttribute.value = Tipologia.BED_AND_BREAKFAST
        service.addFilter(filterAttribute);
        expect(service.filters.findIndex(a => a.property == filterAttribute.property)).toBeGreaterThan(-1);
    });

    it('should update filters array', () => {
        let filters: AttributeFilter[] = [
            {
                property: 'tipologia',
                operator: FilterOperator.eq,
                value: Tipologia.ALBERGO
            }, {
                property: 'comune',
                operator: FilterOperator.like,
                value: "JESO"
            }, {
                property: 'pnuovaClassificazioneLr11osizione',
                operator: FilterOperator.eq,
                value: 3
            }
        ];
        service.setFilters(filters);
        expect(service.getFilters()).toEqual(filters);
    });


    it('should apply current filters to data collection', () => {
        let filters: AttributeFilter[] = [
            {
                property: 'tipologia',
                operator: FilterOperator.eq,
                value: "ALBERGO"
            }, {
                property: 'comune',
                operator: FilterOperator.like,
                value: "JESO"
            }, {
                property: 'nuovaClassificazioneLr11',
                operator: FilterOperator.like,
                value: 3
            }
        ];
        service.setFilters(filters);
        let results: Feature<Geometry, { [name: string]: any; }>[] = service.applyFilters(strutture, "features.properties");
        expect(results.length).toBe(210);
    });

});
