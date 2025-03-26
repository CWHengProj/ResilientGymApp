package com.cw.ResilientApp.Demo.Model;

public class Exercise {
    private String exerciseName;
    private String muscleGroup;
    private float increment_used;
    private int reps;
    private int repCap;
    private float lastWeightUsed;
    private int timerDuration;
    public String getExerciseName() {
        return exerciseName;
    }
    public void setExerciseName(String exerciseName) {
        this.exerciseName = exerciseName;
    }
    public String getMuscleGroup() {
        return muscleGroup;
    }
    public void setMuscleGroup(String muscleGroup) {
        this.muscleGroup = muscleGroup;
    }
    public double getIncrement_used() {
        return increment_used;
    }
    public void setIncrement_used(float increment_used) {
        this.increment_used = increment_used;
    }
    public int getReps() {
        return reps;
    }
    public void setReps(int reps) {
        this.reps = reps;
    }
    public int getRepCap() {
        return repCap;
    }
    public void setRepCap(int repCap) {
        this.repCap = repCap;
    }
    public double getLastWeightUsed() {
        return lastWeightUsed;
    }
    public void setLastWeightUsed(float lastWeightUsed) {
        this.lastWeightUsed = lastWeightUsed;
    }
    public int getTimerDuration() {
        return timerDuration;
    }
    public void setTimerDuration(int timerDuration) {
        this.timerDuration = timerDuration;
    }
    
}
