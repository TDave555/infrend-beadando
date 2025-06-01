import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCrateComponent } from './cost-crate.component';

describe('CostCrateComponent', () => {
  let component: CostCrateComponent;
  let fixture: ComponentFixture<CostCrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostCrateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostCrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
