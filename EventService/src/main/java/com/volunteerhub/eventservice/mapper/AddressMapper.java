package com.volunteerhub.EventService.mapper;

import com.volunteerhub.EventService.dto.AddressResponse;
import com.volunteerhub.EventService.model.Address;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {

    public AddressResponse toDto(Address address) {
        return AddressResponse.builder()
                .city(address.getCity())
                .province(address.getProvince())
                .street(address.getStreet())
                .build();
    }
}
