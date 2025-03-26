package com.cw.ResilientApp.Demo.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cw.ResilientApp.Demo.Model.UserInterface;
import com.cw.ResilientApp.Demo.Model.Deck;
import com.cw.ResilientApp.Demo.Model.Exercise;
import com.cw.ResilientApp.Demo.Model.UserDetails;
import com.mongodb.client.result.DeleteResult;

@Service
public class UserService {

    @Autowired
    MongoTemplate mongoTemplate;
    @Autowired
    JdbcTemplate jdbcTemplate;



    public UserDetails getUserByEmail(String email) {
        Query query = new Query();
        query.addCriteria(Criteria.where("email").is(email));
        UserDetails ud= mongoTemplate.findOne(query, UserDetails.class,"userDetails");
        return ud;
    }
    public UserDetails updateUserDetails(UserDetails uDetails, boolean isWorkoutComplete) {
        Query query = new Query(Criteria.where("email").is(uDetails.getEmail()));
                
        if (isWorkoutComplete) {
            addExerciseHistoryToSQL(uDetails);
            if(uDetails.getNextWorkout() >= (uDetails.getDecks().size()-1)){
                uDetails.setNextWorkout(0);
            } else {
                uDetails.setNextWorkout(uDetails.getNextWorkout()+1);
            }            
        }
        
        Update update = new Update()
            .set("darkMode", uDetails.isDarkMode())
            .set("nextWorkout", uDetails.getNextWorkout())
            .set("decks", uDetails.getDecks());
        
        return mongoTemplate.findAndModify(query, update, UserDetails.class, "userDetails");
    }
    public boolean deleteUserDetails(String email){
         Query query = new Query(Criteria.where("email").is(email));
         DeleteResult result= mongoTemplate.remove(query,"userDetails");
         if(result.getDeletedCount()>0){
            return true;
         }
         return false;
    }
    public String createUserInSQL(UserInterface user) {

        final String createUserQuery = """
            insert into users(email,username)
                values (?,?)        
                """;
        try{
            jdbcTemplate.update(createUserQuery, user.getEmail(),user.getUsername());
            return "user successfully created.";
        }
        catch (Exception e){
            System.err.println(e.getMessage());
            return "duplicate key found! User has already been created.";
        }
    }
    public String createUserInMongodb(UserInterface user) {
        try {
            UserDetails userDetails = new UserDetails();
            userDetails.setEmail(user.getEmail());
            userDetails.setDarkMode(true);
            userDetails.setNextWorkout(0);
            
            ArrayList<Deck> decks = new ArrayList<>();
            Deck defaultDeck = new Deck();
            defaultDeck.setDeckName("Default Workout");
            defaultDeck.setWorkoutDay(1);
            
            ArrayList<Exercise> exercises = new ArrayList<>();
            Exercise defaultExercise = new Exercise();
            defaultExercise.setExerciseName("Barbell_Curl");
            defaultExercise.setMuscleGroup("biceps");
            defaultExercise.setIncrement_used(2.5f);
            defaultExercise.setReps(8);
            defaultExercise.setRepCap(12);
            defaultExercise.setLastWeightUsed(10.0f);
            defaultExercise.setTimerDuration(180);
            
            exercises.add(defaultExercise);
            defaultDeck.setExercises(exercises);
            decks.add(defaultDeck);
            
            userDetails.setDecks(decks);
            
            mongoTemplate.save(userDetails);
            
            return "User details created successfully with default workout";
        } catch (Exception e) {
            return "Error creating user details: " + e.getMessage();
        }
    }
    @Transactional
    public String addExerciseHistoryToSQL(UserDetails uDetail) {
        final String addExerciseHistory = """
            insert into exerciseHistory(exerciseName, weightused, reps, datePerformed, email)
            values (?, ?, ?, ?, ?)
        """;
    
        List<Exercise> exercises = uDetail.getDecks().get(uDetail.getNextWorkout()).getExercises();
    
        try {
            for (Exercise exercise : exercises) {
                Date datePerformed = new Date();
                jdbcTemplate.update(addExerciseHistory, exercise.getExerciseName(), exercise.getLastWeightUsed(), exercise.getReps(), datePerformed, uDetail.getEmail());
            }
            return "User exercise history successfully created.";
        } catch (Exception e) {
            System.err.println("Error inserting exercise history: " + e.getMessage());
            throw new RuntimeException("Error inserting exercise history, transaction rolled back.");
        }
    }

    
}
