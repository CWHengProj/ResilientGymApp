export interface Exercise {
    exerciseName: string;
    muscleGroup: string;
    increment_used: number;
    reps: number;
    repCap: number;
    lastWeightUsed: number;
    timerDuration: number;
  }
  
  export interface Deck {
    deckName: string;
    workoutDay: number;
    exercises: Exercise[];
  }
  
  export interface UserDetails {
    email: string;
    darkMode: boolean;
    nextWorkout: number;
    decks: Deck[];
  }
  
