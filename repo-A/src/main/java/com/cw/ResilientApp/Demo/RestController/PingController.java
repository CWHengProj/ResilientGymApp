package com.cw.ResilientApp.Demo.RestController;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/ping")
public class PingController {
    @GetMapping("")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
    
}
