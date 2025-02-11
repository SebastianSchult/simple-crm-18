import { MatIconModule } from '@angular/material/icon';
import { Component } from '@angular/core';
import { Firestore, doc, docData, deleteDoc } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router} from '@angular/router';
import { User } from '../../models/user.class';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'] 
})
export class UserDetailComponent {
  userID = '';
  user: User = new User();

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    public dialog: MatDialog,
    private router: Router 
  ) {}

  ngOnInit() {
    this.userID = this.route.snapshot.params['id'];
    this.getUser();
  }

  getUser() {
    const userDocRef = doc(this.firestore, 'users', this.userID);
    docData(userDocRef, { idField: 'id' }).subscribe((user: any) => {
      this.user = new User(user);
    });
  }

  editUserDetail() {
    const userCopy = new User({
      ...this.user.toJSON(),
      id: this.user.id
    });
    
    const dialogRef = this.dialog.open(DialogEditUserComponent, {
      data: { user: userCopy }
    });
    
    dialogRef.afterClosed().subscribe((result: User | undefined) => {
      if (result) {
        this.user = result;
      }
    });
  }

  editAddressMenu() {
    const userCopy = new User({
      ...this.user.toJSON(),
      id: this.user.id 
    });
    
    const dialogRef = this.dialog.open(DialogEditAddressComponent, {
      data: { user: userCopy }
    });

    dialogRef.afterClosed().subscribe((result: User | undefined) => {
      if (result) {
        this.user = result;
      }
    });
  }

  delete() {
    // Optional: Bestätigung einholen
    if (!confirm('Möchten Sie diesen User wirklich löschen?')) {
      return;
    }

    if (!this.userID) {
      console.error('Keine User-ID vorhanden, Löschung nicht möglich.');
      return;
    }

    const userDocRef = doc(this.firestore, 'users', this.userID);
    deleteDoc(userDocRef)
      .then(() => {
        console.log('User successfully deleted.');
        this.router.navigate(['/user']);
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  }
}