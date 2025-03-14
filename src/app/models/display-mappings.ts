// Mapeamento para exibir as opções no campo select de forma legivel

import { StatusTransacao } from './status-transacao.model';
import { FormaPagamento } from './forma-pagamento.model';

export const StatusTransacaoDisplay = {
  [StatusTransacao.Pago]: 'Pago',
  [StatusTransacao.NaoFoiPago]: 'Não Foi Pago'
};

export const FormaPagamentoDisplay = {
  [FormaPagamento.Dinheiro]: 'Dinheiro',
  [FormaPagamento.Pix]: 'Pix',
  [FormaPagamento.CartaoDeCredito]: 'Cartão de Crédito'
};
