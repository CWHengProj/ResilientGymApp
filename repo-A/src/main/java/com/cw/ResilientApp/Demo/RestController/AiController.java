package com.cw.ResilientApp.Demo.RestController;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cw.ResilientApp.Demo.Model.UserDetails;
import com.cw.ResilientApp.Demo.Service.AIservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@CrossOrigin(origins="*",allowedHeaders = "*")
@RestController
@RequestMapping("/api/ai")
public class AiController {
    @Autowired
    AIservice aiService;
    @PostMapping("")
    public ResponseEntity<String> aiAnalysis(@RequestBody UserDetails userDetails) {
        String aiResponse =aiService.aiAnalysis(userDetails); 
        return ResponseEntity.ok(aiResponse);
    }
    
}
