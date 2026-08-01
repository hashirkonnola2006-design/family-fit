package com.familyfit.repository;

import com.familyfit.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByFamilyIdOrderByCreatedAtDesc(Long familyId);
    List<Notification> findByFamilyIdAndReadFalse(Long familyId);
    long countByFamilyIdAndReadFalse(Long familyId);
}
