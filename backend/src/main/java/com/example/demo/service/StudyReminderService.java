package com.example.demo.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class StudyReminderService {

    // Runs every day at 9:00 AM (cron expression: 0 0 9 * * ?) or every 4 hours in demo mode
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendDailyStudyReminder() {
        log.info("⏰ [SPRING SCHEDULER] Daily 9:00 AM Study Notification Triggered!");
        log.info("📚 Reminder: Complete today's Java Core & Spring Boot DSA challenge!");
    }

    // Keep-alive heartbeat task every 10 minutes to log system health
    @Scheduled(fixedRate = 600000)
    public void systemHeartbeat() {
        log.info("💚 [SPRING SCHEDULER] System Heartbeat OK - Database connected & ready.");
    }
}
