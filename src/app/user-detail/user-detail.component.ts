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

  /**
   * The constructor of the UserDetailComponent.
   * It takes in a few parameters in its constructor:
   * - route: ActivatedRoute: The ActivatedRoute is used to get the id of the user
   *   from the URL.
   * - firestore: Firestore: The Firestore is used to get the data of the user
   *   from the Firestore.
   * - dialog: MatDialog: The MatDialog is used to open a dialog to edit the
   *   user.
   * - router: Router: The Router is used to navigate to the user-list page
   *   after the user is deleted.
   */
  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    public dialog: MatDialog,
    private router: Router 
  ) {}

  /**
   * OnInit lifecycle hook. It is called when the component is initialized.
   * It gets the id of the user from the URL and calls the getUser() method
   * to get the data of the user from the Firestore.
   */
  ngOnInit() {
    this.userID = this.route.snapshot.params['id'];
    this.getUser();
  }

  /**
   * Retrieves the user data from the Firestore.
   * It uses the docData() method to get the data of the user
   * from the Firestore. It subscribes to the observable and
   * updates the user property with the received data.
   */
  getUser() {
    const userDocRef = doc(this.firestore, 'users', this.userID);
    docData(userDocRef, { idField: 'id' }).subscribe((user: any) => {
      this.user = new User(user);
    });
  }

  /**
   * Opens a dialog to edit the user details.
   * It creates a copy of the user object and passes it to the DialogEditUserComponent
   * to be edited. When the dialog is closed and the user is edited, it updates
   * the user property with the edited user.
   */
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

  /**
   * Opens a dialog to edit the user address.
   * It creates a copy of the user object and passes it to the DialogEditAddressComponent
   * to be edited. When the dialog is closed and the user is edited, it updates
   * the user property with the edited user.
   */
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

  /**
   * Deletes the user with the given id.
   * It first checks if a user-id is given and if the user really wants to delete the user.
   * If the user-id is given and the user wants to delete the user, it deletes the user
   * from the Firestore and navigates to the user-list page.
   */
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