package com.volunteerhub.EventService.repository;

import com.volunteerhub.EventService.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
