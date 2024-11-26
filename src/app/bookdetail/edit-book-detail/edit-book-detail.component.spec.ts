import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBookDetailComponent } from './edit-book-detail.component';

describe('EditBookDetailComponent', () => {
  let component: EditBookDetailComponent;
  let fixture: ComponentFixture<EditBookDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditBookDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBookDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
