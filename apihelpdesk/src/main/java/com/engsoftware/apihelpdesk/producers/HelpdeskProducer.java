package com.engsoftware.apihelpdesk.producers;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.engsoftware.apihelpdesk.dto.EmailDto;
import com.engsoftware.apihelpdesk.models.HelpdeskModel;

@Component
public class HelpdeskProducer {

    @Autowired
    RabbitTemplate rabbitTemplate;

    @Value("${spring.rabbitmq.queue.name}")
    private String routingKey;

    public void publishMessageEmail(HelpdeskModel helpdeskModel) {
        var emailDto = new EmailDto();
        emailDto.setUserId(helpdeskModel.getId());
        emailDto.setEmailTo(helpdeskModel.getEmailUsername());
        emailDto.setSubject("Chamado aberto com sucesso!");
        emailDto.setText(helpdeskModel.getEmailUsername() + ", seja bem vindo(a)! \nSeu chamado foi aberto com sucesso e já será encaminhado para um técnico para resolvê-lo!");

        rabbitTemplate.convertAndSend("", routingKey, emailDto);
    }

}
