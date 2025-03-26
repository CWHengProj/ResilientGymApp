package com.cw.ResilientApp.Demo.RestController;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cw.ResilientApp.Demo.Model.Deck;
import com.cw.ResilientApp.Demo.Service.RedisService;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins="*",allowedHeaders = "*")
@RestController
@RequestMapping("/api/redis")
public class RedisController {
    
    @Autowired
    RedisService redisService;    
    
    @PostMapping("/share")
    public ResponseEntity<String> shareWorkout(@RequestBody List<Deck> decks)
    {   
        //temporarily add a workout into redis - other users can access with the same uuid
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        redisService.saveWorkout(uuid, decks);
        return ResponseEntity.ok(uuid);
        
    }
    
    @GetMapping("/{workoutId}")
    public ResponseEntity<List<Deck>> getWorkout(@PathVariable String workoutId) {
        List<Deck> sharedWorkout = redisService.getWorkout(workoutId);
        if (sharedWorkout != null) {
            return ResponseEntity.ok(sharedWorkout);
        }
        return ResponseEntity.status(404).body(null);
    }
}