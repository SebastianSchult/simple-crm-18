import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { FirebaseService } from '../services/firebase.service'; // Pfad ggf. anpassen

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
  pendingTasks = 3;
  private clockSubscription!: Subscription;

  
/**
 * Constructs the DashboardComponent.
 * 
 * @param platformId - An object representing the platform id, used to determine
 *   if the application is running in a browser environment.
 * @param firebaseService - An instance of FirebaseService used to interact
 *   with Firebase for various operations like fetching the total users count.
 */

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private firebaseService: FirebaseService
  ) {}

/**
 * OnInit lifecycle hook. It is called when the component is initialized.
 * It fetches the total number of users using the FirebaseService.
 * If the application is running in a browser environment, it starts an interval
 * that updates the currentDate every second to reflect the current time.
 */

  ngOnInit(): void {
    this.fetchTotalUsersCount();
    if (isPlatformBrowser(this.platformId)) {
      this.clockSubscription = interval(1000).subscribe(() => {
        this.currentDate = new Date();
      });
    }
  }

  /**
   * Clean up the subscription to the interval when the component is destroyed.
   * This prevents memory leaks by unsubscribing from the interval.
   */
  ngOnDestroy(): void {
    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
    }
  }

 
  /**
   * Fetches the total count of users in the Firestore.
   * Uses the FirebaseService to call the getUsersCount() function and
   * updates the totalUsers property with the received count.
   * Logs an error message if the operation fails.
   */
  async fetchTotalUsersCount() {
    try {
      this.totalUsers = await this.firebaseService.getUsersCount();
      console.log('Total Users:', this.totalUsers);
    } catch (error) {
      console.error('Error fetching user count: ', error);
    }
  }
}