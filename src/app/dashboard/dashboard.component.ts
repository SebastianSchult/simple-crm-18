import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { Firestore, collection, getCountFromServer } from '@angular/fire/firestore';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  firestore: Firestore;
  totalUsers = 0;
  currentDate: Date = new Date();
  pendingTasks = 3;
  private clockSubscription!: Subscription;

/**
 * Constructs the DashboardComponent.
 * 
 * @param platformId - The platform ID used to determine if the code is running in a browser or server.
 * @param firestore - The Firestore service injected for accessing Firestore database operations.
 */

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              @Inject(Firestore) firestore: Firestore) {
    this.firestore = firestore;
  }

  ngOnInit(): void {
    this.fetchTotalUsersCount();

    // Starte den Timer nur, wenn die Anwendung im Browser läuft
    if (isPlatformBrowser(this.platformId)) {
      this.clockSubscription = interval(1000).subscribe(() => {
        this.currentDate = new Date();
      });
    }
  }

  /**
   * Cleanup after the component is destroyed.
   * 
   * Unsubscribes from the clock subscription if it exists.
   */
  ngOnDestroy(): void {
    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
    }
  }

/**
 * Asynchronously fetches the total count of users from the Firestore collection.
 * 
 * It attempts to retrieve the count of documents in the 'users' collection
 * from the Firestore database. Upon successful retrieval, it updates the
 * `totalUsers` property with the fetched count and logs the total to the console.
 * If an error occurs during the fetch operation, it logs an error message.
 */

  async fetchTotalUsersCount() {
    try {
      const usersCol = collection(this.firestore, 'users');
      const snapshot = await getCountFromServer(usersCol);
      this.totalUsers = snapshot.data().count;
    } catch (error) {
      console.error("Error fetching user count: ", error);
    }
  }
}