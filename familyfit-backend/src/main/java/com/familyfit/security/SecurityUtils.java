package com.familyfit.security;

import com.familyfit.entity.Family;
import com.familyfit.exception.UnauthorizedException;
import com.familyfit.repository.FamilyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Utility for resolving the authenticated Family from the JWT-populated
 * SecurityContext on every protected request.
 *
 * <p>Usage in controllers/services:
 * <pre>
 *   Long familyId = securityUtils.currentFamilyId();
 * </pre>
 *
 * This is the single source of truth for "which family owns this request".
 * Controllers must NEVER trust a family-id supplied by the client (path
 * variable or query param) for data-access decisions.
 */
@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final JwtUtil jwtUtil;
    private final FamilyRepository familyRepository;

    /**
     * Returns the {@link Family} entity for the currently authenticated user.
     *
     * @throws UnauthorizedException if no valid JWT is present in the context
     */
    public Family currentFamily() {
        String email = currentEmail();
        return familyRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Authenticated family not found: " + email));
    }

    /**
     * Returns the {@code familyId} embedded in the current JWT.
     * Prefer this over loading the full entity when only the ID is needed.
     *
     * @throws UnauthorizedException if no authenticated principal is present
     */
    public Long currentFamilyId() {
        return currentFamily().getId();
    }

    /**
     * Asserts that the given {@code familyId} matches the authenticated user's
     * family.  Throws {@link UnauthorizedException} if they don't match,
     * preventing cross-account data access.
     */
    public void assertOwnership(Long familyId) {
        Long actual = currentFamilyId();
        if (!actual.equals(familyId)) {
            throw new UnauthorizedException(
                    "Access denied: resource belongs to a different family account.");
        }
    }

    // ─── Internal ────────────────────────────────────────────────────────

    private String currentEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
            throw new UnauthorizedException("No authenticated user found in security context.");
        }
        return auth.getName();   // populated by JwtAuthFilter via UserDetailsService
    }
}
