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
  totalTasks = 0;
  currentDate: Date = new Date();
  daxStocks: any[] = [];
  private clockSubscription!: Subscription;
  private stockSubscription!: Subscription;

  /**
   * Constructor of the DashboardComponent.
   * It takes in three parameters:
   * - platformId: Object: The platformId is used to check if the platform is a browser.
   * - firebaseService: FirebaseService: The firebaseService is used to interact with the Firestore.
   * - stockService: StockService: The stockService is used to get the DAX stocks from the Alpha Vantage API.
   */
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private firebaseService: FirebaseService,
    private stockService: StockService
  ) {}

  /**
   * OnInit lifecycle hook. It is called when the component is initialized.
   * It first fetches the total number of users from the Firestore.
   * If the platform is a browser, it then starts a subscription to a clock
   * that updates the currentDate every second.
   * Finally, it fetches the DAX stocks from the Alpha Vantage API.
   */
  ngOnInit(): void {
    this.fetchTotalUsersCount();
    this.fetchTotalTasksCount();
    if (isPlatformBrowser(this.platformId)) {
      this.clockSubscription = interval(1000).subscribe(() => {
        this.currentDate = new Date();
      });
    }
    this.fetchDaxStocks();
  }

/**
 * OnDestroy lifecycle hook. It is called when the component is destroyed.
 * Unsubscribes from clockSubscription and stockSubscription to prevent
 * memory leaks. Ensures that no subscriptions remain active after the
 * component is removed from the DOM.
 */

  ngOnDestroy(): void {
    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
    }
    if (this.stockSubscription) {
      this.stockSubscription.unsubscribe();
    }
  }

  /**
   * Fetches the total user count from the Firestore database.
   * The count is stored in the totalUsers property.
   * If an error occurs, it is logged to the console.
   */
  async fetchTotalUsersCount() {
    try {
      this.totalUsers = await this.firebaseService.getUsersCount();
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  }

  /**
   * Fetches the total task count from the Firestore database.
   * The count is stored in the totalTasks property.
   * If an error occurs, it is logged to the console.
   */
  async fetchTotalTasksCount() {
    try {
      this.totalTasks = await this.firebaseService.getTasksCount();
      console.log('Total Tasks:', this.totalTasks);
    } catch (error) {
      console.error('Error fetching tasks count:', error);
    }
  }

/**
 * Subscribes to the DAX stock quotes using the StockService and updates the daxStocks property.
 * The subscription retrieves the current stock prices, changes, and percent changes for each stock.
 * If the response contains valid stock data, it maps the data to the daxStocks array.
 * Logs an error message if no stocks are retrieved or if an error occurs during the fetch.
 */

  fetchDaxStocks() {
    this.stockSubscription = this.stockService.getDaxQuotes().subscribe(
      (response: any) => {
        if (response && response.body) {
          this.daxStocks = response.body.map((stock: any) => {
            return {
              symbol: stock.symbol,
              price: stock.regularMarketPrice,      
              change: stock.regularMarketChange,
              percentChange: stock.regularMarketChangePercent
            };
          });
        } else {
          console.error('got no Stocks:', response);
        }
      },
      (error) => {
        console.error('Error fetching DAX stocks:', error);
      }
    );
  }
}