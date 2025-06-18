package com.engsoftware.apisecurity.consumers;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import com.engsoftware.apisecurity.dtos.AuthenticationRegister;
import com.engsoftware.apisecurity.service.UserService;

@Component
public class SecurityConsumer {

    @Autowired
    private UserService userService;

    @RabbitListener(queues = "${spring.rabbitmq.queue.name}")
    public void rlistenSecurityQueue(@Payload AuthenticationRegister authenticationRegister) throws Exception {
        try {
            userService.save(authenticationRegister);
            System.out.println("Mensagem recebida e processada: " + authenticationRegister);
        } catch (Exception e) {
            System.err.println("Erro ao processar mensagem: " + e.getMessage());
            e.printStackTrace();
        }
    }

}
