import { Component, OnInit } from '@angular/core';
import { faArrowDown, faArrowUp, faLessThan, faGreaterThan, faEyeSlash, faHouse, faList, faBook, faInfo, faChartSimple, faCopyright } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transacao } from '../models/transacao';
import { TransacaoService } from '../services/transacao.service';

@Component({
  selector: 'app-total-card',
  standalone: false,
  templateUrl: './total-card.component.html',
  styleUrl: './total-card.component.css'
})
export class TotalCardComponent implements OnInit {
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown; 
  faLessThan = faLessThan; 
  faGreaterThan = faGreaterThan;
  faEyeSlash = faEyeSlash;
  faChartSimple = faChartSimple;
  faCopyright = faCopyright;

  mes: string[] = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  mesAtual: string = this.mes[new Date().getMonth()];
  anoAtual: number = new Date().getFullYear();
  mesAnterior!: string;
  prevYear!: number;
  proximoMes!: string;
  proximoAno!: number;

  valorTotalReceitas: number = 0;
  valorTotalDespesas: number = 0;
  saldoPrevisto: number = 0;
  valoresVisiveis: boolean = true;
  
  mesAtual$ = new BehaviorSubject<string | null>(this.mesAtual || ''); 
  anoAtual$ = new BehaviorSubject<number | null>(this.anoAtual || 0); 


  constructor(private transacaoService: TransacaoService) {
    this.atualizaDatas();
  }

  ngOnInit(): void {
    this.atualizarSaldoPrevisto(this.mesAtual, this.anoAtual);
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
    this.atualizarSaldoPrevisto(this.mesAtual, this.anoAtual);
    this.mesAtual$.next(this.mesAtual);
    this.anoAtual$.next(this.anoAtual);
  }

  avancaMes(): void {
    const mesAtualIndex = this.mes.indexOf(this.mesAtual);
    this.mesAtual = this.mes[(mesAtualIndex + 1) % 12];
    this.anoAtual = this.mesAtual === 'Janeiro' ? this.anoAtual + 1 : this.anoAtual;
    this.atualizaDatas();
    this.atualizarSaldoPrevisto(this.mesAtual, this.anoAtual);
    this.mesAtual$.next(this.mesAtual);
    this.anoAtual$.next(this.anoAtual);
  }

  obterTransacoesPorMesAno(mes: string, ano: number): Observable<Transacao[]> {
    return this.transacaoService.retornarTodas().pipe(
      map((transacoes: Transacao[]) =>
        transacoes.filter(transacao => {
          const dataTransacao = new Date(transacao.data);
          return dataTransacao.getMonth() === this.mes.indexOf(mes) &&
                 dataTransacao.getFullYear() === ano;
        })
      )
    );
  }

  calcularTotalReceitas(mes: string, ano: number): Observable<number> {
    return this.obterTransacoesPorMesAno(mes, ano).pipe(
      map(transacoes =>
        transacoes
          .filter(transacao => transacao.tipo === 'Receita')
          .reduce((sum, transacao) => sum + transacao.valor, 0)
      )
    );
  }

  calcularTotalDespesas(mes: string, ano: number): Observable<number> {
    return this.obterTransacoesPorMesAno(mes, ano).pipe(
      map(transacoes =>
        transacoes
          .filter(transacao => transacao.tipo === 'Despesa')
          .reduce((sum, transacao) => sum + transacao.valor, 0)
      )
    );
  }

  atualizarSaldoPrevisto(mes: string, ano: number): void {
    const receitas$ = this.calcularTotalReceitas(mes, ano);
    const despesas$ = this.calcularTotalDespesas(mes, ano);

    receitas$.subscribe(receitas => {
      this.valorTotalReceitas = receitas;
      despesas$.subscribe(despesas => {
        this.valorTotalDespesas = despesas;
        this.saldoPrevisto = this.valorTotalReceitas - this.valorTotalDespesas;
      });
    });
  }

  alternarVisibilidadeValores(): void {
    this.valoresVisiveis = !this.valoresVisiveis;
  }
}


