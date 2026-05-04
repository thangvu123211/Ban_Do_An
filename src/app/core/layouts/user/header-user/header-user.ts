import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/auth.service';
import { MATERIAL } from '../../../../Shared/material';

@Component({
  selector: 'app-header-user',
  standalone: true,
  imports: [MATERIAL],
  templateUrl: './header-user.html',
  styleUrl: './header-user.scss'
})
export class HeaderUser implements OnInit {



  constructor(private snackBar: MatSnackBar , private authService : AuthService) {}

  ngOnInit(): void {

  }



  logout(){
    this.authService.logout();
  }
}
