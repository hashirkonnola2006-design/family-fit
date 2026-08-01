package com.familyfit.service.impl;

import com.familyfit.dto.NotificationDTO;
import com.familyfit.entity.Notification;
import com.familyfit.exception.ResourceNotFoundException;
import com.familyfit.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl {

    private final NotificationRepository notificationRepository;
    private final EntityMapper mapper;

    @Transactional(readOnly = true)
    public List<NotificationDTO> getAll(Long familyId) {
        return notificationRepository.findByFamilyIdOrderByCreatedAtDesc(familyId)
                .stream().map(mapper::toNotificationDTO).collect(Collectors.toList());
    }

    public NotificationDTO markRead(Long notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", notificationId));
        n.setRead(true);
        return mapper.toNotificationDTO(notificationRepository.save(n));
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long familyId) {
        return notificationRepository.countByFamilyIdAndReadFalse(familyId);
    }
}
