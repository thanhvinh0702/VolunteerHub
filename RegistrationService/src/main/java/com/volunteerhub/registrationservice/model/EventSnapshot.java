package com.volunteerhub.registrationservice.model;

import com.volunteerhub.common.enums.EventStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventSnapshot {

    @Id
    private Long eventId;

    @Column(nullable = false)
    private int capacity;

    @Column(nullable = false)
    private EventStatus status;

    @Column(name = "owner_id", nullable = false)
    private String ownerId;
}
