package com.hostel.management.controller;

import com.hostel.management.repository.AttendanceRepository;
import com.hostel.management.repository.LeavingRequestRepository;
import com.hostel.management.repository.StudentRepository;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final StudentRepository students;
    private final AttendanceRepository attendance;
    private final LeavingRequestRepository leaving;

    public DashboardController(StudentRepository students,
                               AttendanceRepository attendance,
                               LeavingRequestRepository leaving) {
        this.students = students;
        this.attendance = attendance;
        this.leaving = leaving;
    }

    @GetMapping
    public Map<String, Object> dashboard() {
        LocalDate today = LocalDate.now();
        return Map.of(
                "totalStudents", students.count(),
                "presentToday", attendance.countByAttendanceDateAndStatus(today, "PRESENT"),
                "absentToday", attendance.countByAttendanceDateAndStatus(today, "ABSENT"),
                "leavingRequests", leaving.count()
        );
    }
}
