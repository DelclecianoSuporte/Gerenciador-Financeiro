import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-confirmacao',
  standalone: false,
  templateUrl: './modal-confirmacao.component.html',
  styleUrls: ['./modal-confirmacao.component.css']
})
export class ModalConfirmacaoComponent {
  @Input() titulo: string = '';
  @Input() mensagem: string = '';
  @Input() mostraModal = false;

  @Output() confirmado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  fecharModal() {
    this.mostraModal = false;
    this.cancelado.emit();
  }

  confirmar() {
    this.mostraModal = false;
    this.confirmado.emit();
  }
}
