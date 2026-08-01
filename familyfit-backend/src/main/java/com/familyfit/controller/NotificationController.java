package com.familyfit.controller;

import com.familyfit.dto.NotificationDTO;
import com.familyfit.service.impl.NotificationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationServiceImpl notificationService;

    @GetMapping("/{familyId}")
    public ResponseEntity<List<NotificationDTO>> getAll(@PathVariable Long familyId) {
        return ResponseEntity.ok(notificationService.getAll(familyId));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationDTO> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markRead(id));
    }

    @GetMapping("/{familyId}/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable Long familyId) {
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(familyId)));
    }
}
