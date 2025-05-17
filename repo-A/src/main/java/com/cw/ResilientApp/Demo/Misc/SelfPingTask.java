package com.cw.ResilientApp.Demo.Misc;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class SelfPingTask {
    private final RestTemplate rt;

    @Value
    ("${backend.url}") String url;

    public SelfPingTask(RestTemplateBuilder rtb) {
        this.rt = rtb.build();
    }
    @Scheduled(fixedRate= 1000 * 10 * 60)
    public void pingSelf() {
        String selfUrl = url;
        try{
            rt.getForEntity(selfUrl, String.class);
        }
        catch (Exception e) {
            System.err.println("Self pinging has failed: " + e.getMessage());
        }
    }
}
