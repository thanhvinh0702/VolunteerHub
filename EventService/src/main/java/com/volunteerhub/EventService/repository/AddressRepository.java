package com.volunteerhub.EventService.repository;

import com.volunteerhub.EventService.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
