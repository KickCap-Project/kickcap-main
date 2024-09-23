package com.ssafy.kickcap.config.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;

@Configuration
@RequiredArgsConstructor
public class RedisMessageListenerConfig {
    private final ReportMessageListener reportMessageListener;
    private final RedisConnectionFactory redisConnectionFactory;
    private final ChannelTopic topic;

    // Redis 메시지 리스너 컨테이너 설정
    @Bean
    public RedisMessageListenerContainer redisContainer() {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(redisConnectionFactory);
        container.addMessageListener(listenerAdapter(), topic);  // 리스너 어댑터와 토픽 설정
        return container;
    }

    // Redis 구독 채널 설정
    @Bean
    public MessageListenerAdapter listenerAdapter() {
        return new MessageListenerAdapter(reportMessageListener, "onMessage");
    }
}
