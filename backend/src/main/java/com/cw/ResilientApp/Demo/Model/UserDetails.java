package com.cw.ResilientApp.Demo.Model;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="userDetails")
public class UserDetails {

    @Id    
    private ObjectId id; 
    private String email;
    private boolean darkMode;
    private int nextWorkout;
    private List<Deck> decks;
    public ObjectId getId() {
        return id;
    }
    public void setId(ObjectId id) {
        this.id = id;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public boolean isDarkMode() {
        return darkMode;
    }
    public void setDarkMode(boolean darkMode) {
        this.darkMode = darkMode;
    }
    public int getNextWorkout() {
        return nextWorkout;
    }
    public void setNextWorkout(int nextWorkout) {
        this.nextWorkout = nextWorkout;
    }
    public List<Deck> getDecks() {
        return decks;
    }
    public void setDecks(List<Deck> decks) {
        this.decks = decks;
    }

    
}
