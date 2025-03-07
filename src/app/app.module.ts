import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { TotalCardComponent } from './total-card/total-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TransacaoComponent } from './transacao/transacao.component'; 
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HistoricoComponent } from './historico/historico.component';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GraficoDespesasComponent } from './grafico-despesas/grafico-despesas.component';
import { RodapeComponent } from './rodape/rodape.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditarTransacaoComponent } from './editar-transacao/editar-transacao.component';
import { ModalModule } from "ngx-bootstrap/modal";

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    TotalCardComponent,
    TotalCardComponent,
    TransacaoComponent,
    HistoricoComponent,
    GraficoDespesasComponent,
    RodapeComponent,
    EditarTransacaoComponent,
  ],
  imports: [
    BrowserModule, 
    RouterModule.forRoot(routes),
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    NgxChartsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000, 
      positionClass: 'toast-bottom-right', 
      preventDuplicates: true, 
    })
  ],
  providers: [provideHttpClient(withFetch()), { provide: LOCALE_ID, useValue: 'pt-BR' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
