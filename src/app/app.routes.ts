import { Routes } from '@angular/router';
import { TransacaoComponent } from './transacao/transacao.component';
import { HistoricoComponent } from './historico/historico.component';
import { TotalCardComponent } from './total-card/total-card.component';
import { EditarTransacaoComponent } from './editar-transacao/editar-transacao.component';

export const routes: Routes = [
  { path: '', component: TotalCardComponent },
  { path: 'transacao', component: TransacaoComponent },
  { path: 'historico', component: HistoricoComponent },
  { path: 'editar/:id', component: EditarTransacaoComponent }
];