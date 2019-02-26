import { TestBed } from '@angular/core/testing';

import { BotEngineService } from './bot-engine.service';

describe('BotEngineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BotEngineService = TestBed.get(BotEngineService);
    expect(service).toBeTruthy();
  });
});
