package com.hostel.management.controller;

import com.hostel.management.entity.LeavingRequest;
import com.hostel.management.entity.Student;
import com.hostel.management.repository.LeavingRequestRepository;
import com.hostel.management.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/leaving")
public class LeavingRequestController {
    private final LeavingRequestRepository requestRepository;
    private final StudentRepository studentRepository;

    public LeavingRequestController(LeavingRequestRepository requestRepository,
                                    StudentRepository studentRepository) {
        this.requestRepository = requestRepository;
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public List<LeavingRequest> getAll() {
        return requestRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody LeavingRequestRequest request) {
        Student student = studentRepository.findById(request.studentId())
                .orElse(null);

        if (student == null) {
            return ResponseEntity.badRequest().body("Student not found");
        }

        LeavingRequest entity = new LeavingRequest();
        entity.setStudent(student);
        entity.setFromDate(LocalDate.parse(request.fromDate()));
        entity.setToDate(LocalDate.parse(request.toDate()));
        entity.setReason(request.reason());
        entity.setStatus("PENDING");

        return ResponseEntity.ok(requestRepository.save(entity));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<LeavingRequest> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return requestRepository.findById(id).map(request -> {
            request.setStatus(status.toUpperCase());
            return ResponseEntity.ok(requestRepository.save(request));
        }).orElse(ResponseEntity.notFound().build());
    }

    public record LeavingRequestRequest(
            Long studentId, String fromDate, String toDate, String reason) {}
}
