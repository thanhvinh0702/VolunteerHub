# Fix 401 Unauthorized Error for Public Key Endpoint

## Vấn đề

Endpoint `/api/v1/notifications/web-push/public-key` trả về 401 Unauthorized mặc dù đã có `.permitAll()` trong SecurityConfig.

## Nguyên nhân

Spring Security có nhiều authentication mechanisms (HTTP Basic, Form Login, etc.) và khi không có credentials, nó sẽ reject request với 401.

Response headers cho thấy:
```
www-authenticate: Bearer
```

Điều này nghĩa là Spring Security đang yêu cầu Bearer token authentication.

## Giải pháp

### 1. Disable HTTP Basic và Form Login

Thêm vào SecurityConfig:
```java
.httpBasic(AbstractHttpConfigurer::disable)
.formLogin(AbstractHttpConfigurer::disable)
```

### 2. Đơn giản hóa Custom Filter

Filter chỉ nên set authentication khi có headers, không nên block request:

```java
@Bean
public OncePerRequestFilter headerFilterAuth() {
    return new OncePerRequestFilter() {
        @Override
        protected void doFilterInternal(HttpServletRequest request,
                HttpServletResponse response,
                FilterChain filterChain) throws ServletException, IOException {
            String role = request.getHeader("X-USER-ROLE");
            String userId = request.getHeader("X-USER-ID");
            
            // Chỉ set authentication nếu có headers
            if (role != null && !role.isBlank() && userId != null && !userId.isBlank()) {
                String roleName = role.startsWith("ROLE_") ? role : "ROLE_" + role;
                GrantedAuthority authority = new SimpleGrantedAuthority(roleName);
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        userId,
                        null,
                        List.of(authority));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
            
            // Luôn cho request đi tiếp
            filterChain.doFilter(request, response);
        }
    };
}
```

### 3. Đảm bảo permitAll() được đặt đúng

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/v1/notifications/web-push/public-key").permitAll()
    .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
    .anyRequest().authenticated())
```

## Kết quả

Sau khi fix:
- ✅ Public key endpoint accessible without authentication
- ✅ CORS working properly
- ✅ Other endpoints still require authentication via headers

## Testing

```bash
# Test public endpoint (should return 200)
curl http://localhost:8080/api/v1/notifications/web-push/public-key

# Test protected endpoint without headers (should return 403)
curl http://localhost:8080/api/v1/notifications

# Test protected endpoint with headers (should work)
curl http://localhost:8080/api/v1/notifications \
  -H "X-USER-ID: user123" \
  -H "X-USER-ROLE: USER"
```

## Restart Required

**QUAN TRỌNG**: Sau khi sửa SecurityConfig, phải restart NotificationService:

```bash
cd NotificationService
./mvnw spring-boot:run
```

Hoặc nếu đang chạy, stop (Ctrl+C) và start lại.


