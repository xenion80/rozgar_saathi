package com.general_auth.opportunity.repository;

import com.general_auth.opportunity.entity.Opportunity;
import com.general_auth.opportunity.entity.OpportunityStatus;
import com.general_auth.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {

    List<Opportunity> findByStatus(OpportunityStatus status);

    List<Opportunity> findAllByOrderByCreatedAtDesc();

    Optional<Opportunity> findByIdAndRecruiter(Long id, User recruiter);

    List<Opportunity> findByRecruiterIdOrderByCreatedAtDesc(Long recruiterId);
}