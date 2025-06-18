package com.engsoftware.apigateway.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;

@Configuration
public class AppConfig {

    @Bean
    public RestTemplate template(){
       return new RestTemplate();
    }

    @Bean
    public CorsWebFilter corsFilter() {
        return new CorsWebFilter(exchange -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowCredentials(true);
            config.addAllowedOrigin("http://127.0.0.1:5500");
            config.addAllowedHeader("*");
            config.addAllowedMethod("*");
            config.setMaxAge(3600L);
            return config;
        });
    }
}
