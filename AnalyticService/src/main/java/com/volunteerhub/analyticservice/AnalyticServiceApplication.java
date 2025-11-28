package com.volunteerhub.analyticservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class AnalyticServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AnalyticServiceApplication.class, args);
	}

}
