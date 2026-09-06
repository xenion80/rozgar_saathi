package com.general_auth.opportunity.repository;

import com.general_auth.opportunity.entity.Opportunity;
import com.general_auth.opportunity.entity.OpportunitySkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OpportunitySkillRepository extends JpaRepository<OpportunitySkill, Long> {
    List<OpportunitySkill> findByOpportunity(Opportunity opportunity);

    List<OpportunitySkill> findByOpportunityId(Long opportunityId);

    void deleteByOpportunity(Opportunity opportunity);
}