package com.cw.ResilientApp.Demo.RestController;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cw.ResilientApp.Demo.Model.UserInterface;
import com.cw.ResilientApp.Demo.Model.WorkoutHistory;
import com.cw.ResilientApp.Demo.Model.Muscle;
import com.cw.ResilientApp.Demo.Model.UserDetails;
import com.cw.ResilientApp.Demo.Repo.ApiCallRepo;
import com.cw.ResilientApp.Demo.Service.FileService;
import com.cw.ResilientApp.Demo.Service.MuscleService;
import com.cw.ResilientApp.Demo.Service.UserService;
import com.opencsv.CSVWriter;
import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;
import com.opencsv.exceptions.CsvDataTypeMismatchException;
import com.opencsv.exceptions.CsvRequiredFieldEmptyException;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@CrossOrigin(origins="*",allowedHeaders = "*")
@RestController
@RequestMapping("/api/workout/")
public class Workoutcontroller {

    @Autowired
    UserService uService;
    @Autowired
    ApiCallRepo repo;
    @Autowired
    MuscleService mService;
    @Autowired
    FileService fService;

    @GetMapping("getExerciseInfo")
    public ResponseEntity<String> getExerciseInfo(@RequestParam(required=true) String exerciseName) throws IOException {
        return ResponseEntity.status(200).header("Content-Type","application/json").body(repo.getExerciseDetails(exerciseName).toString());
    }

    @GetMapping("/{email}")
    public UserDetails getUser(@PathVariable String email) {
        return uService.getUserByEmail(email);
    }
    @PostMapping("createUser")
    public ResponseEntity<String> createUser(@RequestBody UserInterface user) {
        String payload = this.uService.createUserInSQL(user);
        this.uService.createUserInMongodb(user);
        return ResponseEntity.ok(payload);
    }
    
    @PostMapping("update/{isWorkoutComplete}")
    public UserDetails updateUser(@RequestBody UserDetails uDetails, @PathVariable boolean isWorkoutComplete){
        return uService.updateUserDetails(uDetails, isWorkoutComplete);
    }
    @GetMapping("getMuscle")
    public List<Muscle> getMuscle(){
        return mService.getMuscle();
    }
    @DeleteMapping("/{email}")
    public ResponseEntity<String> deleteUserDetails(@PathVariable String email){
        String payload ="User details have been deleted.";
        if(!uService.deleteUserDetails(email)){
            payload="could not find your details.";
        }
        return ResponseEntity.ok(payload);
    }
    @GetMapping("/exportCSV")
    public void exportUserHistoryCSV(@RequestParam String email, @RequestParam String duration,
            HttpServletResponse response) throws CsvDataTypeMismatchException, CsvRequiredFieldEmptyException, IOException {
        
        String fileName = "workout-history-" + email + "-" + duration + ".csv";

        response.setContentType("text/csv");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"");
        
        StatefulBeanToCsv<WorkoutHistory> writer = new StatefulBeanToCsvBuilder<WorkoutHistory>(response.getWriter())
                .withSeparator(CSVWriter.DEFAULT_SEPARATOR)
                .withOrderedResults(true)
                .build();
        
        List<WorkoutHistory> workoutHistory = fService.findByEmailAndDuration(email, duration);
        writer.write(workoutHistory);
    }

    
}
