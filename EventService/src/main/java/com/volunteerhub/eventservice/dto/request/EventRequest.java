    package com.volunteerhub.eventservice.dto.request;

    import com.volunteerhub.eventservice.validation.OnCreate;
    import jakarta.validation.Valid;
    import jakarta.validation.constraints.Min;
    import jakarta.validation.constraints.NotBlank;
    import jakarta.validation.constraints.NotNull;
    import lombok.Data;

    import java.time.LocalDateTime;

    @Data
    public class EventRequest {

        @NotNull(message = "Name cannot be null", groups = OnCreate.class)
        private String name;

        private String description;

        private String imageUrl;

        @NotBlank(message = "Category name cannot be blank", groups = OnCreate.class)
        private String categoryName;

        @NotNull(message = "StartTime cannot be null", groups = OnCreate.class)
        private LocalDateTime startTime;

        @NotNull(message = "EndTime cannot be null", groups = OnCreate.class)
        private LocalDateTime endTime;

        @Valid
        @NotNull(message = "Address cannot be null", groups = OnCreate.class)
        private AddressRequest address;

        private String optional;

        @Min(value = 1, message = "Capacity must be at least 1", groups = OnCreate.class)
        private int capacity;
    }
