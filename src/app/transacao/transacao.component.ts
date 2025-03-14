import { Component, OnInit } from '@angular/core';
import { TransacaoService } from '../services/transacao.service';
import { faCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { StatusTransacao } from '../models/status-transacao.model';
import { CategoriaTransacao } from '../models/categoria-transacao.model';
import { FormaPagamento } from '../models/forma-pagamento.model';
import { Transacao } from '../models/transacao';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormaPagamentoDisplay, StatusTransacaoDisplay } from '../models/display-mappings';

@Component({
  selector: 'app-transacao',
  standalone: false,
  templateUrl: './transacao.component.html',
  styleUrl: './transacao.component.css'
})
export class TransacaoComponent implements OnInit {
  
  faCheck = faCheck
  faArrowLeft = faArrowLeft;

  opcoesStatus: string[] = []; 
  statusTransacao: string = '';

  opcoesCategoria: string[] = []; 
  categoriaTransacao: string = ''; 
  categoriasReceita: string[] = ["Emprestimo", "Salario", "Investimento", "RendaExtra", "Bonificacao"];
  categoriasDespesa: string[] = ["Saude", "Assinatura", "Transporte", "Alimentacao", "Supermercado", "Lazer", "Casa", "Compras", "Viagem"];
  
  tiposTransacao: string[] = ['Receita', 'Despesa'];
  tiposSelecionado: string = ''; 

  opcoesFormaPagamento: string[] = [];
  formaPagamentoTransacao: string = '';

  recorrente: string = ''; 
  parcelas: number[] = [];
  quantidadeParcelas: number | undefined; 
  divQuantidadeParcelas: boolean = false;

  categoriasReceitas: [] = []; 
  valorTransacao: string = '';
  descricaoTransacao: string = ''; 
  dataTransacao: string = ''; 
  erros: any = {};
  

  constructor(private transacaoService: TransacaoService,
    private router: Router, 
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.opcoesStatus = this.transacaoService.retornaOpcoesStatusTransacao();
    this.opcoesCategoria = this.transacaoService.retornaOpcoesCategoria();
    this.opcoesFormaPagamento = this.transacaoService.retornaOpcoesFormaPagamento();
    this.parcelas = Array.from({ length: 12 }, (_, i) => i + 1);
  }

   // Alterando as opções do Select para ficar mais legivel exp:(NaoFoiPago = Não Foi Pago)
   getStatusDisplay(status: string): string {
    return StatusTransacaoDisplay[status as keyof typeof StatusTransacaoDisplay];
  }

  // Alterando as opções do Select para ficar mais legivel exp:(CartaoDeCredito = Cartão de Credito)
  getFormaPagamentoDisplay(formaPagamento: string): string {
    return FormaPagamentoDisplay[formaPagamento as keyof typeof FormaPagamentoDisplay];
  }

  verificaRecorrencia(event: any): void {
    this.divQuantidadeParcelas = event.target.value === "true"; 

    if (!this.divQuantidadeParcelas) {
      this.quantidadeParcelas = undefined; 
    }
  }

  atualizarCategorias(event: Event) {
    const tipo = (event.target as HTMLSelectElement).value;

    if(tipo === 'Receita'){
      this.opcoesCategoria = this.categoriasReceita;
    }
    else if(tipo === 'Despesa'){
      this.opcoesCategoria = this.categoriasDespesa
    }
    else {
      this.opcoesCategoria = [];
    }

    this.categoriaTransacao = ""; 
  }

  criarTransacao(): void {

    this.erros = {};

    const campos = [
      { nome: 'tiposSelecionado', valor: this.tiposSelecionado },
      { nome: 'dataTransacao', valor: this.dataTransacao },
      { nome: 'valorTransacao', valor: this.valorTransacao },
      { nome: 'descricaoTransacao', valor: this.descricaoTransacao },
      { nome: 'recorrente', valor: this.recorrente },
      { nome: 'statusTransacao', valor: this.statusTransacao },
      { nome: 'categoriaTransacao', valor: this.categoriaTransacao },
      { nome: 'formaPagamentoTransacao', valor: this.formaPagamentoTransacao }
    ];

    campos.forEach((campo) => {
      if (!campo.valor) {
        this.erros[campo.nome] = true;
      }
    });

    if (Object.values(this.erros).some(erro => erro)) {
      return;
    }

    const novaTransacao: Transacao = {
      tipo: this.tiposSelecionado,
      categoria: CategoriaTransacao[this.categoriaTransacao as keyof typeof CategoriaTransacao],
      descricao: this.descricaoTransacao,
      valor: parseFloat(this.valorTransacao),
      data: new Date(this.dataTransacao).toISOString(),
      recorrente: this.recorrente === 'true',
      quantidadeParcelas: this.recorrente === 'true' ? this.quantidadeParcelas : undefined,
      formaPagamento: FormaPagamento[this.formaPagamentoTransacao as keyof typeof FormaPagamento],
      status_Transacao: StatusTransacao[this.statusTransacao as keyof typeof StatusTransacao]
    };

    this.transacaoService.adicionarTransacao(novaTransacao).subscribe({
      next: response => {
        this.toastr.success('Transação criada com sucesso!', 'Sucesso');
        this.limparCamposFormulario();
        this.router.navigate(['/']);
      },
      error: error => {
        console.error('Erro ao criar transação:', error);
        this.toastr.error('Erro ao criar transação. Tente novamente.', 'Erro');
      }
    });
  }

  limparCamposFormulario(): void {
    this.tiposSelecionado = '';
    this.categoriaTransacao = '';
    this.descricaoTransacao = '';
    this.valorTransacao = '';
    this.dataTransacao = '';
    this.recorrente = '';
    this.quantidadeParcelas = undefined;
    this.statusTransacao = '';
    this.formaPagamentoTransacao = '';
  }

}