import { Injectable } from '@angular/core';
import { remove, set, some } from 'lodash';
import { AttributeFilter } from '../../interfaces/attributeFilter.interface';
import * as jq from "json-query";
import { FilterOperator } from '../../enums/filterOperator.enum';
@Injectable({
    providedIn: 'root'
})
export class FilterServiceProvider {
    setFilters(filters: AttributeFilter[]) {
        this.filters = filters;
    }

    filters: AttributeFilter[] = [];
    /**
     * returns currentlty set filters
     */
    getFilters(): AttributeFilter[] {
        return this.filters;
    }

    /**
     * sets new filter in filters array
     * @param filterAttribute 
     */
    addFilter(filterAttribute: AttributeFilter) {
        let filterIndex: number = this.filters.findIndex((attr: AttributeFilter) => attr.property == filterAttribute.property);
        if (filterIndex > -1) {
            set(this.filters, `[${filterIndex}].value`, filterAttribute.value);
        } else {
            this.filters.push(filterAttribute);
        }
    }

    applyFilters(features: any, path: string): any {
        let results: any = [];
        let arrayFilters: AttributeFilter[] = [];
        let filterString: string = `${path}[*`;
        this.filters.map((filter: AttributeFilter, idx: number) => {

            switch (filter.operator) {
                case FilterOperator.eq:
                    filterString += `${filter.property}=${filter.value}`;
                    filterString += (idx < this.filters.length - 1) ? " & " : "";
                    break;
                case FilterOperator.gte:
                    filterString += `${filter.property}>${filter.value}`;
                    filterString += (idx < this.filters.length - 1) ? " & " : "";
                    break;
                case FilterOperator.gteq:
                    filterString += `${filter.property}>=${filter.value}`;
                    filterString += (idx < this.filters.length - 1) ? " & " : "";
                    break;
                case FilterOperator.lte:
                    filterString += `${filter.property}<${filter.value}`;
                    filterString += (idx < this.filters.length - 1) ? " & " : "";
                    break;
                case FilterOperator.lteq:
                    filterString += `${filter.property}<=${filter.value}`;
                    filterString += (idx < this.filters.length - 1) ? " & " : "";
                    break;
                case FilterOperator.like:
                    filterString += `${filter.property}~/.*${filter.value}.*/i`;
                    filterString += (idx < this.filters.length - 1) ? " & " : "";
                    break
                case FilterOperator.in:
                    arrayFilters.push(filter);
                    break
                default:
                    break;
            }


        });
        filterString += "]";
        results = jq.default(filterString, { data: features, allowRegexp: true }).value;
        arrayFilters.map((filter: AttributeFilter) => {
            remove(results, r => {
                //1. remove element if the current property is not included in selected values
                let removeIfNotIncluded: boolean = !(filter.value as any[]).includes(r[filter.property]);
                //2. remove element if selected values are keys with false values
                let removeIfNotTrue: boolean = !some(filter.value as any[], key=>r[key]);

                return removeIfNotIncluded && removeIfNotTrue;

            })
        });
        return results;
    }
    constructor() { }
}
