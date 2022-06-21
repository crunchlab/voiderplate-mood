import featureToStrutturaMappings from "src/mappings/featureToStrutturaMappings";
import filtersFieldMappings from "../mappings/filtersFieldMappings";
import { FullSemVer } from "../assets/version.json";

export const environment = {
    production: true,
    fieldMappings: featureToStrutturaMappings,
    filtersFieldMappings: filtersFieldMappings,
    mapStyle: './assets/map-styles/roadmap-style.json',
    dataPointColorMap: './assets/map-styles/data-points-colors.json',
    version: FullSemVer

};
