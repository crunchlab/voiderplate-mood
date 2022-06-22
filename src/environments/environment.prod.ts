import featureToMeterMappings from "src/mappings/featureToStrutturaMappings";
import filtersFieldMappings from "../mappings/filtersFieldMappings";
import version from "../assets/version.json";

export const environment = {
    production: true,
    fieldMappings: featureToMeterMappings,
    filtersFieldMappings: filtersFieldMappings,
    mapStyle: './assets/map-styles/roadmap-style.json',
    dataPointColorMap: './assets/map-styles/data-points-colors.json',
    version: version.FullSemVer

};
