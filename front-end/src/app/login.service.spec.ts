import { TestBed, inject } from '@angular/core/testing';

import { LoginService } from './login.service';
import { Http } from '@angular/http';

describe('LoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginService, Http]
    });
  });

  it('should be created', inject([LoginService, Http], (service: LoginService) => {
    expect(service).toBeTruthy();
  }));
});
