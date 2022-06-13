import { FieldMapping } from "../app/interfaces/fieldMapping.interface";

const filtersFieldMappings: FieldMapping[] = [
    { "field": "tipologia", "properties": "tipologia", "type": "string" },
    { "field": "nuovaClassificazioneLr11", "properties": "nuovaClassificazioneLr11", "type": "string" },
    { "field": "posizione", "properties": "posizione", "type": "bool" },
    { "field": "lingue", "properties": "lingue", "type": "bool" },
    {
        "field": "accoglienza",
        "properties": "accoglienza",
        "type": "bool"
    },
];

export default filtersFieldMappings;
