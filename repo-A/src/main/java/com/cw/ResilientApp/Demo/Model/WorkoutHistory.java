package com.cw.ResilientApp.Demo.Model;

import java.util.Date;

public class WorkoutHistory {
    private String exerciseName;
    private Float weightused;
    private Integer reps;
    private Date datePerformed;
    private String email;
    public WorkoutHistory(String exerciseName, Float weightused, Integer reps, Date datePerformed, String email) {
        this.exerciseName = exerciseName;
        this.weightused = weightused;
        this.reps = reps;
        this.datePerformed = datePerformed;
        this.email = email;
    }
    public WorkoutHistory() {
    }
    public String getExerciseName() {
        return exerciseName;
    }
    public void setExerciseName(String exerciseName) {
        this.exerciseName = exerciseName;
    }
    public Float getWeightused() {
        return weightused;
    }
    public void setWeightused(Float weightused) {
        this.weightused = weightused;
    }
    public Integer getReps() {
        return reps;
    }
    public void setReps(Integer reps) {
        this.reps = reps;
    }
    public Date getDatePerformed() {
        return datePerformed;
    }
    public void setDatePerformed(Date datePerformed) {
        this.datePerformed = datePerformed;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    
}
