package com.ssafy.kickcap.config.redis;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@RequiredArgsConstructor
public class RedisConfig {

    private final ReportMessageListener reportMessageListener;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() { // RedisConnectionFactory 추가
        return new LettuceConnectionFactory(); // LettuceConnectionFactory 사용
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory);

        // Key와 Value의 직렬화 방식 설정
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer(createObjectMapper()));

        return redisTemplate;
    }

    private ObjectMapper createObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        return objectMapper;
    }

    // Redis 메시지 리스너 컨테이너 설정
    @Bean
    public RedisMessageListenerContainer redisContainer() {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(redisConnectionFactory());
        container.addMessageListener(listenerAdapter(), topic()); // 리스너 어댑터와 토픽 설정
        return container;
    }

    // 리스너 어댑터 설정
    @Bean
    public MessageListenerAdapter listenerAdapter() {
        return new MessageListenerAdapter(reportMessageListener, "onMessage");
    }

    // Redis 구독 채널 설정
    @Bean
    public ChannelTopic topic() {
        return new ChannelTopic("report_channel");
    }
}

