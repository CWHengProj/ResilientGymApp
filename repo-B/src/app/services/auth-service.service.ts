import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';
import { from, map, Observable, take } from 'rxjs';
import { UserInterface } from '../models/user-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<UserInterface | null | undefined>(undefined);
  register(email:string, username:string, password:string):Observable<void>{
    const promise = createUserWithEmailAndPassword(this.firebaseAuth,email,password)
                    .then(response=>updateProfile(response.user,{displayName:username}))
                    return from(promise);
  };
  login(email:string,password:string):Observable<void>{
    const promise = signInWithEmailAndPassword(this.firebaseAuth,email,password).then(()=>{})
    return from(promise);
  }
  logout():Observable<void>{
    const promise =signOut(this.firebaseAuth);
    return from(promise);
  }
  isLoggedIn():Observable<boolean>{
    return this.user$.pipe(take(1), map(user => !!user));
  }
}
