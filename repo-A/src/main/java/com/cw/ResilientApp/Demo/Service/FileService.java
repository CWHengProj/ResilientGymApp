package com.cw.ResilientApp.Demo.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cw.ResilientApp.Demo.Model.WorkoutHistory;
import com.cw.ResilientApp.Demo.Repo.FileRepo;

@Service
public class FileService {
    @Autowired
    FileRepo fRepo;
       
    public List<WorkoutHistory> findByEmailAndDuration(String email, String duration) {
        return fRepo.findByEmailAndDuration(email, duration);
    }
}