import { TestBed } from '@angular/core/testing';

import { TypeTourService } from './type-tour.service';

describe('TypeTourService', () => {
  let service: TypeTourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeTourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
