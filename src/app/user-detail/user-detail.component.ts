import { MatIconModule } from '@angular/material/icon';
import { Component } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.class';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent {
  userID = '';
  user: User = new User();

  constructor(private route:ActivatedRoute, private firestore: Firestore){}

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

}
