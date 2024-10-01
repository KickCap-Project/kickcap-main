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

    public OpenAPI openAPI() {
        return new OpenAPI()
                .openapi("3.0.0")
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
                        new Server().url("https://www.arraylist.xyz").description("Production server")  // HTTPS로 설정
                ))
                .info(apiInfo());
    }

    private Info apiInfo() {
        return new Info()
                .title("KickCap Swagger")
                .description("킥보드 단속 플랫폼 KICKCAP REST API")
                .version("1.0.0");
    }
}
