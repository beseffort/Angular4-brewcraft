import { TestBed, inject } from '@angular/core/testing';

import { BrewService } from './brew.service';

describe('BrewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrewService]
    });
  });

  it('should ...', inject([BrewService], (service: BrewService) => {
    expect(service).toBeTruthy();
  }));
});
