/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDynamicRestApiComponent } from './modal-dynamic-rest-api.component';

describe('ModalDynamicRestApiComponent', () => {
  let component: ModalDynamicRestApiComponent;
  let fixture: ComponentFixture<ModalDynamicRestApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDynamicRestApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDynamicRestApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
