/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProcessDetailsComponent } from './modal-process-details.component';

describe('ModalProcessDetailsComponent', () => {
  let component: ModalProcessDetailsComponent;
  let fixture: ComponentFixture<ModalProcessDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProcessDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProcessDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
