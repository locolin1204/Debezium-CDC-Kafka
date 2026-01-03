package com.locolin.cdc_kafka.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Entity
@Data
@Table(name = "order")
@NoArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class Order {
    @Id
    private Integer id;
    @Column(name = "product_name")
    private String productName;
    private int quantity;
    @Column(name = "created_datetime")
    LocalDateTime createdDatetime;
    @Column(name = "last_modified_datetime")
    LocalDateTime lastModifiedDatetime;
}
