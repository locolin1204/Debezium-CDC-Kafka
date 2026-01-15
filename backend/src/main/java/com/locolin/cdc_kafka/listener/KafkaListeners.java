package com.locolin.cdc_kafka.listener;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.locolin.cdc_kafka.constant.Operation;
import com.locolin.cdc_kafka.model.Order;
import com.locolin.cdc_kafka.model.dto.OrderResponseDto;
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
    public void orderListener(@Payload(required = false) String data) throws JsonProcessingException {

        if (data == null) {
            System.out.println("Received a tombstone record. Skipping...");
            return;
        }

        String opString = extractObjectFromJsonPayload(data, String.class, "op");
        Operation op = mapOperation(opString);

        Order order = extractObjectFromJsonPayload(data, Order.class, op == Operation.DELETE ? "before": "after");

        OrderResponseDto orderResponseDto = new OrderResponseDto();
        orderResponseDto.setOrder(order);
        orderResponseDto.setOp(op);

        System.out.println("Extracted Order: " + orderResponseDto);
        messagingTemplate.convertAndSend("/topic/order", orderResponseDto);
    }

    private <T> T extractObjectFromJsonPayload(String data, Class<T> clazz, String fieldname) throws JsonProcessingException {
        JsonNode event = objectMapper.readValue(data, JsonNode.class);
        String afterChange = event.get("payload").get(fieldname).toString();
        return objectMapper.readValue(afterChange, clazz);
    }

    private Operation mapOperation(String op) {
        return switch (op) {
            case "c" -> Operation.CREATE;
            case "u" -> Operation.UPDATE;
            case "d" -> Operation.DELETE;
            default -> Operation.CREATE;
        };
    }
}
