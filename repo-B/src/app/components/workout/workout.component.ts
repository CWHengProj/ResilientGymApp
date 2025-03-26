import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Deck, UserDetails } from '../../models/user-details'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserStore } from '../../store/user.store';
import { map, Subscription, take } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { ExerciseDetails } from '../../models/exercise-details';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-workout',
  standalone: false,
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.css'
})
export class WorkoutComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private router = inject(Router);
  private _snackBar = inject(MatSnackBar);
  
  userStore = inject(UserStore);
  fb: FormBuilder = inject(FormBuilder);
  auth = inject(AuthService);
  userDetails!: UserDetails;
  userForm!: FormGroup;
  serveDeck!: Deck;
  loading = true;
  checkboxStates: boolean[] = [];
  email:string = '';
  http= inject(HttpClient);
  
  ngOnInit(): void {
    this.auth.user$.pipe(take(1),map(user => user?.email||''))
                    .subscribe(email => 
                    {
                      this.email= email
                      this.userStore.getUserDetails(this.email)
                    });
    this.subscription.add(
      this.userStore.userDetails$.subscribe({
        next: (data) => {
          this.userDetails = data;
          this.serveDeck = this.userDetails.decks[this.userDetails.nextWorkout];
          this.createForm();
          this.checkboxStates = new Array(this.serveDeck.exercises.length).fill(false);
          this.loadCheckboxStates();
          this.loadSavedFormState();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching user details:', err);
          this.loading = true;
        }
      })
    );
  }

  saveFormState(): void {
    if (this.userForm) {
      localStorage.setItem("workout", JSON.stringify(this.userForm.value));
    }
  }

  loadSavedFormState(): void {
    const savedData = localStorage.getItem("workout");
    if (savedData && this.userForm) {
      try {
        const formValues = JSON.parse(savedData);
        this.userForm.patchValue(formValues);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }
  saveCheckboxStates(): void {
    localStorage.setItem('workout-checkboxes', JSON.stringify(this.checkboxStates));
  }
  loadCheckboxStates(): void {
    const savedStates = localStorage.getItem('workout-checkboxes');
    if (savedStates) {
      try {
        const states = JSON.parse(savedStates);
        if (states.length === this.checkboxStates.length) {
          this.checkboxStates = states;
        }
      } catch (error) {
        console.error('Error parsing saved checkbox states:', error);
      }
    }
  }
  toggleCheckbox(index: number): void {
    this.checkboxStates[index] = !this.checkboxStates[index];
    this.saveCheckboxStates();
  }
  createForm() {
    this.userForm = this.fb.group({
      exercises: this.fb.array(this.serveDeck.exercises.map(exercise => this.createExerciseForm(exercise)))
    })
  }
  
  createExerciseForm(exercise: any): FormGroup {
    let defaultWeight = this.calculateDefaultWeight(exercise);
    
    return this.fb.group({
      reps: this.fb.control(exercise.reps, Validators.required),
      weightUsed: this.fb.control(defaultWeight, [Validators.required, this.weightIncrementValidator(exercise.increment_used)]),
      repCap: this.fb.control(exercise.repCap),
      increment_used: this.fb.control(exercise.increment_used),
      timerDuration: this.fb.control(exercise.timerDuration)
    });
  }

  formatExerciseName(exerciseName: string | undefined): string {
    if (!exerciseName) return '';
    return exerciseName.split('_').join(' ');
  }

  getUserExerciseName(index: number): string {
    try {
      return this.userDetails?.decks[this.userDetails.nextWorkout]?.exercises[index]?.exerciseName || '';
    } catch {
      return '';
    }
  }

  calculateDefaultWeight(exercise: any): number {
    if (exercise.reps >= exercise.repCap) {
      const newWeight = exercise.lastWeightUsed + exercise.increment_used;
      exercise.reps = 5;
      return this.roundToNearestIncrement(newWeight, exercise.increment_used);
    }    
    return this.roundToNearestIncrement(exercise.lastWeightUsed, exercise.increment_used);
  }

  roundToNearestIncrement(weight: number, increment: number): number {
    return Math.round(weight / increment) * increment;
  }

  weightIncrementValidator(increment: number) {
    return (control: any) => {
      const value = control.value;
      if (value === null || value === undefined) return null;
      const remainder = (value % increment).toFixed(2);
      if (remainder !== '0.00' && Math.abs(Number(remainder) - increment) > 0.001) {
        return { invalidIncrement: { value, increment } };
      }
      return null;
    }
  }

  get exercisesArray(): FormArray {
    return this.userForm.get('exercises') as FormArray;
  }
  
  getExerciseDetails(exerciseName: string) {
    
    this.http.get<ExerciseDetails>(`${environment.baseUrl}/api/workout/getExerciseInfo?exerciseName=${exerciseName}`).subscribe({
      next: (data) => {
        this._snackBar.open(data.instructions.join('\n'),'Okay');

      },
      error: (error) => {
        console.error('Error fetching exercise details:', error);
      }
    });
  }
  
  fixWeightIncrement(index: number): void {
    const exerciseControl = this.exercisesArray.at(index);
    const weight = exerciseControl.get('weightUsed')?.value;
    const increment = exerciseControl.get('increment_used')?.value;
    
    if (weight !== null && weight !== undefined && increment) {
      const correctedWeight = this.roundToNearestIncrement(weight, increment);
      exerciseControl.get('weightUsed')?.setValue(correctedWeight);
    }
  }

  updateUser(): void {
    if (!this.userDetails || this.userForm.invalid) {
      return;
    }

    const updatedExercises = this.userForm.value.exercises;
    this.serveDeck.exercises.forEach((exercise, index) => {
      exercise.reps = updatedExercises[index].reps;
      exercise.lastWeightUsed = this.roundToNearestIncrement(
        updatedExercises[index].weightUsed, 
        exercise.increment_used
      )
    });
    
    this.subscription.add(
      this.userStore.updateUserDetails([this.userDetails, true])
    );
    this._snackBar.open('Great work today!','Okay');
    localStorage.removeItem("workout");
  }

  saveBeforeNavigation(): void {
    if (this.userForm && !this.userForm.pristine) {
      this.saveFormState();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.saveFormState();
  }
}