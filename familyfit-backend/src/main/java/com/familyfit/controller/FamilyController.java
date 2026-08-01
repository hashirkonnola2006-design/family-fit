package com.familyfit.controller;

import com.familyfit.dto.FamilyDTO;
import com.familyfit.dto.FamilyMemberDTO;
import com.familyfit.service.impl.FamilyServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/family")
@RequiredArgsConstructor
public class FamilyController {

    private final FamilyServiceImpl familyService;

    @GetMapping("/{familyId}")
    public ResponseEntity<FamilyDTO> getFamily(@PathVariable Long familyId) {
        return ResponseEntity.ok(familyService.getFamily(familyId));
    }

    @PatchMapping("/{familyId}")
    public ResponseEntity<FamilyDTO> updateFamily(@PathVariable Long familyId,
                                                   @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(familyService.updateFamilyName(familyId, body.get("name")));
    }

    @GetMapping("/{familyId}/members")
    public ResponseEntity<List<FamilyMemberDTO>> getMembers(@PathVariable Long familyId) {
        return ResponseEntity.ok(familyService.getMembers(familyId));
    }

    @PostMapping("/{familyId}/members")
    public ResponseEntity<FamilyMemberDTO> addMember(@PathVariable Long familyId,
                                                       @Valid @RequestBody FamilyMemberDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(familyService.addMember(familyId, dto));
    }

    @PatchMapping("/members/{memberId}")
    public ResponseEntity<FamilyMemberDTO> updateMember(@PathVariable Long memberId,
                                                          @Valid @RequestBody FamilyMemberDTO dto) {
        return ResponseEntity.ok(familyService.updateMember(memberId, dto));
    }

    @DeleteMapping("/members/{memberId}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long memberId) {
        familyService.deleteMember(memberId);
        return ResponseEntity.noContent().build();
    }
}
