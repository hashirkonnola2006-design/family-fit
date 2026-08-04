package com.familyfit.controller;

import com.familyfit.dto.FamilyDTO;
import com.familyfit.dto.FamilyMemberDTO;
import com.familyfit.security.SecurityUtils;
import com.familyfit.service.impl.FamilyServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for family and family-member operations.
 *
 * <p><strong>Multi-tenancy enforcement:</strong> Every endpoint resolves the
 * family ID from the authenticated user's JWT (via {@link SecurityUtils}) —
 * the {@code {familyId}} path variable sent by the client is verified against
 * the JWT claim.  This prevents cross-account data leakage: an authenticated
 * user of family A can never read or mutate family B's data even if they
 * know family B's ID.
 */
@RestController
@RequestMapping("/api/family")
@RequiredArgsConstructor
public class FamilyController {

    private final FamilyServiceImpl familyService;
    private final SecurityUtils securityUtils;

    // ─── Family ──────────────────────────────────────────────────────────

    @GetMapping("/{familyId}")
    public ResponseEntity<FamilyDTO> getFamily(@PathVariable Long familyId) {
        // Verify the path-variable matches the JWT's family — blocks cross-account reads
        securityUtils.assertOwnership(familyId);
        return ResponseEntity.ok(familyService.getFamily(familyId));
    }

    @PatchMapping("/{familyId}")
    public ResponseEntity<FamilyDTO> updateFamily(@PathVariable Long familyId,
                                                   @RequestBody Map<String, String> body) {
        securityUtils.assertOwnership(familyId);
        return ResponseEntity.ok(familyService.updateFamilyName(familyId, body.get("name")));
    }

    // ─── Members ─────────────────────────────────────────────────────────

    @GetMapping("/{familyId}/members")
    public ResponseEntity<List<FamilyMemberDTO>> getMembers(@PathVariable Long familyId) {
        securityUtils.assertOwnership(familyId);
        return ResponseEntity.ok(familyService.getMembers(familyId));
    }

    @PostMapping("/{familyId}/members")
    public ResponseEntity<FamilyMemberDTO> addMember(@PathVariable Long familyId,
                                                      @Valid @RequestBody FamilyMemberDTO dto) {
        securityUtils.assertOwnership(familyId);
        return ResponseEntity.status(HttpStatus.CREATED).body(familyService.addMember(familyId, dto));
    }

    @PatchMapping("/members/{memberId}")
    public ResponseEntity<FamilyMemberDTO> updateMember(@PathVariable Long memberId,
                                                         @Valid @RequestBody FamilyMemberDTO dto) {
        // Ownership is verified inside the service layer against the JWT family
        Long callerFamilyId = securityUtils.currentFamilyId();
        return ResponseEntity.ok(familyService.updateMember(memberId, dto, callerFamilyId));
    }

    @DeleteMapping("/members/{memberId}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long memberId) {
        Long callerFamilyId = securityUtils.currentFamilyId();
        familyService.deleteMember(memberId, callerFamilyId);
        return ResponseEntity.noContent().build();
    }
}
