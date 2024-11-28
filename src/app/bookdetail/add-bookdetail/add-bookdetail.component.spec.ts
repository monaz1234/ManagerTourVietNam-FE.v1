import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookdetailComponent } from './add-bookdetail.component';

describe('AddBookdetailComponent', () => {
  let component: AddBookdetailComponent;
  let fixture: ComponentFixture<AddBookdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddBookdetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBookdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
