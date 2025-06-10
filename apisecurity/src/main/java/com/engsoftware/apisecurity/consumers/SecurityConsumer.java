package com.engsoftware.apisecurity.consumers;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import com.engsoftware.apisecurity.dtos.AuthenticationRegister;

@Component
public class SecurityConsumer {

    @RabbitListener(queues = "${spring.rabbitmq.queue.name}")
    public void rlistenSecurityQueue(@Payload AuthenticationRegister authenticationRegister) {
        System.out.println("Received message: " + authenticationRegister.getEmail());
    }

}
