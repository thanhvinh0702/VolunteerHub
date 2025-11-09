package com.volunteerhub.notificationservice.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    public static final String EXCHANGE = "notification-exchange";

    public static final String EVENT_CREATED_QUEUE = "notification-event-created-queue";
    public static final String COMMENT_CREATED_QUEUE = "notification-comment-created-queue";
    public static final String REACTION_CREATED_QUEUE = "notification-reaction-created-queue";

    public static final String EVENT_CREATED_ROUTING_KEY = "notification.event.created";
    public static final String COMMENT_CREATED_ROUTING_KEY = "notification.comment.created";
    public static final String REACTION_CREATED_ROUTING_KEY = "notification.reaction.created";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue commentCreatedQueue() {
        return new Queue(COMMENT_CREATED_QUEUE, true);
    }

    @Bean
    public Queue reactionCreatedQueue() {
        return new Queue(REACTION_CREATED_QUEUE, true);
    }

    @Bean
    public Queue eventCreatedQueue() {
        return new Queue(EVENT_CREATED_QUEUE, true);
    }

    @Bean
    public Binding commentCreatedBinding(TopicExchange exchange, Queue commentCreatedQueue) {
        return BindingBuilder.bind(commentCreatedQueue).to(exchange).with(COMMENT_CREATED_ROUTING_KEY);
    }

    @Bean
    public Binding reactionCreatedBinding(TopicExchange exchange, Queue reactionCreatedQueue) {
        return BindingBuilder.bind(reactionCreatedQueue).to(exchange).with(REACTION_CREATED_ROUTING_KEY);
    }

    @Bean
    public Binding eventCreatedBinding(TopicExchange exchange, Queue eventCreatedQueue) {
        return BindingBuilder.bind(eventCreatedQueue).to(exchange).with(EVENT_CREATED_ROUTING_KEY);
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory,
                                         Jackson2JsonMessageConverter messageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter);
        return template;
    }

    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
