package com.cw.ResilientApp.Demo.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cw.ResilientApp.Demo.Model.Muscle;
import com.cw.ResilientApp.Demo.Repo.MuscleRepo;

@Service
public class MuscleService {
    @Autowired
    MuscleRepo mRepo;
    public List<Muscle> getMuscle() {
        return mRepo.getMuscle();
    }
    
}
