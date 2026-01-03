package com.locolin.cdc_kafka.controller;

import com.locolin.cdc_kafka.model.Order;
import com.locolin.cdc_kafka.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("all")
    public ResponseEntity<List<Order>> getAllOrdersPage() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}
