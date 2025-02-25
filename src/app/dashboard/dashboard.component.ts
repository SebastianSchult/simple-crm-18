import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { StockService } from '../services/stock.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalUsers = 0;
  currentDate: Date = new Date();
  daxStocks: any[] = [];
  private clockSubscription!: Subscription;
  private stockSubscription!: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private firebaseService: FirebaseService,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.fetchTotalUsersCount();
    if (isPlatformBrowser(this.platformId)) {
      this.clockSubscription = interval(1000).subscribe(() => {
        this.currentDate = new Date();
      });
    }
    this.fetchDaxStocks();
  }

  ngOnDestroy(): void {
    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
    }
    if (this.stockSubscription) {
      this.stockSubscription.unsubscribe();
    }
  }

  async fetchTotalUsersCount() {
    try {
      this.totalUsers = await this.firebaseService.getUsersCount();
      console.log('Total Users:', this.totalUsers);
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  }

  fetchDaxStocks() {
    this.stockSubscription = this.stockService.getDaxQuotes().subscribe(
      (response: any) => {
        // Die API liefert ein Objekt mit den Schlüsseln "meta" und "body".
        if (response && response.body) {
          this.daxStocks = response.body.map((stock: any) => {
            return {
              symbol: stock.symbol,
              price: stock.regularMarketPrice,       // Passen Sie die Feldnamen ggf. an
              change: stock.regularMarketChange,
              percentChange: stock.regularMarketChangePercent
            };
          });
        } else {
          console.error('Keine Aktien-Daten erhalten:', response);
        }
        console.log('DAX Stocks:', this.daxStocks);
      },
      (error) => {
        console.error('Error fetching DAX stocks:', error);
      }
    );
  }
}