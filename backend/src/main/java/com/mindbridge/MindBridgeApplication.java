package com.mindbridge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MindBridgeApplication {
    public static void main(String[] args) {
        SpringApplication.run(MindBridgeApplication.class, args);
    }
}
