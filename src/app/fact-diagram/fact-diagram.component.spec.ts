import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactDiagramComponent } from './fact-diagram.component';

describe('FactDiagramComponent', () => {
  let component: FactDiagramComponent;
  let fixture: ComponentFixture<FactDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
