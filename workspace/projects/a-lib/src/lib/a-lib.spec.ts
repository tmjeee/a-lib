import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ALib } from './a-lib';

describe('ALib', () => {
  let component: ALib;
  let fixture: ComponentFixture<ALib>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ALib]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ALib);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
