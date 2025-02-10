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
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatMenuModule
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent {
  userID = '';
  user: User = new User();

  constructor(private route:ActivatedRoute, private firestore: Firestore, public dialog: MatDialog){}

  ngOnInit(){
    this.userID = this.route.snapshot.params['id'];
    this.getUser();
}

getUser(){
  const userDocRef = doc(this.firestore, 'users', this.userID);

  docData(userDocRef).subscribe((user: any) => {
    this.user = new User(user);
  });
}

editUserDetail(){
  const dialog = this.dialog.open(DialogEditUserComponent);
  dialog.componentInstance.user = new User(this.user.toJSON());
}

editAddressMenu(){
  const dialog = this.dialog.open(DialogEditAddressComponent);
  dialog.componentInstance.user = new User(this.user.toJSON());
}

}
