import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  // Basis-URL für Yahoo Finance API über RapidAPI
  private apiUrl = 'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/quotes';
  // Ersetzen Sie 'YOUR_RAPIDAPI_KEY' durch Ihren tatsächlichen RapidAPI-Schlüssel
  private apiKey = '99ff64d8e3mshf6d84336871a7c8p154344jsn46b50c308ef1';
  private apiHost = 'yahoo-finance15.p.rapidapi.com';

  constructor(private http: HttpClient) {}

  /**
   * Ruft die Kursdaten für die Top 10 DAX-Aktien in einem einzigen Request ab.
   * Die Ticker werden als kommagetrennte Zeichenfolge übergeben.
   */
  getDaxQuotes(): Observable<any> {
    // Liste der DAX-Ticker; passen Sie diese Liste bei Bedarf an.
    const tickers = 'SAP.DE,LIN.DE,MRK.DE,SIE.DE,BAS.DE,BAYN.DE,ALV.DE,DAI.DE,VOW3.DE,BMW.DE';
    // URL-encode die Ticker-Liste
    const url = `${this.apiUrl}?ticker=${encodeURIComponent(tickers)}`;
    const headers = {
      'x-rapidapi-key': this.apiKey,
      'x-rapidapi-host': this.apiHost
    };
    return this.http.get(url, { headers });
  }
}