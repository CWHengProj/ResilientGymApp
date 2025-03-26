package com.cw.ResilientApp.Demo.Repo;

import java.util.Date;
import java.util.List;
import java.util.Calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.cw.ResilientApp.Demo.Model.WorkoutHistory;

@Repository
public class FileRepo {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public List<WorkoutHistory> findByEmailAndDuration(String email, String duration) {
        Calendar cal = Calendar.getInstance();
        Date currentDate = new Date();
        cal.setTime(currentDate);
        String queryEmailandDuration;
        switch (duration) {
            case "week":
            queryEmailandDuration = "SELECT exerciseName, weightused, reps, datePerformed, email FROM exerciseHistory " +
                      "WHERE email = ? AND datePerformed >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)";
                break;
            case "month":
            queryEmailandDuration = "SELECT exerciseName, weightused, reps, datePerformed, email FROM exerciseHistory " +
                      "WHERE email = ? AND datePerformed >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)";
                break;
            case "year":
            queryEmailandDuration= "SELECT exerciseName, weightused, reps, datePerformed, email FROM exerciseHistory " +
                      "WHERE email = ? AND datePerformed >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)";
                break;
            default:
                // All time results - maybe premium feature next time
                queryEmailandDuration = "SELECT exerciseName, weightused, reps, datePerformed, email FROM exerciseHistory " +
                      "WHERE email = ?";
        }
        
        return jdbcTemplate.query(queryEmailandDuration, new Object[]{email}, workoutHistoryRowMapper);
    }
    
    private RowMapper<WorkoutHistory> workoutHistoryRowMapper = (rs, rowNum) -> {
        WorkoutHistory workout = new WorkoutHistory();
        workout.setExerciseName(rs.getString("exerciseName"));
        workout.setWeightused(rs.getFloat("weightused"));
        workout.setReps(rs.getInt("reps"));
        workout.setDatePerformed(rs.getDate("datePerformed"));
        workout.setEmail(rs.getString("email"));
        return workout;
    };
}