import { Component, inject, OnInit } from '@angular/core';
import { Deck, UserDetails } from '../../models/user-details';
import { UserService } from '../../services/user.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Muscle } from '../../models/musclesDB';
import { UserStore } from '../../store/user.store';
import { map, Subscription, take } from 'rxjs';
import { AuthService } from '../../services/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-builder',
  standalone: false,
  templateUrl: './builder.component.html',
  styleUrl: './builder.component.css'
})
export class BuilderComponent implements OnInit {


  userStore = inject(UserStore);
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  userService = inject(UserService);
  private _snackBar = inject(MatSnackBar);

  defaultProgram!:FormGroup;
  sharedProgram!:FormGroup;
  userDetails!: UserDetails;
  private subscription = new Subscription();
  userForm!: FormGroup;
  muscleDB!: Muscle[];
  
  ngOnInit() {
    this.userForm = this.fb.group({
      workouts: this.fb.array([])
    });
    this.defaultProgram = this.fb.group({
      program: this.fb.control<string>('',Validators.required)
    });
    this.sharedProgram = this.fb.group({
      program: this.fb.control<string>('',Validators.required)
    });
    
    this.subscription.add(
      this.userService.fetchMuscleDatabase().subscribe(data => {
        this.muscleDB = data;
        if (this.userDetails) {
          this.populateForm();
        }
      })
    );
    
    this.subscription.add(
      this.userStore.userDetails$.subscribe({
        next: (data) => {
          this.userDetails = data;
          if (!!this.muscleDB) {
            this.populateForm();
          }
        },
        error: (error) => {
          console.error('Error fetching user details:', error);
        }
      })
    );

    this.auth.user$.pipe(
      take(1),
      map(user => user?.email || '')
    ).subscribe(email => {
      this.userStore.getUserDetails(email);
    })
  }
  
  formatMuscleGroup(muscleId: string): string {
    return muscleId
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  formatExerciseName(exerciseName: string): string {
    return exerciseName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getExercisesForMuscle(muscleGroupId: string): string[] {
    if (!muscleGroupId || !this.muscleDB) return [];
    
    const muscleGroup = this.muscleDB.find(m => m._id === muscleGroupId);
    return muscleGroup ? muscleGroup.exercises : [];
  }

  onMuscleGroupChange(workoutIndex: number, exerciseIndex: number): void {
    const exerciseControl = this.exercises(workoutIndex).at(exerciseIndex) as FormGroup;
    const muscleGroupValue = exerciseControl.get('muscleGroup')?.value;
    
    const availableExercises = this.getExercisesForMuscle(muscleGroupValue);
    
    if (availableExercises.length > 0) {
      exerciseControl.get('exerciseName')?.setValue(availableExercises[0]);
    } else {
      exerciseControl.get('exerciseName')?.setValue('');
    }
  }

  populateForm() {
    while (this.workouts().length) {
      this.workouts().removeAt(0);
    }
    
    if (this.userDetails && this.userDetails.decks && this.userDetails.decks.length > 0) {
      this.userDetails.decks.forEach(deck => {
        const workoutGroup = this.newworkout();
        
        workoutGroup.patchValue({
          deckName: deck.deckName,
          workoutDay: deck.workoutDay
        });
        
        const exercisesArray = workoutGroup.get('exercises') as FormArray;
        
        while (exercisesArray.length) {
          exercisesArray.removeAt(0);
        }
        
        if (deck.exercises && deck.exercises.length > 0) {
          deck.exercises.forEach(exercise => {
            const exerciseGroup = this.fb.group({
              muscleGroup: [exercise.muscleGroup, Validators.required],
              exerciseName: [exercise.exerciseName, Validators.required],
              increment_used: [exercise.increment_used, Validators.required],
              reps: [exercise.reps, Validators.required],
              repCap: [exercise.repCap, Validators.required],
              lastWeightUsed: [exercise.lastWeightUsed, Validators.required],
              timerDuration: [exercise.timerDuration, Validators.required]
            });
            exercisesArray.push(exerciseGroup);
          });
        }
        
        this.workouts().push(workoutGroup);
      });
    } else {
      this.addworkout();
    }
    
  }
  getMuscleGroupValue(workoutIndex: number, exerciseIndex: number): string {
    try {
      const exercisesArray = this.exercises(workoutIndex);
      if (!exercisesArray) return '';
      
      const exerciseGroup = exercisesArray.at(exerciseIndex) as FormGroup;
      if (!exerciseGroup) return '';
      
      const muscleGroupValue = exerciseGroup.get('muscleGroup')?.value;
      return muscleGroupValue || '';
    } catch (error) {
      console.error('Error retrieving muscle group value:', error);
      return '';
    }
  }
  workouts(): FormArray {
    return this.userForm.get('workouts') as FormArray;
  }
  
  newworkout(): FormGroup {
    return this.fb.group({
      deckName: ['', Validators.required],
      workoutDay: [this.getNextWorkoutDay(), Validators.required],
      exercises: this.fb.array([])
    });
  }
  
  getNextWorkoutDay(): number {
    return this.workouts().length + 1;
  }
  
  addworkout() {
    this.workouts().push(this.newworkout());
  }
  
  removeworkout(workoutIndex: number) {
    this.workouts().removeAt(workoutIndex);
    this.updateWorkoutDays();
  }
  
  updateWorkoutDays() {
    const workoutsArray = this.workouts();
    for (let i = 0; i < workoutsArray.length; i++) {
      const workoutGroup = workoutsArray.at(i) as FormGroup;
      workoutGroup.patchValue({ workoutDay: i + 1 });
    }
  }
  
  exercises(workoutIndex: number): FormArray {
    return this.workouts()
      .at(workoutIndex)
      .get('exercises') as FormArray;
  }
  
  newexercise(): FormGroup {
    const defaultMuscleGroup = this.muscleDB.length > 0 ? this.muscleDB[0]._id : 'biceps';
    const defaultExercise = this.muscleDB.length > 0 && this.muscleDB[0].exercises.length > 0 
                           ? this.muscleDB[0].exercises[0] 
                           : 'Barbell_Curl';
    
    return this.fb.group({
      muscleGroup: [defaultMuscleGroup, Validators.required],
      exerciseName: [defaultExercise, Validators.required],
      increment_used: [2.5, Validators.required],
      reps: [5, Validators.required],
      repCap: [12, Validators.required],
      lastWeightUsed: [10, Validators.required],
      timerDuration: [180, Validators.required]
    });
  }
  
  addexercise(workoutIndex: number) {
    if (this.exercises.length<25){
      this.exercises(workoutIndex).push(this.newexercise());
    }
    else{
      this._snackBar.open('Enough exercises for now.','Okay');
    }
  }
  
  removeexercise(workoutIndex: number, exerciseIndex: number) {
    this.exercises(workoutIndex).removeAt(exerciseIndex);
  }
  
  updateUser() {
    if (this.userDetails) {
      const updatedUserDetails = {
        ...this.userDetails,
        decks: this.userForm.value.workouts
      };      
      this.userStore.updateUserDetails([updatedUserDetails, false]);
      
    }
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  aiAnalysis() {
    this.userService.aiAnalyser(this.userDetails).subscribe(
      {
        next: (response)=> this._snackBar.open(response,'Okay'),
        error: (err) => console.log(err)
      }
    )
  }
  shareWorkout() {
    if(this.workouts().length === 0) {
      this._snackBar.open('You do not have any workouts to share.', 'Okay');
      return
    }
    const formValue = this.userForm.value;
    const decks: Deck[] = formValue.workouts.map((workout: any) => {
      return {
        deckName: workout.deckName,
        workoutDay: workout.workoutDay,
        exercises: workout.exercises
      }
    })
    this.userService.shareWorkout(decks).subscribe({
      next: (response: string) => {
        this._snackBar.open(`Share this code with your friends: ${response}`, 'Copy', {
          duration: 10000
        }).onAction().subscribe(() => {
          navigator.clipboard.writeText(response);
          this._snackBar.open('Copied to clipboard!', 'Okay', { duration: 2000 });
        });
      },
      error: (err:string) => {
        console.error('Error sharing workout:', err);
        this._snackBar.open('Failed to share workout. Please try again.', 'Okay');
      }
    });
  }
  usePreBuiltWorkout(programId:string) {
    this.userService.getWorkout(programId).subscribe({
      next: (decks: Deck[]) => {
        if (!decks || decks.length === 0) {
          this._snackBar.open('Program not found. It could be expired', 'Okay');
          return;
        }
        
        this.populateFormWithDecks(decks);
        this._snackBar.open(`Loaded program successfully!`, 'Okay');
      },
      error: (err:string) => {
        console.error('Error loading workout:', err);
        this._snackBar.open('Failed to load program', 'Okay');
      }
    });
  }
  private populateFormWithDecks(decks: Deck[]) {
    while (this.workouts().length) {
      this.workouts().removeAt(0);
    }
    
    decks.forEach(deck => {
      const workoutGroup = this.fb.group({
        deckName: [deck.deckName, Validators.required],
        workoutDay: [deck.workoutDay, Validators.required],
        exercises: this.fb.array([])
      });
      
      const exercisesArray = workoutGroup.get('exercises') as FormArray;
      
      deck.exercises.forEach(exercise => {
        const exerciseGroup = this.fb.group({
          muscleGroup: [exercise.muscleGroup, Validators.required],
          exerciseName: [exercise.exerciseName, Validators.required],
          increment_used: [exercise.increment_used, Validators.required],
          reps: [exercise.reps, Validators.required],
          repCap: [exercise.repCap, Validators.required],
          lastWeightUsed: [exercise.lastWeightUsed, Validators.required],
          timerDuration: [exercise.timerDuration, Validators.required]
        });
        
        exercisesArray.push(exerciseGroup);
      });
      
      this.workouts().push(workoutGroup);
    })
  }
}