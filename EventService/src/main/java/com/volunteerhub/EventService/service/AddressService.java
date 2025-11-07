package com.volunteerhub.EventService.service;

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
}
