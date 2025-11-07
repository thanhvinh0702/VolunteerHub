    package com.volunteerhub.EventService.dto;

    import com.volunteerhub.EventService.validation.OnCreate;
    import jakarta.validation.constraints.Min;
    import jakarta.validation.constraints.NotNull;
    import lombok.Data;

    import java.time.LocalDateTime;

    @Data
    public class EventRequest {

        @NotNull(message = "Name cannot be null", groups = OnCreate.class)
        private String name;

        private String description;

        @NotNull(message = "StartTime cannot be null", groups = OnCreate.class)
        private LocalDateTime startTime;

        @NotNull(message = "EndTime cannot be null", groups = OnCreate.class)
        private LocalDateTime endTime;

        @NotNull(message = "Category cannot be null", groups = OnCreate.class)
        private Long categoryID;

        @Min(value = 1, message = "Capacity must be at least 1")
        private int capacity;

        @NotNull(message = "Address cannot be null", groups = OnCreate.class)
        private Long addressID;
    }
