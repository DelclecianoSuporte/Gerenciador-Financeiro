import { Component, OnInit } from '@angular/core';
import { faArrowLeft, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { TransacaoService } from '../services/transacao.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Transacao } from '../models/transacao';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StatusTransacao } from '../models/status-transacao.model';
import { FormaPagamento } from '../models/forma-pagamento.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editar-transacao',
  standalone: false,
  templateUrl: './editar-transacao.component.html',
  styleUrl: './editar-transacao.component.css'
})
export class EditarTransacaoComponent implements OnInit {

  faArrowLeft= faArrowLeft;
  faCheck = faCheck;
  faTrash = faTrash;

  transacaoForm: FormGroup;
  statusEdicao = Object.values(StatusTransacao);
  formasPagamentoEdicao = Object.values(FormaPagamento);
  tiposTransacao: string[] = ['Receita', 'Despesa'];
  categoriasBaseadasEmTipo: string[] = [];
  categoriasReceita: string[] = ["Emprestimo", "Salario", "Investimento", "RendaExtra", "Bonificacao"];
  categoriasDespesa: string[] = ["Saude", "Assinatura", "Transporte", "Alimentacao", "Supermercado", "Lazer", "Casa", "Compras", "Viagem"];
  
  modalVisivel = false;
  tituloModal = 'Confirmar Exclusão';
  mensagemModal: string = '';

  constructor(private route: ActivatedRoute, 
    private transacaoService: TransacaoService,
    private formBuilder: FormBuilder,  
    private router: Router, 
    private toastr: ToastrService) 
  {
    this.transacaoForm = this.formBuilder.group({
      tipo: [''],
      data: [''],
      valor: [''],
      descricao: [''],
      recorrente: [{ value: '', disabled: true }],
      quantidadeParcelas: [{ value: '', disabled: true }],
      status: [''],
      categoria: [''],
      formaPagamento: ['']
    });
  }

  ngOnInit(): void {
    const transacaoId = this.route.snapshot.paramMap.get('id');
    if (transacaoId) {
      this.transacaoService.retornarPeloId(transacaoId).subscribe(response => {
        if (response.success) {
          this.preencherFormulario(response.data);
          this.atualizarCategorias(response.data.tipo);
          this.ajustarCampoValorDescricao(response.data.recorrente);
        }
      });
    }
  }

  preencherFormulario(transacao: Transacao): void {
    this.transacaoForm.patchValue({
      tipo: transacao.tipo,
      data: this.formatarDataParaInput(transacao.data),
      valor: transacao.valor,
      descricao: transacao.descricao,
      recorrente: this.converterRecorrencia(transacao.recorrente),
      quantidadeParcelas: transacao.quantidadeParcelas !== undefined ? transacao.quantidadeParcelas : '',
      status: transacao.status_Transacao,
      categoria: transacao.categoria,
      formaPagamento: transacao.formaPagamento
    });
  }

  formatarDataParaInput(data: string): string {
    const date = new Date(data);
    return date.toISOString().substring(0, 10);
  }

  atualizarCategorias(tipo: string): void {
    if (tipo === 'Receita') {
      this.categoriasBaseadasEmTipo = this.categoriasReceita;
    } 
    else if (tipo === 'Despesa') {
      this.categoriasBaseadasEmTipo = this.categoriasDespesa;
    }
  }

  converterRecorrencia(recorrente: boolean): string {
    return recorrente ? 'Sim' : 'Não';
  }

  temQuantidadeParcelas(): boolean {
    return !!this.transacaoForm.get('quantidadeParcelas')?.value;
  }

  ajustarCampoValorDescricao(recorrente: boolean): void {
    if (recorrente) {
      this.transacaoForm.get('descricao')?.disable();
      this.transacaoForm.get('valor')?.disable();
    } 
    else {
      this.transacaoForm.get('descricao')?.enable();
      this.transacaoForm.get('valor')?.enable();
    }
  }

  atualizarTransacao(): void {
    if (this.transacaoForm.valid) {
      const transacaoId = this.route.snapshot.paramMap.get('id');
      
      if (!transacaoId) {
        this.toastr.error('Erro: ID da transação não encontrado!')
        return;
      }

      const camposObrigatorios = [
        { campo: 'valor', mensagem: 'O campo "valor" é obrigatório e deve ser maior que zero.', condicao: () => !this.transacaoForm.value.valor || this.transacaoForm.value.valor <= 0 },
        { campo: 'data', mensagem: 'O campo "data" é obrigatório.', condicao: () => !this.transacaoForm.value.data },
        { campo: 'descricao', mensagem: 'O campo "descrição" é obrigatório.', condicao: () => !this.transacaoForm.value.descricao?.trim() },
        { campo: 'categoria', mensagem: 'O campo "categoria" é obrigatório.', condicao: () => !this.transacaoForm.value.categoria },
        { campo: 'status', mensagem: 'O campo "status" é obrigatório.', condicao: () => !this.transacaoForm.value.status },
        { campo: 'formaPagamento', mensagem: 'O campo "forma de pagamento" é obrigatório.', condicao: () => !this.transacaoForm.value.formaPagamento },
      ];
      
      for (const campo of camposObrigatorios) {
        if (campo.condicao()) {
          this.toastr.error(campo.mensagem);
          return;
        }
      }

      const transacaoAtualizada: Transacao = {
        id: transacaoId,
        tipo: this.transacaoForm.value.tipo,
        data: this.transacaoForm.value.data,
        valor: this.transacaoForm.value.valor,
        descricao: this.transacaoForm.value.descricao,
        recorrente: this.transacaoForm.value.recorrente === 'Sim',
        quantidadeParcelas: this.transacaoForm.value.quantidadeParcelas || null, 
        status_Transacao: this.transacaoForm.value.status,
        categoria: this.transacaoForm.value.categoria,
        formaPagamento: this.transacaoForm.value.formaPagamento
      };

      this.transacaoService.atualizarTransacao(transacaoAtualizada).subscribe({
        next: () => {
          this.toastr.success('Transação atualizada com sucesso!');
          this.router.navigate(['/historico']);
        },
        error: (err) => {
          this.toastr.error('Erro ao atualizar a transação: ' + err.message);
        }
      });
    } 
  }

  abrirModalExclusao() {
    const transacaoId = this.route.snapshot.paramMap.get('id');
  
    if (!transacaoId) {
      this.toastr.error('Erro: ID da transação não encontrado!');
      return;
    }
  
    this.transacaoService.retornarPeloId(transacaoId).subscribe({
      next: (response) => {
        if (response.success) {
          const transacao = response.data;
  
          if (transacao.recorrente) {
            this.mensagemModal = 'Essa transação que você vai remover possui recorrência. Caso continue, as demais parcelas serão apagadas junto. Tem certeza disso?';
          } 
          else {
            this.mensagemModal = 'Você tem certeza que deseja excluir esta transação?';
          }
  
          this.modalVisivel = true;
        } 
        else {
          this.toastr.error('Erro ao obter detalhes da transação!');
        }
      },
      error: (error) => {
        this.toastr.error('Erro ao buscar a transação: ' + error.message);
      }
    });
  }

  fecharModal() {
    this.modalVisivel = false;
  }

  confirmarExclusao() {
    const transacaoId = this.route.snapshot.paramMap.get('id');
  
    if (!transacaoId) {
      this.toastr.error('Erro: ID da transação não encontrado!');
      return;
    }
  
    this.transacaoService.retornarPeloId(transacaoId).subscribe({
      next: (response) => {
        if (response.success) {
          const transacao = response.data;
  
          if (transacao.recorrente) {
            this.excluirTransacoesRecorrentes(transacaoId);
          } 
          else {
            this.excluirTransacao(transacaoId);
          }
        } 
        else {
          this.toastr.error('Erro ao obter detalhes da transação!');
        }
      },
      error: (error) => {
        this.toastr.error('Erro ao buscar a transação: ' + error.message);
      }
    });
  }
  
  excluirTransacao(id: string): void {
    this.transacaoService.excluirTransacao(id).subscribe({
      next: () => {
        this.toastr.success('Transação removida com sucesso!');
        this.router.navigate(['/historico']);
      },
      error: (err) => {
        this.toastr.error('Erro ao remover a transação: ' + err.message);
      }
    });
  }
  
  excluirTransacoesRecorrentes(id: string): void {
    this.transacaoService.excluirTransacoesRecorrentes(id).subscribe({
      next: () => {
        this.toastr.success('Todas as parcelas da transação foram removidas com sucesso!');
        this.router.navigate(['/historico']);
      },
      error: (err) => {
        this.toastr.error('Erro ao remover as transações recorrentes: ' + err.message);
      }
    });
  }

}