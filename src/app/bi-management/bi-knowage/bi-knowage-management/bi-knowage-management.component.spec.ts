/*
 * Copyright © 2016 - 2024 Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiKnowageManagementComponent } from './bi-knowage-management.component';

describe('BiKnowageManagementComponent', () => {
  let component: BiKnowageManagementComponent;
  let fixture: ComponentFixture<BiKnowageManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiKnowageManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiKnowageManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
