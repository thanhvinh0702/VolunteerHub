package com.volunteerhub.userservice.mapper;

import com.volunteerhub.common.dto.AddressResponse;
import com.volunteerhub.userservice.model.Address;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {

    public AddressResponse toResponse(Address address) {
        if (address == null) {
            return null;
        }
        return AddressResponse.builder()
                .district(address.getDistrict())
                .province(address.getProvince())
                .street(address.getStreet())
                .build();
    }
}
