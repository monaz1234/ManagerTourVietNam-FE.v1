import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerTourComponent } from './manager-tour.component';

describe('ManagerTourComponent', () => {
  let component: ManagerTourComponent;
  let fixture: ComponentFixture<ManagerTourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerTourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
