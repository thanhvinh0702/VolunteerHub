package com.volunteerhub.EventService.service;

import com.volunteerhub.EventService.model.Category;
import com.volunteerhub.EventService.repository.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@AllArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public Category findByID(Long id) {
        return categoryRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("No such category with id " + id));
    }
}
