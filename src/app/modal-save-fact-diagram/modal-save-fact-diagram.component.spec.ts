import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSaveFactDiagramComponent } from './modal-save-fact-diagram.component';

describe('ModalSaveFactDiagramComponent', () => {
  let component: ModalSaveFactDiagramComponent;
  let fixture: ComponentFixture<ModalSaveFactDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSaveFactDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSaveFactDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
