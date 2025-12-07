package com.volunteerhub.registrationservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.volunteerhub.common.enums.EventStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

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

    @Builder.Default
    @OneToMany(mappedBy = "eventSnapshot", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<UserEvent> events = new ArrayList<>();
}
