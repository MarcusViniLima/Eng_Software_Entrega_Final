package com.engsoftware.apifuncionario.producers;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.engsoftware.apifuncionario.dtos.AuthenticationResponse;
import com.engsoftware.apifuncionario.model.FuncionarioModel;
import com.engsoftware.apifuncionario.model.enums.Setor;

@Component
public class FuncionarioProducer {
    
    @Autowired
    RabbitTemplate rabbitTemplate;

    @Value("${spring.rabbitmq.queue.name}")
    private String routingKey;

    public void publishMessageUser(FuncionarioModel funcionario) {
        var AuthenticationResponse = new AuthenticationResponse();
        AuthenticationResponse.setEmail(funcionario.getEmail());
        AuthenticationResponse.setPassword(funcionario.getPassword());
        if(funcionario.getSetor() == Setor.TI){
            AuthenticationResponse.setAcessLevel("ti");
        }else{
            AuthenticationResponse.setAcessLevel("user");
        }
        rabbitTemplate.convertAndSend("",routingKey, AuthenticationResponse);
    }

}
