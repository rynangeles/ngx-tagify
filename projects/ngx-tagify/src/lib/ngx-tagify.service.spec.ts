import { TestBed } from '@angular/core/testing';

import { NgxTagifyService } from './ngx-tagify.service';

describe('NgxTagifyService', () => {
  let service: NgxTagifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxTagifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
