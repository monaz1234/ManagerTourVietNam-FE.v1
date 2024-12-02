import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDetailAddComponent } from './tour-detail-add.component';

describe('TourDetailAddComponent', () => {
  let component: TourDetailAddComponent;
  let fixture: ComponentFixture<TourDetailAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TourDetailAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourDetailAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
