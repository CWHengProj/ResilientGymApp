package com.cw.ResilientApp.Demo.Model;

public class UserInterface {
    String email;
    String username;
    
    public UserInterface(String email, String username) {
        this.email = email;
        this.username = username;
    }
    public UserInterface() {
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    
}
