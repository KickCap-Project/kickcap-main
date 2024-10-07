package com.ssafy.kickcap.redis;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@SpringBootTest
public class RedisKeyGeneratorTest {

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

            System.out.println("Generated Key: " + redisKey);
        }
    }
}
