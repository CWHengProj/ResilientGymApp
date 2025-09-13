package com.cw.ResilientApp.Demo.Model;

import java.util.List;

public class Deck {
    private String deckName;
    private int workoutDay;
    private List<Exercise> exercises;
    public String getDeckName() {
        return deckName;
    }
    public void setDeckName(String deckName) {
        this.deckName = deckName;
    }
    public int getWorkoutDay() {
        return workoutDay;
    }
    public void setWorkoutDay(int workoutDay) {
        this.workoutDay = workoutDay;
    }
    public List<Exercise> getExercises() {
        return exercises;
    }
    public void setExercises(List<Exercise> exercises) {
        this.exercises = exercises;
    }

    
}
