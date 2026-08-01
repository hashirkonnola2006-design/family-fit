package com.familyfit.controller;

import com.familyfit.entity.SupportRequest;
import com.familyfit.repository.SupportRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportController {

    private final SupportRequestRepository supportRepo;

    @PostMapping("/contact")
    public ResponseEntity<SupportRequest> submitSupportRequest(@RequestBody SupportRequest request) {
        SupportRequest saved = supportRepo.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
