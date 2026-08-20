package com.hostel.management.repository;

import com.hostel.management.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByAttendanceDate(LocalDate date);
    Optional<Attendance> findByStudentIdAndAttendanceDate(Long studentId, LocalDate date);
    long countByAttendanceDateAndStatus(LocalDate date, String status);
}
