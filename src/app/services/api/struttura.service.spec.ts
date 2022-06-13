import { TestBed } from '@angular/core/testing';
import { intersection } from 'lodash';
import { FilterOperator } from '../../enums/filterOperator.enum';
import { AttributeFilter } from '../../interfaces/attributeFilter.interface';
import { FieldMapping } from '../../interfaces/fieldMapping.interface';

import { StrutturaService } from './struttura.service';

describe('StrutturaService', () => {
  let service: StrutturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrutturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should create an Attribute Filter array with desired properties distinct values', () => {
      let filters:AttributeFilter[]=[];
      let mappings: FieldMapping[] = [
          { "field": "tipologia", "properties": "tipologia", "type": "string" },
          { "field": "nuovaClassificazioneLr11", "properties": "nuovaClassificazioneLr11", "type": "string" },
          { "field": "posizione", "properties": "posizione", "type": "bool" },
          { "field": "trasporti", "properties": "trasporti", "type": "bool" },
          { "field": "accoglienza", "properties": ["accessoDisabili", "giochiBimbi", "animaliAmmessi"], "type": "bool" },
          { "field": "lingue", "properties": "lingue", "type": "bool" },
      ];
      let expectedValues = ["AFFITTACAMERE", "AGRITURISMO", "ALBERGO", "ALTRA RICETTIVITA'", "APPARTAMENTO", "BED AND BREAKFAST", "CAMPEGGIO", "COUNTRY HOUSE", "RESIDENCE"];
      filters = service.getFilterValues();
      let mapping :AttributeFilter = filters[0];
      expect(mapping.operator).toBe(FilterOperator.in);
      expect(mapping.property).toBe("tipologia");
      expect(intersection((mapping.value as string[]), expectedValues).length).toBe(expectedValues.length);


      let lr11expectedValues = ["1","2","3","4","5"];
      let lr11: AttributeFilter = filters[1];
      expect(lr11.operator).toBe(FilterOperator.in);
      expect(lr11.property).toBe("nuovaClassificazioneLr11");
      expect(intersection((lr11.value as string[]), lr11expectedValues).length).toBe(lr11expectedValues.length);

      console.log(filters);
  });
  
});
