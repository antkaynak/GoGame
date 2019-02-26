import { TestBed } from '@angular/core/testing';

import { GameGuardService } from './game-guard.service';

describe('GameGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameGuardService = TestBed.get(GameGuardService);
    expect(service).toBeTruthy();
  });
});
