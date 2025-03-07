import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Transacao } from '../models/transacao';
import { StatusTransacao } from '../models/status-transacao.model';
import { CategoriaTransacao } from '../models/categoria-transacao.model';
import { FormaPagamento } from '../models/forma-pagamento.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TransacaoService {

  private url = 'https://localhost:7213/api/transacao';

  constructor(private http: HttpClient) { }

  retornaOpcoesStatusTransacao(): string[] {
    return Object.values(StatusTransacao);
  }

  retornaOpcoesCategoria(): string[] {
    return Object.values(CategoriaTransacao);
  }

  retornaOpcoesFormaPagamento() : string[]{
    return Object.values(FormaPagamento);
  }

  retornarTodas(): Observable<Transacao[]> {
    return this.http.get<{ success: boolean; data: Transacao[] }>(this.url).pipe(
      map(response => response.data)
    );
  }

  retornarPeloId(transacaoId: string): Observable<{ success: boolean; data: Transacao }> {
    const apiUrl = `${this.url}/${transacaoId}`;
    return this.http.get<{ success: boolean; data: Transacao }>(apiUrl);
  }

  retornarPorMesETipo(mes: number, ano: number, tipo: string): Observable<Transacao[]> {
    return this.http.get<{ success: boolean; data: Transacao[] }>(this.url).pipe(
      map(response => {
        return response.data.filter(transacao => {
          const dataTransacao = new Date(transacao.data);
          return dataTransacao.getMonth() === mes && 
                 dataTransacao.getFullYear() === ano && 
                 transacao.tipo === tipo; 
        });
      })
    );
  }

  adicionarTransacao(transacao: Transacao): Observable<any>{
    return this.http.post<Transacao>(this.url, transacao, httpOptions);
  }

  atualizarTransacao(transacao: Transacao): Observable<any> {
    const apiUrl = `${this.url}/${transacao.id}`;
    return this.http.put(apiUrl, transacao, httpOptions);
  }

  excluirTransacao(id: string): Observable<any>{
    const apiUrl = `${this.url}/${id}`;
    return this.http.delete<string>(apiUrl, httpOptions);
  }

  excluirTransacoesRecorrentes(id: string): Observable<any> {
    const apiUrl = `${this.url}/recorrentes/${id}`;
    return this.http.delete<string>(apiUrl, httpOptions);
  }
}