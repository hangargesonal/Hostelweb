package com.hostel.management.repository;

import com.hostel.management.entity.LeavingRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeavingRequestRepository extends JpaRepository<LeavingRequest, Long> {
}
