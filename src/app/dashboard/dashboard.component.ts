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

  ngOnDestroy(): void {
    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
    }
  }

  async fetchTotalUsersCount() {
    try {
      const usersCol = collection(this.firestore, 'users');
      const snapshot = await getCountFromServer(usersCol);
      this.totalUsers = snapshot.data().count;
      console.log('Total Users:', this.totalUsers);
    } catch (error) {
      console.error("Error fetching user count: ", error);
    }
  }
}