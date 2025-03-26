import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from './services/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  authService = inject(AuthService)
  private _snackBar = inject(MatSnackBar);
  
  
  logOut() {
    this.authService.logout()
    this._snackBar.open('You have been logged out. See you again soon!','Okay')
  }
  ngOnInit(): void {
    this.authService.user$.subscribe(user=>{
      if (user){
        this.authService.currentUserSig.set({
          email:user.email!,
          username:user.displayName!
        })
      }
      else{
        this.authService.currentUserSig.set(null)
      }
      console.log(this.authService.currentUserSig())
    })
  }
  title = 'ResilientFrontEnd';
}
