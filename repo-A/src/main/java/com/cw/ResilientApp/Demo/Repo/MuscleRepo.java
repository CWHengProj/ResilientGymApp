package com.cw.ResilientApp.Demo.Repo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.cw.ResilientApp.Demo.Model.Muscle;

@Repository
public class MuscleRepo {
    @Autowired
    MongoTemplate mTemplate;
    public List<Muscle> getMuscle() {
        List<Muscle> m= mTemplate.findAll(Muscle.class,"exercises");
        return m;
}
}
