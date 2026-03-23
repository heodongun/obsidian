---
title: "Swagger에 대해 알아보자"
description: "Swagger에 대해 알아보자"
source: "https://velog.io/@pobi/Swagger%EC%97%90-%EB%8C%80%ED%95%B4-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90"
source_slug: "Swagger에-대해-알아보자"
author: "pobi"
author_display_name: "포비"
released_at: "2025-02-17T13:40:29.566Z"
updated_at: "2026-03-15T12:26:17.807Z"
thumbnail: "https://velog.velcdn.com/images/pobi/post/e7b18d5f-ed02-4d75-a1ba-f8a232223d9e/image.png"
tags: []
---# Swagger에 대해 알아보자

지금까지의 우리는 ![](https://velog.velcdn.com/images/pobi/post/467efdf8-c7ff-46af-aa1b-21d8bb2aa8fe/image.png)
이런식으로 API문서를 만들어왔다. 이러면 보기도 어렵고 돈도 들고
그래서 우리는 Swagger를 사용하여 API들을 자동으로 문서화해줄것이다.

# Swagger란?
쉽게 말해 API명세서 + 포스트맨 이 두가지의 장점만 쏙쏙 뽑아왔다.
하지만 이 스웨거에게도 단점이있다.
그것은 기초 설정을 해야한다는것이다.
나와 함께 기초 설정을 해보자

# 기초 설정
```
	implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.7.0'
```
우리는 springdoc을 이용하여 스웨거를 쓸것이다.
이걸 build.gradle에 넣어준다.
그리고 여기서 생각보다 많이 힘들어하는데 자기 스프링부트 버전과 호환이 되는지 확인하고 쓰자 난 확인을 하지않아서 4시간동안 찾았다.

```
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Tech Course API", version = "v1"))
@SecurityScheme(
        name = "BearerAuth",
        type = SecuritySchemeType.HTTP, // SecuritySchemeType 사용
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class SwaggerConfig {
}
```
이건 Jwt를 사용하기 위해 넣어준 설정

```
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfiguration {

    @Bean
    public GroupedOpenApi chatOpenApi() {
        String[] paths = {"/**"};

        return GroupedOpenApi.builder()
                .group("PloyTechCourse")
                .pathsToMatch(paths)
                .build();
    }
}
```
이건 스웨거를 빈에다가 등록시켜주는것이다.

그런다음 
```
@Operation(
            summary = "회원가입",
            description = "사용자가 입력한 정보로 회원가입을 진행합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "회원가입이 완료되었습니다."),
                    @ApiResponse(responseCode = "400", description = "잘못된 요청 (예: 필수 정보 누락, 유효하지 않은 입력값)",
                            content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                    schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ErrorResponse.class))),
                    @ApiResponse(responseCode = "500", description = "서버 오류",
                            content = @io.swagger.v3.oas.annotations.media.Content(mediaType = "application/json",
                                    schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ErrorResponse.class)))
            }
    )
    @PostMapping("/signup")
    public ResponseEntity<String> signup(
            @Parameter(description = "회원가입에 필요한 정보", required = true)
            @Valid @RequestBody SignupUserDto signupUserDto) {
        signupApplication.signup(signupUserDto);
        throw new PltecoException("회원가입 성공", HttpStatus.OK);
    }
```

이런식으로 사용해주면 
![](https://velog.velcdn.com/images/pobi/post/70525fa0-732e-4280-b098-2fa42bf4b5a4/image.png)
이런식으로 자동으로 문서화를 해준다. 
정말 유용한 스웨거를 적극 사용해보도록 하자
