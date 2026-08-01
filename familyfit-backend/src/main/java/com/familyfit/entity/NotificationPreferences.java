package com.familyfit.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notification_preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationPreferences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long familyId;

    @Builder.Default
    private boolean mealRemindersEnabled = true;

    @Builder.Default
    private boolean dailySummaryEnabled = true;

    @Builder.Default
    private boolean goalAlertsEnabled = true;

    @Builder.Default
    private boolean weeklyReportEnabled = true;
}
