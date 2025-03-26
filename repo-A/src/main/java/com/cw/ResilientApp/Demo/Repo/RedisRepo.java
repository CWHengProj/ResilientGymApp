package com.cw.ResilientApp.Demo.Repo;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import com.cw.ResilientApp.Demo.Constant.Constants;
import com.cw.ResilientApp.Demo.Model.Deck;

@Repository
public class RedisRepo {
    @Autowired
    @Qualifier(Constants.template01)
    RedisTemplate<String, Object> template;

    public void saveWorkout(String uuid, List<Deck> decks, Integer seconds) {
        template.opsForHash().put(uuid, uuid,decks);
        template.expire(uuid, seconds, TimeUnit.SECONDS);
    }
    //for me to hardcode the boilerplate workouts without expiry into redis on cloud
    // public void saveWorkout(String uuid, List<Deck> decks, Integer seconds) {
    //     template.opsForHash().put("bodyPart", "bodyPart",decks);
    // }
    // public void saveWorkout(String uuid, List<Deck> decks, Integer seconds) {
    //     template.opsForHash().put("upperLwr", "upperLwr",decks);
    // }
    // public void saveWorkout(String uuid, List<Deck> decks, Integer seconds) {
    //     template.opsForHash().put("fullBody", "fullBody",decks);
    // }

    public List<Deck> getWorkout(String uuid) {
        List<Deck> workout = (List<Deck>)template.opsForHash().get(uuid,uuid);
        return workout;
    }

}