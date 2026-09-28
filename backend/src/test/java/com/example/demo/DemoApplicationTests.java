package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "JWT_SECRET=superSecretKeyForMockMvcSecurityIntegrationTesting2026AtLeast32Bytes!"
})
class DemoApplicationTests {

	@Test
	void contextLoads() {
	}

}
