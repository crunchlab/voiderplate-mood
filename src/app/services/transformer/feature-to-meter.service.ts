import { Injectable } from '@angular/core';
import { Feature, Geometry } from 'geojson';
import { FieldMapping } from '../../interfaces/fieldMapping.interface';
import { environment } from '../../../environments/environment';
import { get, pick } from "lodash";
import { Moodmeter } from 'src/app/models/moodmeter/moodmeter';
@Injectable({
    providedIn: 'root'
})
export class FeatureToMeterService {
    /** Object used to map feature properties to struttura fields */
    mappings: FieldMapping[] = environment.fieldMappings;

    /**
     * Maps the feature.properties elements to the field of a Struttura instance
     * @param feature: Feature
     */
    public featureToMeter(feature: Feature<Geometry, { [name: string]: any; }>): Moodmeter {

        let meter: Moodmeter = new Moodmeter();
        this.mappings.map((mapping: FieldMapping) => {
            if (Array.isArray(mapping.properties)) {
                meter[mapping.field] = pick((feature.properties || feature), mapping.properties);
            } else {
                meter[mapping.field] = get((feature.properties || feature), mapping.properties);
            }
        });
        return meter;
    }
    constructor() { }
}
