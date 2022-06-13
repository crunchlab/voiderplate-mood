import { FilterOperator } from "../enums/filterOperator.enum";

export interface AttributeFilter {
    property: string,
    operator: FilterOperator,
    value: string | number | boolean | Array<string>,
    selected?:boolean
}