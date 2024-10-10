package com.ssafy.kickcap.config.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.ReturnType;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class RedisScheduler {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String PUBSUB_CHANNEL = "report_channel";

//    @Scheduled(fixedRate = 60000) // 1분마다 실행
    @Scheduled(fixedRate = 30000) // 30초마다 실행 - test 용
    public void checkKeysTTL() {
        System.out.println("스케줄러 시작");
        // 모든 키 조회
        Set<String> keysSet = redisTemplate.keys("*");
        List<String> keys = new ArrayList<>(keysSet); // Set을 List로 변환

        String luaScript = "local key = KEYS[1]; local pubsub_channel = ARGV[1]; " +
                "local ttl = redis.call('TTL', key); " +
                "if ttl > 0 and ttl <= 60 then redis.call('PUBLISH', pubsub_channel, key); end " +
                "return ttl;";

        for (String key : keys) {
            redisTemplate.execute((RedisCallback<Object>) connection -> {
                Object result = connection.eval(luaScript.getBytes(),
                        ReturnType.INTEGER,
                        1,
                        key.getBytes(),
                        PUBSUB_CHANNEL.getBytes());

                System.out.println("Key: " + key + ", TTL: " + result); // TTL 값을 로그로 확인
                return result;
            });
        }

    }
}
