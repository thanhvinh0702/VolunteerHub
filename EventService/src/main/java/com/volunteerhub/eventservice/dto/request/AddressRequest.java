package com.volunteerhub.EventService.dto;

import com.volunteerhub.EventService.validation.OnCreate;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddressRequest {
    @NotBlank(message = "City cannot be blank", groups = OnCreate.class)
    private String city;

    @NotBlank(message = "Province cannot be blank", groups = OnCreate.class)
    private String province;

    @NotBlank(message = "Street cannot be blank", groups = OnCreate.class)
    private String street;
}
