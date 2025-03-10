import { Component, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { TransacaoService } from '../services/transacao.service';
import { Transacao } from '../models/transacao';

@Component({
  selector: 'app-grafico-despesas',
  standalone: false,
  templateUrl: './grafico-despesas.component.html',
  styleUrls: ['./grafico-despesas.component.css']
})
export class GraficoDespesasComponent implements OnChanges {
  @Input() mes: string | null = '';
  @Input() ano: number | null = 0;

  view: [number, number] = [700, 250];

  colorScheme: Color = {
    name: 'despesasScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#FF0000', 
      '#1F77B4', 
      '#FFA500', 
      '#008000', 
      '#FF6347', 
      '#800080', 
      '#87CEEB', 
      '#808080', 
      '#FF69B4'  
    ]
  };

  doughnutChartData: { name: string, value: number }[] = [];
  mensagemAviso: string = '';

  constructor(private transacaoService: TransacaoService) { }

  //Vou analisar como o grafico fica responsivo
  // @HostListener('window:resize', ['$event'])
  // onResize(event: any): void {
  //   this.atualizarTamanhoGrafico();
  // }

  // ngOnInit() {
  //   this.atualizarTamanhoGrafico();
  // }

  // private atualizarTamanhoGrafico(): void {
  //   const larguraTela = window.innerWidth;

  //   if (larguraTela < 768) {
  //     this.view = [window.innerWidth - 20, 200]; 
  //   }
  //   else {
  //     this.view = [700, 250];
  //   }
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mes'] || changes['ano']) {
      this.carregarDespesas();
    }
  }

  private carregarDespesas(): void {
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
    const mesIndex = this.mes ? meses.indexOf(this.mes) : new Date().getMonth();
    const ano = this.ano ?? new Date().getFullYear();
  
    if (mesIndex === -1) {
      console.error('Mês inválido:', this.mes);
      return;
    }
  
    this.transacaoService.retornarPorMesETipo(mesIndex, ano, 'Despesa').subscribe(transacoes => {
      if (transacoes.length === 0) {
        this.mensagemAviso = 'Ops, você não possui transações registradas.';
        this.doughnutChartData = [];
      } 
      else {
        this.mensagemAviso = '';
        this.doughnutChartData = this.agruparPorCategoria(transacoes);
      }
    });
  }

  private agruparPorCategoria(transacoes: Transacao[]): { name: string, value: number }[] {
    const categorias: { [key: string]: number } = {};

    transacoes.forEach(transacao => {
      if (categorias[transacao.categoria]) {
        categorias[transacao.categoria] += transacao.valor;
      } 
      else {
        categorias[transacao.categoria] = transacao.valor;
      }
    });

    return Object.keys(categorias).map(categoria => ({
      name: categoria,
      value: categorias[categoria]
    }));
  }
}
