import { TestBed } from '@angular/core/testing';

import { DemoServerService } from './demo-server.service';

describe('DemoServerService', () => {
  let service: DemoServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
