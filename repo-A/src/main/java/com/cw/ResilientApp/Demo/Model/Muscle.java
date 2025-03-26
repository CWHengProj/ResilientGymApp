package com.cw.ResilientApp.Demo.Model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="exercises")
public class Muscle {
    @Id
    private String _id;
    private List<String> exercises;
    public String get_id() {
        return _id;
    }
    public void set_id(String _id) {
        this._id = _id;
    }

    public Muscle() {
    }
    public List<String> getExercises() {
        return exercises;
    }
    public void setExercises(List<String> exercises) {
        this.exercises = exercises;
    }
    
}
