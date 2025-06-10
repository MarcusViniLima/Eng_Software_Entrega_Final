package com.engsoftware.apihelpdesk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.engsoftware.apihelpdesk.configs.FileStorageConfig;

@SpringBootApplication
@EnableConfigurationProperties({
	FileStorageConfig.class
})
public class ApihelpdeskApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApihelpdeskApplication.class, args);
	}

}
