import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTransacaoComponent } from './editar-transacao.component';

describe('EditarTransacaoComponent', () => {
  let component: EditarTransacaoComponent;
  let fixture: ComponentFixture<EditarTransacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarTransacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarTransacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
