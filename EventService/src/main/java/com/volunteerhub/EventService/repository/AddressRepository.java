package com.volunteerhub.EventService.repository;

import com.volunteerhub.EventService.model.Address;
import com.volunteerhub.EventService.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    Optional<Address> findByCityAndProvinceAndStreet(String city, String province, String street);
}
