package com.engsoftware.apisecurity.consumers;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
public class SecurityConsumer {

    @RabbitListener(queues = "${spring.rabbitmq.queue.name}")
    public void rlistenSecurityQueue(@Payload String message) {
        System.out.println("Received message: " + message);
    }

}
