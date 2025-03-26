import { ComponentStore } from '@ngrx/component-store';
import { UserDetails } from '../models/user-details';
import { inject, Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { Observable, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

const INIT: UserDetails = {
  email: '',
  darkMode: false,
  nextWorkout: 0,
  decks: [],
};

@Injectable({
  providedIn: 'root'
})
export class UserStore extends ComponentStore<UserDetails> {
  private userService = inject(UserService);
  private router = inject(Router);
  private _snackBar = inject(MatSnackBar);
  
  constructor() {
    super(INIT);
  }
  
  readonly userDetails$: Observable<UserDetails> = this.select(state => state);
  
  readonly getUserDetails = (email: string) => {
    return this.userService.getUserDetails(email).pipe(
      tap({
        next: (userDetails) => {
          if (!userDetails || !userDetails.email || !userDetails.decks || userDetails.decks.length === 0) {
            console.warn('User details empty or invalid, redirecting to builder');
            this.router.navigate(['/builder']);
          } else {
            this.setState(userDetails);
          }
        },
        error: (error) => {
          console.error('Error loading user details:', error);
          this.router.navigate(['/builder']);
        }
      })
    ).subscribe();
  };
  readonly updateUserDetails = this.effect((params$: Observable<[UserDetails, boolean]>) => {
    return params$.pipe(
      switchMap(([userDetails, isWorkout]) => 
        this.userService.updateUserDetails(userDetails, isWorkout).pipe(
          tap({
            next: (updatedUserDetails) => {
              this.setState(updatedUserDetails);
              this.router.navigate(['/workout']);
            },
            error: (error) => {
              this._snackBar.open(`Error updating user: ${error.message || 'Unknown error'}`);

            }
          })
        )
      )
    );
  });
  
}