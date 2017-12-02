import { TestBed, inject } from '@angular/core/testing';

import { AddCollectionService } from './add-collection.service';

describe('AddCollectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddCollectionService]
    });
  });

  it('should be created', inject([AddCollectionService], (service: AddCollectionService) => {
    expect(service).toBeTruthy();
  }));
});
