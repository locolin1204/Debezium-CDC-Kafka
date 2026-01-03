package com.locolin.cdc_kafka.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Value("${kafka.cdc.topic.order}")
    private String orderTopic;

    @Bean
    public NewTopic cdcTopic(){
        return TopicBuilder
                .name(orderTopic)
                .build();
    }
}
