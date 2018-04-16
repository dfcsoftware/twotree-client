import { TestBed, inject } from '@angular/core/testing';

import { PageDataService } from './page-data.service';

describe('PageDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageDataService]
    });
  });

  it('should be created', inject([PageDataService], (service: PageDataService) => {
    expect(service).toBeTruthy();
  }));
});
