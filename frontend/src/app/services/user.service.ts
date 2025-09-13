import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { Deck, UserDetails } from '../models/user-details';
import { Muscle } from '../models/musclesDB';
import { User } from '@angular/fire/auth';
import { UserInterface } from '../models/user-interface';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  requestWorkoutHistory(email: string, duration: string) {
    window.location.href = `${environment.baseUrl}/api/workout/exportCSV?email=${email}&duration=${duration}`;
    console.log("Workout history download initiated.");
  }
  createUser(user$: Observable<User | null>) {
    user$.pipe(take(1)).subscribe({
      next: (firebaseUser) => {
        if (firebaseUser) {
          const userInterface: UserInterface = {
            email: firebaseUser.email || '',
            username: firebaseUser.displayName || ''
          };
          
          console.log('Sending to backend:', userInterface);
          
          this.http.post<string>(`${this.apiUrl}/createUser`, userInterface).subscribe({
            next: (response) => console.log("Item created in database:", response),
            error: (err) => console.error("Error creating user:", err)
          });
        } else {
          console.error("No user data available");
        }
      },
      error: (err) => console.error("Error getting user data:", err)
    });
  }
  private apiUrl = `${environment.baseUrl}/api/workout`;
  private aiUrl = `${environment.baseUrl}/api/ai`;
  private redisUrl = `${environment.baseUrl}/api/redis`;
  
  http = inject(HttpClient);
  getUserDetails(email: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${this.apiUrl}/${email}`);
  }
  updateUserDetails(user: UserDetails, isWorkout:boolean): Observable<UserDetails> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<UserDetails>(`${this.apiUrl}/update/${isWorkout}`, user, { headers });
  }
  fetchMuscleDatabase():Observable<Muscle[]> {
    return this.http.get<Muscle[]>(`${this.apiUrl}/getMuscle`);
  }
  clearUserData(email:string){
    return this.http.delete<string>(`${this.apiUrl}/${email}`)
  }
  aiAnalyser(userDetails: UserDetails){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    });
    
    return this.http.post(`${this.aiUrl}`, userDetails, {
      headers: headers,
      responseType: 'text'
    });
  }
  shareWorkout(decks: Deck[]): Observable<string> {
    return this.http.post(`${this.redisUrl}/share`, decks, {
      responseType: 'text'
    });
  }
  getWorkout(workoutId: string): Observable<Deck[]> {
    return this.http.get<Deck[]>(`${this.redisUrl}/${workoutId}`)
  }
}
