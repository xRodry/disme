import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSaveProcessDiagramComponent } from './modal-save-process-diagram.component';

describe('ModalSaveProcessDiagramComponent', () => {
  let component: ModalSaveProcessDiagramComponent;
  let fixture: ComponentFixture<ModalSaveProcessDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSaveProcessDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSaveProcessDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
