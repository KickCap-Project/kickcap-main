package com.ssafy.kickcap.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .in(SecurityScheme.In.HEADER)
                                        .name("Authorization")
                        )
                )
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .servers(List.of(
                        new Server().url("https://www.arraylist.xyz").description("Production server")
                ))
                .info(apiInfo());
    }

    private Info apiInfo() {
        return new Info()
                .title("CodeArena Swagger")
                .description("CodeArena 유저 및 인증, ps, 알림에 관한 REST API")
                .version("1.0.0");
    }
}
