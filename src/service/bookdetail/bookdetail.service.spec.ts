import { TestBed } from '@angular/core/testing';

import { BookdetailService } from './bookdetail.service';

describe('BookdetailService', () => {
  let service: BookdetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookdetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
