package TAWactch.example.TAWatch.security;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "https://dongho-tawatch.vercel.app",
                "http://localhost:8080/"
        ));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // Public API
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/otp/**").permitAll()
                        .requestMatchers("/ghn/**").permitAll()

                        // Swagger
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // OPTIONS cho CORS
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Watch APIs - public read, admin write
                        .requestMatchers(HttpMethod.GET, "/watches/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/watches").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/watches/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/watches/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/watches/**").hasRole("ADMIN")
                        .requestMatchers(
                                "/payments/vnpay/callback",
                                "/payments/vnpay/**"
                        ).permitAll()
                        // Watch Variant APIs - public read, admin write
                        .requestMatchers(HttpMethod.GET, "/watch-variants/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/watch-variants").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/watch-variants/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/watch-variants/**").hasRole("ADMIN")

                        // Watch Image APIs - public read, admin write
                        .requestMatchers(HttpMethod.GET, "/watch-images/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/watch-images/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/watch-images/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/watch-images/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/watch-images/**").hasRole("ADMIN")

                        // Watch Variant Image APIs - public read, admin write
                        .requestMatchers(HttpMethod.GET, "/watch-variant-images/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/watch-variant-images/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/watch-variant-images/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/watch-variant-images/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/watch-variant-images/**").hasRole("ADMIN")

                        // Brand APIs - public read, admin write
                        .requestMatchers(HttpMethod.GET, "/brands/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/brands").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/brands/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/brands/**").hasRole("ADMIN")

                        // Category APIs - public read, admin write
                        .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/categories").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/categories/**").hasRole("ADMIN")

                        // Segment APIs - public read, admin write
                        .requestMatchers(HttpMethod.GET, "/segments/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/segments").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/segments/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/segments/**").hasRole("ADMIN")

                        // UserAddress — khai báo TRƯỚC /users/** để tránh bị nuốt bởi rule ADMIN
                        .requestMatchers("/users/*/addresses/**").authenticated()

                        // User APIs
                        .requestMatchers(HttpMethod.GET, "/users/**").hasAnyRole("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.POST, "/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/users/*/role").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/users/**").hasRole("ADMIN")

                        // Wishlist APIs — require authentication
                        .requestMatchers("/wishlist/**").authenticated()

                        // Cart APIs — public (guest dùng sessionId, user dùng userId)
                        .requestMatchers(HttpMethod.GET, "/cart/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/cart/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/cart/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/cart/**").permitAll()

                        // Order APIs
                        .requestMatchers(HttpMethod.POST, "/orders").permitAll()
                        .requestMatchers(HttpMethod.GET, "/orders/my/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/orders/{orderId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/orders").hasAnyRole("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.PATCH, "/orders/*/cancel").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/orders/*/status").hasAnyRole("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.PATCH, "/orders/*/tracking").hasAnyRole("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.PATCH, "/orders/*/assign-shipper").hasAnyRole("ADMIN", "STAFF")

                        // Payment APIs
                        .requestMatchers(HttpMethod.GET, "/payments/order/**").hasAnyRole("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.POST, "/payments/vnpay/initiate").permitAll()
                        .requestMatchers(HttpMethod.POST, "/payments/vnpay/callback").permitAll()
                        .requestMatchers(HttpMethod.POST, "/payments/bank-transfer/initiate").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/payments/*/confirm").hasAnyRole("ADMIN", "STAFF")

                        // Promotion APIs - admin write, public read
                        .requestMatchers(HttpMethod.GET, "/promotions/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/promotions").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/promotions/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/promotions/**").hasRole("ADMIN")

                        // Coupon APIs - validate public, rest admin
                        .requestMatchers(HttpMethod.POST, "/coupons/validate").permitAll()
                        .requestMatchers(HttpMethod.GET, "/coupons/featured").permitAll()
                        .requestMatchers(HttpMethod.GET, "/coupons/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/coupons").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/coupons/**").hasRole("ADMIN")

                        // Shipper APIs
                        .requestMatchers(HttpMethod.GET, "/shippers/**").hasAnyRole("ADMIN", "STAFF")
                        .requestMatchers(HttpMethod.POST, "/shippers").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/shippers/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/shippers/**").hasRole("ADMIN")

                        // Others
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
