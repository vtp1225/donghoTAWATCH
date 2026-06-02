package TAWactch.example.TAWatch.security;

import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.exception.AppException;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expirationMs;

    private byte[] secretBytes() {
        return secret.getBytes(StandardCharsets.UTF_8);
    }

    private static final long RESET_TOKEN_EXPIRY_MS = 15 * 60 * 1000L; // 15 phút

    public String generateToken(String email) {
        try {
            JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
            JWTClaimsSet claims = new JWTClaimsSet.Builder()
                    .subject(email)
                    .issueTime(new Date())
                    .expirationTime(new Date(System.currentTimeMillis() + expirationMs))
                    .build();
            SignedJWT jwt = new SignedJWT(header, claims);
            jwt.sign(new MACSigner(secretBytes()));
            return jwt.serialize();
        } catch (JOSEException e) {
            throw new AppException(ErrorCode.UNCATEGORIED_EXCEPTION);
        }
    }

    public String generateResetToken(String email) {
        try {
            JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
            JWTClaimsSet claims = new JWTClaimsSet.Builder()
                    .subject(email)
                    .claim("type", "RESET_PASSWORD")
                    .issueTime(new Date())
                    .expirationTime(new Date(System.currentTimeMillis() + RESET_TOKEN_EXPIRY_MS))
                    .build();
            SignedJWT jwt = new SignedJWT(header, claims);
            jwt.sign(new MACSigner(secretBytes()));
            return jwt.serialize();
        } catch (JOSEException e) {
            throw new AppException(ErrorCode.UNCATEGORIED_EXCEPTION);
        }
    }

    public boolean isResetToken(String token) {
        try {
            SignedJWT jwt = SignedJWT.parse(token);
            if (!jwt.verify(new MACVerifier(secretBytes()))) return false;
            if (jwt.getJWTClaimsSet().getExpirationTime().before(new Date())) return false;
            return "RESET_PASSWORD".equals(jwt.getJWTClaimsSet().getStringClaim("type"));
        } catch (Exception e) {
            return false;
        }
    }

    public String extractEmail(String token) {
        try {
            return SignedJWT.parse(token).getJWTClaimsSet().getSubject();
        } catch (ParseException e) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
    }

    public boolean isTokenValid(String token) {
        try {
            SignedJWT jwt = SignedJWT.parse(token);
            return jwt.verify(new MACVerifier(secretBytes()))
                    && jwt.getJWTClaimsSet().getExpirationTime().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
