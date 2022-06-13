import { FieldMapping } from "src/app/interfaces/fieldMapping.interface";

const featureToStrutturaMappings: FieldMapping[] = [
    {
        "field": "trasporti",
        "properties": ["aeroporto", "autostrada", "stazioneFs"],
        "type": "bool"
    },
    {
        "field": "posizione",
        "properties": ["centroStorico", "periferia", "zonaFiera", "collinare", "lago", "mare"],
        "type": "bool"
    },
    {
        "field": "servizi",
        "properties": ["ristorante", "ariaCondizionata", "parcheggio"],
        "type": "bool"
    },
    {
        "field": "wellness",
        "properties": ["termale", "fitness", "sauna", "piscina", "piscinaCoperta", "solarium", "impiantiRisalita"],
        "type": "bool"
    },
    {
        "field": "lingue",
        "properties": ["inglese", "spagnolo", "tedesco", "francese"],
        "type": "bool"
    },
    {
        "field": "contatti",
        "properties": ["www", "email", "fax", "telefono"],
        "type": "link"
    },
    {
        "field": "accoglienza",
        "properties": ["accessoDisabili", "giochiBimbi", "animaliAmmessi"],
        "type": "bool"
    },
    { "field": "cap", "properties": "cap", "type": "string" },
    { "field": "zona", "properties": "zona", "type": "string" },
    { "field": "comune", "properties": "comune", "type": "string" },
    { "field": "stelle", "properties": "stelle", "type": "string" },
    { "field": "interno", "properties": "interno", "type": "string" },
    { "field": "localita", "properties": "localita", "type": "string" },
    { "field": "categoria", "properties": "categoria", "type": "string" },
    { "field": "indirizzo", "properties": "indirizzo", "type": "string" },
    { "field": "provincia", "properties": "provincia", "type": "string" },
    { "field": "tipologia", "properties": "tipologia", "type": "string" },
    { "field": "giochiBimbi", "properties": "giochiBimbi", "type": "bool" },
    { "field": "altriServizi", "properties": "altriServizi", "type": "string" },
    { "field": "denominazione", "properties": "denominazione", "type": "string" },
    { "field": "numeroCivico", "properties": "numeroCivico", "type": "string" },
    { "field": "animaliAmmessi", "properties": "animaliAmmessi", "type": "bool" },
    { "field": "accessoDisabili", "properties": "accessoDisabili", "type": "bool" },
    { "field": "chiusuraTemporanea", "properties": "chiusuraTemporanea", "type": "bool" },
    { "field": "dataUltimaModifica", "properties": "dataUltimaModifica", "type": "string" },
    { "field": "tipologiaSecondaria", "properties": "tipologiaSecondaria", "type": "string" },
    { "field": "codiceIdentificativo", "properties": "codiceIdentificativo", "type": "int" },
    { "field": "nuovaClassificazioneLr11", "properties": "nuovaClassificazioneLr11", "type": "string" }

];

export default featureToStrutturaMappings;