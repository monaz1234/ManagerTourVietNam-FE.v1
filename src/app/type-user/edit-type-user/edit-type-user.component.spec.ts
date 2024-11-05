import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTypeUserComponent } from './edit-type-user.component';

describe('EditTypeUserComponent', () => {
  let component: EditTypeUserComponent;
  let fixture: ComponentFixture<EditTypeUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditTypeUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTypeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
