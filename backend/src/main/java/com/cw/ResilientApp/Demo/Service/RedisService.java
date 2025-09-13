package com.cw.ResilientApp.Demo.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cw.ResilientApp.Demo.Model.Deck;
import com.cw.ResilientApp.Demo.Repo.RedisRepo;

import java.util.List;

@Service
public class RedisService {
    @Autowired
    RedisRepo redisRepository;
    
    public void saveWorkout(String uuid, List<Deck> decks) {
        redisRepository.saveWorkout(uuid, decks, 3600);
    }

    public List<Deck> getWorkout(String uuid) {
        return redisRepository.getWorkout(uuid);
    }
}
