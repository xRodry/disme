import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessDiagramComponent } from './process-diagram.component';

describe('ProcessDiagramComponent', () => {
  let component: ProcessDiagramComponent;
  let fixture: ComponentFixture<ProcessDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
