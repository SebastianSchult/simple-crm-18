import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent {
  userID = '';

  constructor(private route:ActivatedRoute){}

  ngOnInit(){
    // 'bank' is the name of the route parameter
    this.userID = this.route.snapshot.params['id'];
    console.log( 'User ID:', this.userID);
}

}
