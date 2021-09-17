import { TestBed } from '@angular/core/testing';

import { DatosymlService } from './datosyml.service';

describe('DatosymlService', () => {
  let service: DatosymlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosymlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
