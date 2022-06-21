import { FieldMapping } from "src/app/interfaces/fieldMapping.interface";

const featureToMeterMappings: FieldMapping[] = [
    {
        "field": "nome",
        "properties": "nome",
        "type": "string"
    },
    {
        "field": "mood",
        "properties": "mood",
        "type": "number"
    }
];

export default featureToMeterMappings;