package com.cw.ResilientApp.Demo.Model;

public class Email {
    String address;
    String comment;
    String urgency;
    
    public Email(String address, String comment, String urgency) {
        this.address = address;
        this.comment = comment;
        this.urgency = urgency;
    }
    public Email() {
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public String getComment() {
        return comment;
    }
    public void setComment(String comment) {
        this.comment = comment;
    }
    public String getUrgency() {
        return urgency;
    }
    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }
    
}
