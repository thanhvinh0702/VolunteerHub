package com.volunteerhub.EventService.service;

import com.volunteerhub.EventService.dto.AddressRequest;
import com.volunteerhub.EventService.model.Address;
import com.volunteerhub.EventService.repository.AddressRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@AllArgsConstructor
public class AddressService {
    private final AddressRepository addressRepository;

    public Address findById(Long id) {
        return addressRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("No such address with id " + id));
    }

    public Address findOrCreateAddress(AddressRequest request) {
        return addressRepository.findByCityAndProvinceAndStreet(
                request.getCity(), request.getProvince(), request.getStreet()
        ).orElseGet(() -> {
            Address newAddress = new Address();
            newAddress.setCity(request.getCity());
            newAddress.setProvince(request.getProvince());
            newAddress.setStreet(request.getStreet());
            return addressRepository.save(newAddress);
        });
    }

}
