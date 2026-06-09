import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProcessDiagramComponent } from './modal-process-diagram.component';

describe('ModalProcessDiagramComponent', () => {
  let component: ModalProcessDiagramComponent;
  let fixture: ComponentFixture<ModalProcessDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProcessDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProcessDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
