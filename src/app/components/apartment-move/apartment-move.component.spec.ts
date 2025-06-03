import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentMoveComponent } from './apartment-move.component';

describe('ApartmentMoveComponent', () => {
  let component: ApartmentMoveComponent;
  let fixture: ComponentFixture<ApartmentMoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApartmentMoveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApartmentMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
