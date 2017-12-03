import { TestBed, inject } from '@angular/core/testing';

import { ViewCollectionService } from './view-component.service';

describe('ViewComponentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewCollectionService]
    });
  });

  it('should be created', inject([ViewCollectionService], (service: ViewCollectionService) => {
    expect(service).toBeTruthy();
  }));
});
