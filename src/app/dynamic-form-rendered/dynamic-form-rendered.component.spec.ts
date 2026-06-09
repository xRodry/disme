/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormRenderedComponent } from './dynamic-form-rendered.component';

describe('DynamicFormRenderedComponent', () => {
  let component: DynamicFormRenderedComponent;
  let fixture: ComponentFixture<DynamicFormRenderedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormRenderedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormRenderedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
