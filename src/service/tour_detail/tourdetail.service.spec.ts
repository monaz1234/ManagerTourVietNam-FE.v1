import { TestBed } from '@angular/core/testing';

import { TourDetailService } from './tourdetail.service';

describe('TourDetailService', () => {
  let service: TourDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
