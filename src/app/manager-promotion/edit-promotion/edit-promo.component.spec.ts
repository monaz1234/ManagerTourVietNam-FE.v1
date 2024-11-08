import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPromoComponent } from './edit-promo.component';

describe('EditPromoComponent', () => {
let component: EditPromoComponent;
let fixture: ComponentFixture<EditPromoComponent>;

beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [EditPromoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
});

it('should create', () => {
    expect(component).toBeTruthy();
});
});
