import { CategoriaTransacao } from "./categoria-transacao.model";
import { FormaPagamento } from "./forma-pagamento.model";
import { StatusTransacao } from "./status-transacao.model";

export interface Transacao {
    id?: string;
    tipo: string;
    valor: number;
    data: string;
    descricao: string;
    recorrente: boolean;
    quantidadeParcelas?: number;
    status_Transacao: StatusTransacao;
    formaPagamento: FormaPagamento;
    categoria: CategoriaTransacao;
}