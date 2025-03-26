import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from './services/auth-service.service';
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthGuard implements CanActivate {
  private _snackBar = inject(MatSnackBar);
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

      return this.auth.user$.pipe(
           take(1),
           map(user => !!user), 
           tap(loggedIn => {
             if (!loggedIn) {
               this._snackBar.open('Access denied. Please log in.','Okay');
               this.router.navigate(['/login']);
             }
             else{
             }
         })
    )
  }
}