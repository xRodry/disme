/*
 * Copyright © 2016 - 2024  Enterprise Engineering Lab /
 * University of Madeira /Regional Agency for the Development of Research, Technology and Innovation - ARDITI
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserEvaluatedExpressionEditorComponent } from './modal-user-evaluated-expression-editor.component';

describe('ModalUserEvaluatedExpressionEditorComponent', () => {
  let component: ModalUserEvaluatedExpressionEditorComponent;
  let fixture: ComponentFixture<ModalUserEvaluatedExpressionEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalUserEvaluatedExpressionEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUserEvaluatedExpressionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
