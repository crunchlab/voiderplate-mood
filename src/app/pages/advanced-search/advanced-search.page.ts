import { Component, OnInit } from '@angular/core';
import { FilterServiceProvider } from '../../services/filters/filter-service-provider.service';
import { StrutturaService } from '../../services/api/struttura.service';
import { AttributeFilter } from '../../interfaces/attributeFilter.interface';
import { cloneDeep, isNil, remove } from 'lodash';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-advanced-search',
    templateUrl: './advanced-search.page.html',
    styleUrls: ['./advanced-search.page.scss'],
})
export class AdvancedSearchPage implements OnInit {

    public filters: AttributeFilter[] = [];
    public selectedFilters: AttributeFilter[] = [];
    constructor(private filterService: FilterServiceProvider, private strutturaService: StrutturaService, private modalController: ModalController) {
        this.filters = this.strutturaService.getFilterValues();
        this.selectedFilters = this.filterService.getFilters();
        console.log('constructor', this.filterService.getFilters());

    }

    ngOnInit() {
        console.dir('ngOnInit', this.filterService.getFilters());
    }

    public onChipClick(filter: AttributeFilter, value: string) {
        let selectedFilter: AttributeFilter = this.getFilterByProperty(filter);
        if (selectedFilter) {
            if ((selectedFilter.value as string[]).includes(value)) {
                remove((selectedFilter.value as string[]), el => el === value);
                //remove empty filters
                remove(this.selectedFilters, f=>!(f.value as string[]).length);
            } else {
                (selectedFilter.value as string[]).push(value);
            }
        } else {
            selectedFilter = {
                property: filter.property,
                operator: filter.operator,
                value: [value]
            }
            this.selectedFilters.push(selectedFilter);
        }

        console.log(this.filterService.getFilters());

    }

    public getFilterByProperty(filter: AttributeFilter): AttributeFilter {
        return this.selectedFilters.find((f: AttributeFilter) => f.property == filter.property);
    }

    public getFilterByValue(filter: AttributeFilter, value: string): AttributeFilter {
        return this.selectedFilters.find((f: AttributeFilter) => f.property == filter.property && (f.value as string[]).includes(value));
    }

    public isFilterSet(filter: AttributeFilter, value: string): boolean {
        return !isNil(this.getFilterByValue(filter, value));
    }

    /**
     * applyFilter
     */
    public applyFilter() {
        console.log(this.selectedFilters);
        this.modalController.dismiss({
            filters: this.selectedFilters
        });
    }

    public closeModal() {
        this.modalController.dismiss();
    }
}
