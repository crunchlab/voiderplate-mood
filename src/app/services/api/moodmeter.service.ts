import { Injectable } from '@angular/core';
import { Moodmeter } from '../../models/Moodmeter/Moodmeter';
import { find, flatten, get, pick, uniq } from 'lodash';
import { FeatureToMeterService } from '../transformer/feature-to-meter.service';
import { AttributeFilter } from '../../interfaces/attributeFilter.interface';
import { FieldMapping } from '../../interfaces/fieldMapping.interface';
import { FilterOperator } from '../../enums/filterOperator.enum';
import { environment } from '../../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class MoodmeterService {
    strutture: Moodmeter[] = [];
    mappings: FieldMapping[] = environment.filtersFieldMappings;


    constructor(private transformer: FeatureToMeterService) {
        this.strutture = [];
    }


    public getDetail(id: string | number): Moodmeter {
        let Moodmeter: Moodmeter = find(this.strutture, (s: Moodmeter) => s.nome == id) as Moodmeter;
        return Moodmeter;
    }

    /**
     *  Loops over all the strutture and returns distinct values for mapped properties
     * @param fieldMappings 
     * @returns 
     */
    public getFilterValues(): AttributeFilter[] {
        let filters: AttributeFilter[] = []
        filters = this.mappings.map((mapping: FieldMapping) => {
            let filter: AttributeFilter = { property: '', value: '', operator: FilterOperator.in };
            let values: any = this.strutture.map((s: Moodmeter) => {
                if (Array.isArray(mapping.properties)) {
                    return pick(s, mapping.properties);
                } else {
                    return get(s, mapping.properties)
                }
            });

            // must keep only true value if any
            if (mapping.type == "bool") {
                values = values.map(v => Object.keys(v));
            }
            filter.value = (uniq(flatten(values)) as string[]).sort();
            filter.property = mapping.field;
            return filter;
        });
        return filters;
    }
}
