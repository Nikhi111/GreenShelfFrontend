# Backend Security Configuration Guide

## 🚨 403 Forbidden Error Solutions

The 403 errors indicate that your Spring Boot backend security is not properly configured to handle JWT authentication.

---

## 🔧 Required Backend Configuration

### 1. SecurityConfig.java Setup

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/user/register").permitAll()
                .requestMatchers("/api/seller/register").permitAll()
                .requestMatchers("/api/admin/register").permitAll()
                .requestMatchers("/api/products/public/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                // Protected endpoints
                .requestMatchers("/api/user/**").authenticated()
                .requestMatchers("/api/seller/**").authenticated()
                .requestMatchers("/api/admin/**").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtil(), userDetailsService());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

### 2. JwtAuthenticationFilter.java

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                HttpServletResponse response, 
                                FilterChain filterChain) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        userEmail = jwtUtil.extractUsername(jwt);

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            if (jwtUtil.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
```

### 3. JwtUtil.java

```java
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }

    public Boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 hours
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }
}
```

---

## 🔍 Debug Steps

### 1. Test Authentication State
```javascript
// In browser console
window.authTest.testAuthState()
```

### 2. Test API Request
```javascript
// In browser console
window.authTest.testApiRequest()
```

### 3. Check Backend Logs
Look for these specific log entries:
- `Securing POST /api/user/cart`
- `AnonymousAuthenticationFilter: Set SecurityContextHolder to anonymous SecurityContext`
- `Http403ForbiddenEntryPoint: Pre-authenticated entry point called. Rejecting access`

---

## 🐛 Common Issues & Solutions

### Issue 1: JWT Filter Not Applied
**Symptom**: 403 errors even with valid token
**Solution**: Ensure `JwtAuthenticationFilter` is added before `UsernamePasswordAuthenticationFilter`

### Issue 2: Wrong Endpoint Matching
**Symptom**: Some endpoints work, others don't
**Solution**: Check `requestMatchers` patterns match your API endpoints

### Issue 3: CORS Configuration
**Symptom**: Preflight OPTIONS requests fail
**Solution**: Add CORS configuration:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(Arrays.asList("*"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### Issue 4: Token Expiration
**Symptom**: Auth works initially, then 403 errors
**Solution**: Check token expiration and implement refresh logic

---

## 🚀 Quick Fix Checklist

1. ✅ **SecurityConfig**: JWT filter added correctly
2. ✅ **JwtAuthenticationFilter**: Proper token extraction
3. ✅ **Endpoint Matching**: Correct patterns for protected routes
4. ✅ **CORS**: Proper configuration for frontend
5. ✅ **Token Validation**: Proper JWT parsing and validation

---

## 📞 If Issues Persist

1. **Run Debug Tests**: Use `window.authTest.testAuthState()`
2. **Check Backend Logs**: Look for security filter logs
3. **Verify Token Format**: Ensure proper JWT structure
4. **Test Manually**: Use Postman to test API with token

The most common cause is missing or incorrect JWT filter configuration in Spring Security.
