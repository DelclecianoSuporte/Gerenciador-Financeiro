import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoDespesasComponent } from './grafico-despesas.component';

describe('GraficoDespesasComponent', () => {
  let component: GraficoDespesasComponent;
  let fixture: ComponentFixture<GraficoDespesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraficoDespesasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoDespesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
