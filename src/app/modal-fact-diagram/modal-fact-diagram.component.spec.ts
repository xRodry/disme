import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFactDiagramComponent } from './modal-fact-diagram.component';

describe('ModalFactDiagramComponent', () => {
  let component: ModalFactDiagramComponent;
  let fixture: ComponentFixture<ModalFactDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFactDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFactDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
