package com.locolin.cdc_kafka.listener;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.locolin.cdc_kafka.model.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class KafkaListeners {

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "${kafka.cdc.topic.order}", groupId = "${kafka.cdc.group.id}")
    public void orderListener(@Payload String data) throws JsonProcessingException {
        Order order = extractAfterObjectFromJson(data, Order.class);
        System.out.println("Extracted Order: " + order);
        messagingTemplate.convertAndSend("/topic/order", order);
    }

    private <T> T extractAfterObjectFromJson(String data, Class<T> clazz) throws JsonProcessingException {
        JsonNode event = objectMapper.readValue(data, JsonNode.class);
        String afterChange = event.get("payload").get("after").toString();
        return objectMapper.readValue(afterChange, clazz);
    }
}
