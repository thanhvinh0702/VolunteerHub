package com.volunteerhub.EventService.mapper;

import com.volunteerhub.EventService.dto.CategoryResponse;
import com.volunteerhub.EventService.model.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryResponse toDto(Category category) {
        return CategoryResponse.builder()
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }
}
