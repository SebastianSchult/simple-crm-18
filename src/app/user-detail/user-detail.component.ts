import { MatIconModule } from '@angular/material/icon';
import { Component } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
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
  styleUrls: ['./user-detail.component.scss'] // Achte darauf: styleUrls (Plural)
})
export class UserDetailComponent {
  userID = '';
  user: User = new User();

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    public dialog: MatDialog
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
    const dialog = this.dialog.open(DialogEditUserComponent);
    // Falls du im Edit-User-Dialog ebenfalls eine Kopie benötigst,
    // kannst du hier analog vorgehen:
    dialog.componentInstance.user = this.user;
  }

  editAddressMenu() {
    // Erstelle eine Kopie des User-Objekts inklusive ID,
    // damit Änderungen im Dialog nicht sofort das Original beeinflussen.
    const userCopy = new User({
      ...this.user.toJSON(),
      id: this.user.id  // explizit die ID übernehmen
    });
    
    const dialogRef = this.dialog.open(DialogEditAddressComponent, {
      data: { user: userCopy }
    });

    dialogRef.afterClosed().subscribe((result: User | undefined) => {
      // Wird der Dialog mit einem Ergebnis geschlossen (Save geklickt),
      // aktualisiere das Original.
      if (result) {
        this.user = result;
      }
    });
  }
}