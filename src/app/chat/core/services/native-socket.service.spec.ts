import { TestBed } from '@angular/core/testing';

import { NativeSocketService } from './native-socket.service';

describe('NativeSocketService', () => {
  let service: NativeSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NativeSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});