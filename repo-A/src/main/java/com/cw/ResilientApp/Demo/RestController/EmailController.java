package com.cw.ResilientApp.Demo.RestController;

import org.springframework.web.bind.annotation.RestController;

import com.cw.ResilientApp.Demo.Model.Email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@CrossOrigin(origins="*",allowedHeaders = "*")
@RestController
@RequestMapping("/api")
public class EmailController {
    //for user feedback
    @Value
    ("${owner.email}") String ownerEmail;
    @Autowired
    JavaMailSender mailSender;
    @PostMapping("/sendEmail")
    public ResponseEntity<String> sendEmail(@RequestBody Email email) {
        try{
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(email.getAddress());
            message.setTo(ownerEmail);
            message.setSubject("User feedback: "+email.getUrgency());
            message.setText(email.getComment());
            mailSender.send(message);
            return ResponseEntity.ok("Success!");
        }
        catch (Exception e){
            return ResponseEntity.ok(e.getMessage());
        }

    }   
}
