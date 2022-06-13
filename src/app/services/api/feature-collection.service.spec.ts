import { TestBed } from '@angular/core/testing';

import { FeatureCollectionService } from './feature-collection.service';

describe('FeatureCollectionService', () => {
  let service: FeatureCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
