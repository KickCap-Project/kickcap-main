package com.ssafy.kickcap.redis;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.*;
import java.util.concurrent.TimeUnit;

@SpringBootTest
public class RedisSchedulerOnlyTTLTest {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Test
    public void generateRandomKeysTest() {
        Random random = new Random();

        for (int i = 0; i < 10000; i++) {
            // 랜덤 memberId와 kickboardNumber 생성
            Long memberId = Math.abs(random.nextLong());
            int kickboardNumber = random.nextInt(10000);

            // Redis key 생성
            String redisKey = memberId.toString() + ":" + kickboardNumber;

            // 해당 key를 Redis에 저장하고 TTL을 2분(120초)로 설정
            redisTemplate.opsForValue().set(redisKey, "someValue");
            redisTemplate.expire(redisKey, 120, TimeUnit.SECONDS);

//            System.out.println("Generated Key: " + redisKey);
        }
    }
    // 메모리 사용량을 가져오는 메서드
    public String getMemoryUsage() {
        RedisConnection connection = redisTemplate.getConnectionFactory().getConnection();
        Properties memoryInfo = connection.info("memory");

        // 'used_memory' 값을 반환
        return memoryInfo.getProperty("used_memory");
    }

    @Test
    public void checkKeysTTLWithoutLuaTest() {
        long startTime = System.currentTimeMillis(); // 성능 측정 시작 시간
        // Lua 스크립트 실행 전 메모리 사용량 가져오기
        String memoryBefore = getMemoryUsage();
        System.out.println("Memory before without Lua: " + memoryBefore);

        // 모든 키 조회
        Set<String> keysSet = redisTemplate.keys("*");
        List<String> keys = new ArrayList<>(keysSet); // Set을 List로 변환

        for (String key : keys) {
            Long ttl = redisTemplate.getExpire(key, TimeUnit.SECONDS);
            if (ttl != null && ttl <= 60 && ttl > 0) {
//                System.out.println("Key: " + key + " has TTL <= 60 seconds");
            }
        }

        long endTime = System.currentTimeMillis(); // 성능 측정 종료 시간
        System.out.println("Total execution time without Lua: " + (endTime - startTime) + "ms");
        // Lua 스크립트 실행 후 메모리 사용량 가져오기
        String memoryAfter = getMemoryUsage();
        System.out.println("Memory after without Lua: " + memoryAfter);
    }
}

