import { Component, OnInit } from '@angular/core';
import { 
  faGreaterThan, 
  faLessThan, 
  faMagnifyingGlass, 
  faSuitcaseMedical, 
  faEllipsisVertical, 
  faCartShopping, 
  faMedal, 
  faMoneyBill, 
  faMoneyBillTrendUp, 
  faFileContract, 
  faBus, 
  faBowlFood, 
  faUmbrellaBeach, 
  faHouse, 
  faBasketShopping, 
  faPlane 
} from '@fortawesome/free-solid-svg-icons';
import { Transacao } from '../models/transacao';
import { TransacaoService } from '../services/transacao.service';

@Component({
  selector: 'app-historico',
  standalone: false,
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.css'
})
export class HistoricoComponent implements OnInit {

  faMagnifyingGlass = faMagnifyingGlass;
  faEllipsisVertical = faEllipsisVertical;
  faLessThan = faLessThan;
  faGreaterThan = faGreaterThan;
  faCartShooping = faCartShopping;
  faMedal = faMedal;
  faMoneyBill = faMoneyBill;
  faMoneyBillTrendUp = faMoneyBillTrendUp;
  faSuitcaseMedical = faSuitcaseMedical;
  faFileContract = faFileContract;
  faBus = faBus;
  faBowlFood = faBowlFood;
  faUmbrellaBeach = faUmbrellaBeach;
  faHouse = faHouse;
  faBasketShopping = faBasketShopping;
  faPlane = faPlane;
  
  mes: string[] = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  mesAtual: string = this.mes[new Date().getMonth()];
  anoAtual: number = new Date().getFullYear(); 
  mesAnterior!: string;
  prevYear!: number;
  proximoMes!: string;
  proximoAno!: number;

  opcaoSelecionada: string = '';
  pesquisaPelaDescricao: string = '';
  transacoes: Transacao[] = [];

  iconMap: { [key: string]: any } = {
    'Bonificação': this.faMedal,
    'Emprestimo': this.faMoneyBill,
    'Investimento': this.faMoneyBillTrendUp,
    'RendaExtra': this.faMoneyBill,
    'Salário': this.faMoneyBill,
    'Saúde': this.faSuitcaseMedical,
    'Assinatura': this.faFileContract,
    'Transporte': this.faBus,
    'Alimentação': this.faBowlFood,
    'Supermercado': this.faCartShooping,
    'Lazer': this.faUmbrellaBeach,
    'Casa': this.faHouse,
    'Compras': this.faBasketShopping,
    'Viagem': this.faPlane
  };

  constructor(private transacaoService: TransacaoService) {
    this.atualizaDatas();
  }

  ngOnInit(): void {
   this.filtrarTransacoes();
  }

  filtrarTransacoes(): void {
    this.transacaoService.retornarTodas().subscribe(transacoes => {
      let transacoesFiltradas = transacoes.filter(transacao => {
        const dataTransacao = new Date(transacao.data);
        return dataTransacao.getMonth() === this.mes.indexOf(this.mesAtual) && dataTransacao.getFullYear() === this.anoAtual;
      });

      if (this.opcaoSelecionada && this.opcaoSelecionada !== 'Todas') {
        transacoesFiltradas = transacoesFiltradas.filter(transacao => {
          const tipoTransacao = this.opcaoSelecionada === 'Receitas' ? 'Receita' : 'Despesa';
          return transacao.tipo === tipoTransacao;
        });
      }

      if (this.pesquisaPelaDescricao) {
        transacoesFiltradas = transacoesFiltradas.filter(transacao => 
          transacao.descricao.toLowerCase().includes(this.pesquisaPelaDescricao.toLowerCase())
        );
      }

      this.transacoes = transacoesFiltradas;
    });
  }

  opcaoFoiSelecionada(event: Event, option: string): void {
    event.preventDefault();
    this.opcaoSelecionada = option;
    console.log('Tipo selecionado:', this.opcaoSelecionada);
    this.filtrarTransacoes();  
  }

  PesquisarDescricao(): void {
    this.filtrarTransacoes();
  }

  ButaoDePesquisa(): void {
    this.PesquisarDescricao();
  }

  mostraIconePorCategoria(categoria: string) {
    return this.iconMap[categoria] || this.faCartShooping;
  }

  atualizaDatas(): void {
    const mesAtualIndex = this.mes.indexOf(this.mesAtual);
    this.mesAnterior = this.mes[(mesAtualIndex - 1 + 12) % 12]; 
    this.prevYear = this.mesAtual === 'Janeiro' ? this.anoAtual - 1 : this.anoAtual;

    this.proximoMes = this.mes[(mesAtualIndex + 1) % 12];
    this.proximoAno = this.mesAtual === 'Dezembro' ? this.anoAtual + 1 : this.anoAtual;
  }

  voltaMes(): void {
    const mesAtualIndex = this.mes.indexOf(this.mesAtual);
    this.mesAtual = this.mes[(mesAtualIndex - 1 + 12) % 12];
    this.anoAtual = this.mesAtual === 'Dezembro' ? this.anoAtual - 1 : this.anoAtual;
  
    this.atualizaDatas();
    this.filtrarTransacoes(); 
  }

  avancaMes(): void {
    const mesAtualIndex = this.mes.indexOf(this.mesAtual);
    this.mesAtual = this.mes[(mesAtualIndex + 1) % 12];
    this.anoAtual = this.mesAtual === 'Janeiro' ? this.anoAtual + 1 : this.anoAtual;
  
    this.atualizaDatas();
    this.filtrarTransacoes(); 
  }

  formatarDataCompleta(data: string): string {
    const diasSemana: { [key: string]: string } = {
      'segunda-feira': 'Segunda',
      'terça-feira': 'Terça',
      'quarta-feira': 'Quarta',
      'quinta-feira': 'Quinta',
      'sexta-feira': 'Sexta',
      'sábado': 'Sábado',
      'domingo': 'Domingo'
    };
  
    const dataFormatada = new Date(data);
    const nomeCompleto = dataFormatada.toLocaleDateString('pt-BR', { weekday: 'long' });
    const nomeReduzido = diasSemana[nomeCompleto] || nomeCompleto;
    const dataFormatadaBr = dataFormatada.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
    return `${nomeReduzido}, ${dataFormatadaBr}`;
  }
  
}
