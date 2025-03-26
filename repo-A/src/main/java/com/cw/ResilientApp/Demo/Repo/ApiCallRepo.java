package com.cw.ResilientApp.Demo.Repo;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
@Repository
public class ApiCallRepo {

    RestTemplate rt = new RestTemplate();
    public JsonObject getExerciseDetails(String exerciseName) throws IOException{
        //when users want to learn more about an exercise, query this page and display the results in a table form
        rt = new RestTemplate();
        String url = "https://raw.githubusercontent.com/wrkout/exercises.json/master/exercises/"+exerciseName+"/exercise.json";
        ResponseEntity<String> rawData= rt.getForEntity(url, String.class);
        try (InputStream is = new ByteArrayInputStream(rawData.getBody().getBytes())) {
            JsonReader reader = Json.createReader(is);
            JsonObject data = reader.readObject();
            return data;        
        }
    }
}
