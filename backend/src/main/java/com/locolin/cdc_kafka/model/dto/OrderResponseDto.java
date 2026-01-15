package com.locolin.cdc_kafka.model.dto;

import com.locolin.cdc_kafka.constant.Operation;
import com.locolin.cdc_kafka.model.Order;
import lombok.Data;

@Data
public class OrderResponseDto {
    private Order order;
    private Operation op;
}
