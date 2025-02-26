import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/quotes';
  private apiKey = '99ff64d8e3mshf6d84336871a7c8p154344jsn46b50c308ef1';
  private apiHost = 'yahoo-finance15.p.rapidapi.com';

  constructor(private http: HttpClient) {}

  
  /**
   * Retrieves the current stock quotes for the DAX index.
   * The DAX index consists of 10 blue-chip stocks traded on the Frankfurt Stock Exchange.
   * The API response will contain the current stock prices, changes, and other relevant data.
   *
   * @returns An Observable containing the API response.
   */
  getDaxQuotes(): Observable<any> {
    const tickers = 'SAP.DE,LIN.DE,MRK.DE,SIE.DE,BAS.DE,BAYN.DE,ALV.DE,RWE.DE,VOW3.DE,BMW.DE';
    const url = `${this.apiUrl}?ticker=${encodeURIComponent(tickers)}`;
    const headers = {
      'x-rapidapi-key': this.apiKey,
      'x-rapidapi-host': this.apiHost
    };
    return this.http.get(url, { headers });
  }
}