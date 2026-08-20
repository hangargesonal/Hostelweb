package com.hostel.management.controller;

import com.hostel.management.entity.Attendance;
import com.hostel.management.entity.Student;
import com.hostel.management.repository.AttendanceRepository;
import com.hostel.management.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public AttendanceController(AttendanceRepository attendanceRepository,
                                StudentRepository studentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public List<Attendance> getByDate(@RequestParam String date) {
        return attendanceRepository.findByAttendanceDate(LocalDate.parse(date));
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody AttendanceRequest request) {
        Student student = studentRepository.findById(request.studentId())
                .orElse(null);

        if (student == null) {
            return ResponseEntity.badRequest().body("Student not found");
        }

        LocalDate date = LocalDate.parse(request.date());
        Attendance attendance = attendanceRepository
                .findByStudentIdAndAttendanceDate(request.studentId(), date)
                .orElse(new Attendance());

        attendance.setStudent(student);
        attendance.setAttendanceDate(date);
        attendance.setStatus(request.status().toUpperCase());

        return ResponseEntity.ok(attendanceRepository.save(attendance));
    }

    public record AttendanceRequest(Long studentId, String date, String status) {}
}
