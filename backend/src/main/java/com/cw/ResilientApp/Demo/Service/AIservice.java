package com.cw.ResilientApp.Demo.Service;

import java.io.StringReader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import com.cw.ResilientApp.Demo.Model.Deck;
import com.cw.ResilientApp.Demo.Model.Exercise;
import com.cw.ResilientApp.Demo.Model.UserDetails;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;

@Service
public class AIservice {
    @Value
    ("${gemini.apiKey}") String url;
    
    RestTemplate template = new RestTemplate();

    public String aiAnalysis(UserDetails userDetails) {
        List<Deck> decks =userDetails.getDecks();
        Map<String,Integer> userPlan = new HashMap<>();
        //tally the count for each muscle group to send to the ai
        for (Deck deck: decks){
            List<Exercise> e =deck.getExercises();
            for (Exercise ee: e){
                String muscleGroup =ee.getMuscleGroup();
                if(userPlan.containsKey(muscleGroup)){
                    userPlan.put(muscleGroup, userPlan.get(muscleGroup)+1);
                }
                else{
                    userPlan.put(muscleGroup,1);
                }
            }
        }
        String queryString = "Reply in less than 50 words. How balanced is this workout? What do you think of a weekly workout volume of:\n";
        for (Map.Entry<String, Integer> entry : userPlan.entrySet()) {
            String muscleGroup = entry.getKey();
            Integer count = entry.getValue();
            queryString += (count +" sets of "+muscleGroup+"\n");
        }
        RequestEntity request = RequestEntity.post(url)
                                            .contentType(MediaType.APPLICATION_JSON)
                                            .body(jsonConverter(queryString));
        ResponseEntity<String> response = template.exchange(request, String.class);
        String aiResponse = responseDecoder(response.getBody());
        return aiResponse;
    }

    private String jsonConverter(String queryString){
        JsonObject text = Json.createObjectBuilder().add("text",queryString).build();
        JsonArray jar = Json.createArrayBuilder().add(text).build();
        JsonObject parts = Json.createObjectBuilder().add("parts",jar).build();
        JsonArray partsArray = Json.createArrayBuilder().add(parts).build();
        JsonObject contents = Json.createObjectBuilder().add("contents",partsArray).build();
        return contents.toString();
    }
    private String responseDecoder(String responsebody){
        JsonObject job = Json.createReader(new StringReader(responsebody)).readObject();
        JsonObject candidates = job.getJsonArray("candidates").get(0).asJsonObject();
        JsonObject parts = candidates.getJsonObject("content").getJsonArray("parts").get(0).asJsonObject();
        return parts.getString("text");
    }
    
}
