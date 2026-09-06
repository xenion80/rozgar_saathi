package com.general_auth.common.seed;

import com.general_auth.application.entity.Application;
import com.general_auth.application.entity.ApplicationStatus;
import com.general_auth.application.repository.ApplicationRepository;
import com.general_auth.assessment.entity.Assessment;
import com.general_auth.assessment.entity.AssessmentQuestion;
import com.general_auth.assessment.entity.QuestionType;
import com.general_auth.assessment.repository.AssessmentQuestionRepository;
import com.general_auth.assessment.repository.AssessmentRepository;
import com.general_auth.opportunity.entity.Opportunity;
import com.general_auth.opportunity.entity.OpportunitySkill;
import com.general_auth.opportunity.entity.OpportunityStatus;
import com.general_auth.opportunity.entity.OpportunityType;
import com.general_auth.opportunity.entity.WorkMode;
import com.general_auth.opportunity.repository.OpportunityRepository;
import com.general_auth.opportunity.repository.OpportunitySkillRepository;
import com.general_auth.skill.entity.Skill;
import com.general_auth.skill.entity.SkillCategory;
import com.general_auth.skill.entity.SkillSource;
import com.general_auth.skill.entity.StudentSkill;
import com.general_auth.skill.repository.SkillRepository;
import com.general_auth.skill.repository.StudentSkillRepository;
import com.general_auth.student.entity.StudentProfile;
import com.general_auth.student.repository.StudentProfileRepository;
import com.general_auth.user.entity.Role;
import com.general_auth.user.entity.User;
import com.general_auth.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Seeds the SIH26044 prototype so the whole flow can be demonstrated immediately:
 * students, recruiter, skill catalogue, assessment template, opportunities and applications.
 * Runs only when the skill table is empty (e.g. fresh database with ddl-auto create-drop).
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private static final String DEMO_PASSWORD = "Demo@123";

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final AssessmentRepository assessmentRepository;
    private final AssessmentQuestionRepository questionRepository;
    private final OpportunityRepository opportunityRepository;
    private final OpportunitySkillRepository opportunitySkillRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (skillRepository.count() > 0) {
            return;
        }
        log.info("Seeding SIH26044 prototype data...");

        Map<String, Skill> skills = seedSkills();
        User aarav = seedUser("Aarav Mehta", "student@demo.com", Role.STUDENT);
        User ananya = seedUser("Ananya Patel", "student2@demo.com", Role.STUDENT);
        User recruiter = seedUser("Riya Sharma", "recruiter@demo.com", Role.RECRUITER);

        StudentProfile aaravProfile = seedStudentProfile(aarav, "IIT Bombay", "B.Tech", "Computer Science", "Backend Developer",
                "Final-year student passionate about building scalable backend systems.");
        StudentProfile ananyaProfile = seedStudentProfile(ananya, "VIT Vellore", "B.Tech", "Information Technology", "Data Analyst",
                "Data enthusiast skilled in SQL, Python and visualization tools.");

        seedStudentSkill(aaravProfile, skills, "Java", 4);
        seedStudentSkill(aaravProfile, skills, "Spring Boot", 4);
        seedStudentSkill(aaravProfile, skills, "SQL", 3);
        seedStudentSkill(aaravProfile, skills, "Git", 3);
        seedStudentSkill(aaravProfile, skills, "Communication", 3);

        seedStudentSkill(ananyaProfile, skills, "Python", 3);
        seedStudentSkill(ananyaProfile, skills, "SQL", 3);
        seedStudentSkill(ananyaProfile, skills, "React", 3);
        seedStudentSkill(ananyaProfile, skills, "Excel", 3);
        seedStudentSkill(ananyaProfile, skills, "Communication", 4);
        seedStudentSkill(ananyaProfile, skills, "Leadership", 3);

        seedAssessmentTemplate(skills);

        // -- opportunities -------------------------------------------------
        // Flagship scenario: Aarav (Java, Spring Boot, SQL, Git) vs Backend Developer Intern
        // (Java, Spring Boot, SQL, Git, Docker) -> 80% match, missing Docker only.
        Opportunity backendIntern = seedOpportunity(recruiter,
                "Backend Developer Intern", "Work with the core team on REST APIs, database design and Spring Boot services. " +
                        "Ideal for students who want hands-on production experience.",
                OpportunityType.INTERNSHIP, "TechNova Solutions", "Bangalore", WorkMode.HYBRID,
                "B.Tech / BCA / MCA", OpportunityStatus.OPEN, 45);
        seedOpportunitySkills(backendIntern, skills, Map.of(
                "Java", new int[]{3, 5},
                "Spring Boot", new int[]{3, 5},
                "SQL", new int[]{3, 4},
                "Git", new int[]{2, 4},
                "Docker", new int[]{3, 5}
        ));

        Opportunity fullStackTrainee = seedOpportunity(recruiter,
                "Full Stack Developer Trainee", "Learn and contribute across the stack - Spring Boot backend, React frontend and databases.",
                OpportunityType.INTERNSHIP, "CodeCraft Labs", "Remote", WorkMode.REMOTE,
                "B.Tech / BCA / MCA", OpportunityStatus.OPEN, 60);
        seedOpportunitySkills(fullStackTrainee, skills, Map.of(
                "Java", new int[]{3, 5},
                "Spring Boot", new int[]{3, 4},
                "React", new int[]{3, 5},
                "SQL", new int[]{3, 4},
                "Git", new int[]{2, 4},
                "Docker", new int[]{3, 3}
        ));

        Opportunity javaEngineer = seedOpportunity(recruiter,
                "Software Engineer (Java)", "Design and build microservices for our payments platform. Strong Java fundamentals required.",
                OpportunityType.JOB, "TechNova Solutions", "Pune", WorkMode.ONSITE,
                "B.Tech CSE/IT + 1 year experience", OpportunityStatus.OPEN, 30);
        seedOpportunitySkills(javaEngineer, skills, Map.of(
                "Java", new int[]{4, 5},
                "Spring Boot", new int[]{4, 5},
                "SQL", new int[]{3, 4},
                "Docker", new int[]{3, 4},
                "Git", new int[]{3, 4},
                "PostgreSQL", new int[]{2, 3},
                "REST APIs", new int[]{3, 4}
        ));

        Opportunity dataAnalystIntern = seedOpportunity(recruiter,
                "Data Analyst Intern", "Analyze product usage data, build dashboards and support data-driven decisions.",
                OpportunityType.INTERNSHIP, "Insight Analytics", "Mumbai", WorkMode.HYBRID,
                "Any degree with analytics interest", OpportunityStatus.OPEN, 45);
        seedOpportunitySkills(dataAnalystIntern, skills, Map.of(
                "SQL", new int[]{3, 5},
                "Python", new int[]{3, 5},
                "Excel", new int[]{2, 4},
                "Power BI", new int[]{2, 3}
        ));

        Opportunity frontendIntern = seedOpportunity(recruiter,
                "Frontend Developer Intern", "Build pixel-perfect React components and improve our design system.",
                OpportunityType.INTERNSHIP, "CodeCraft Labs", "Remote", WorkMode.REMOTE,
                "B.Tech / BCA / MCA", OpportunityStatus.OPEN, 45);
        seedOpportunitySkills(frontendIntern, skills, Map.of(
                "React", new int[]{3, 5},
                "JavaScript", new int[]{3, 5},
                "HTML/CSS", new int[]{3, 4},
                "Git", new int[]{2, 4}
        ));

        Opportunity aiChatbotProject = seedOpportunity(recruiter,
                "AI Chatbot - Student Project", "Collaborate on an NLP chatbot that answers placement FAQs. Great portfolio piece.",
                OpportunityType.PROJECT, "Insight Analytics", "Remote", WorkMode.REMOTE,
                "Open to all branches", OpportunityStatus.OPEN, 60);
        seedOpportunitySkills(aiChatbotProject, skills, Map.of(
                "Python", new int[]{3, 5},
                "Machine Learning", new int[]{3, 5},
                "SQL", new int[]{2, 3},
                "Communication", new int[]{2, 3}
        ));

        Opportunity cloudApprenticeship = seedOpportunity(recruiter,
                "Cloud Engineering Apprenticeship", "Learn cloud-native deployment, Docker and CI/CD on real projects.",
                OpportunityType.APPRENTICESHIP, "Nimbus Cloud", "Hyderabad", WorkMode.ONSITE,
                "B.Tech / BCA / MCA", OpportunityStatus.OPEN, 60);
        seedOpportunitySkills(cloudApprenticeship, skills, Map.of(
                "Docker", new int[]{3, 5},
                "Cloud Computing", new int[]{3, 5},
                "Git", new int[]{2, 4},
                "Java", new int[]{2, 3}
        ));

        Opportunity seniorBackend = seedOpportunity(recruiter,
                "Senior Backend Engineer", "Lead backend architecture for a high-scale product (currently closed for demo).",
                OpportunityType.JOB, "TechNova Solutions", "Bangalore", WorkMode.HYBRID,
                "4+ years experience", OpportunityStatus.CLOSED, 15);
        seedOpportunitySkills(seniorBackend, skills, Map.of(
                "Java", new int[]{5, 5},
                "Spring Boot", new int[]{5, 5},
                "Docker", new int[]{4, 5},
                "Cloud Computing", new int[]{4, 5},
                "PostgreSQL", new int[]{4, 5}
        ));

        // -- applications ---------------------------------------------------
        seedApplication(aaravProfile, backendIntern, "I have built Spring Boot REST services and want to grow with your team.");
        seedApplication(aaravProfile, aiChatbotProject, "I enjoy backend work and want to explore NLP applications.");
        seedApplication(ananyaProfile, dataAnalystIntern, "I have hands-on SQL and dashboard experience from my coursework.");

        log.info("Seeded SIH26044 prototype data: skills={}, opportunities={}", skills.size(), opportunityRepository.count());
    }

    private Map<String, Skill> seedSkills() {
        Map<String, Skill> skills = new LinkedHashMap<>();
        seedSkill(skills, "Java", SkillCategory.TECHNICAL, "Object-oriented programming language");
        seedSkill(skills, "Spring Boot", SkillCategory.TECHNICAL, "Java framework for building production-ready applications");
        seedSkill(skills, "SQL", SkillCategory.TECHNICAL, "Querying and managing relational databases");
        seedSkill(skills, "Git", SkillCategory.TECHNICAL, "Distributed version control");
        seedSkill(skills, "Docker", SkillCategory.TECHNICAL, "Containerization platform");
        seedSkill(skills, "React", SkillCategory.TECHNICAL, "JavaScript library for building user interfaces");
        seedSkill(skills, "JavaScript", SkillCategory.TECHNICAL, "Programming language of the web");
        seedSkill(skills, "HTML/CSS", SkillCategory.TECHNICAL, "Markup and styling for web pages");
        seedSkill(skills, "Python", SkillCategory.TECHNICAL, "General-purpose programming language");
        seedSkill(skills, "PostgreSQL", SkillCategory.TECHNICAL, "Open-source relational database");
        seedSkill(skills, "REST APIs", SkillCategory.TECHNICAL, "Designing and consuming HTTP APIs");
        seedSkill(skills, "Data Structures & Algorithms", SkillCategory.TECHNICAL, "Fundamental CS problem-solving building blocks");
        seedSkill(skills, "Cloud Computing", SkillCategory.TECHNICAL, "Delivering computing services over the internet");
        seedSkill(skills, "Machine Learning", SkillCategory.DOMAIN, "Building models that learn from data");
        seedSkill(skills, "Excel", SkillCategory.TECHNICAL, "Spreadsheet analysis and reporting");
        seedSkill(skills, "Power BI", SkillCategory.TECHNICAL, "Business intelligence and data visualization");
        seedSkill(skills, "Communication", SkillCategory.SOFT, "Clear verbal and written communication");
        seedSkill(skills, "Leadership", SkillCategory.SOFT, "Guiding and motivating teams");
        seedSkill(skills, "Teamwork", SkillCategory.SOFT, "Collaborating effectively with others");
        seedSkill(skills, "Problem Solving", SkillCategory.SOFT, "Analyzing issues and finding solutions");
        seedSkill(skills, "Adaptability", SkillCategory.SOFT, "Adjusting quickly to change");
        seedSkill(skills, "Time Management", SkillCategory.SOFT, "Prioritizing and organizing work");
        return skills;
    }

    private void seedSkill(Map<String, Skill> skills, String name, SkillCategory category, String description) {
        Skill skill = new Skill();
        skill.setName(name);
        skill.setCategory(category);
        skill.setDescription(description);
        skills.put(name, skillRepository.save(skill));
    }

    private User seedUser(String name, String email, Role role) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(DEMO_PASSWORD));
        user.setEnabled(true);
        user.setActive(true);
        user.setEmailVerified(true);
        user.setRole(role);
        return userRepository.save(user);
    }

    private StudentProfile seedStudentProfile(User user, String college, String degree, String branch,
                                              String targetRole, String bio) {
        StudentProfile profile = new StudentProfile();
        profile.setUser(user);
        profile.setCollegeName(college);
        profile.setDegree(degree);
        profile.setBranch(branch);
        profile.setGraduationYear(2027);
        profile.setBio(bio);
        profile.setTargetRole(targetRole);
        return studentProfileRepository.save(profile);
    }

    private void seedStudentSkill(StudentProfile profile, Map<String, Skill> skills, String skillName, int proficiency) {
        StudentSkill studentSkill = new StudentSkill();
        studentSkill.setStudent(profile);
        studentSkill.setSkill(skills.get(skillName));
        studentSkill.setProficiency(proficiency);
        studentSkill.setSource(SkillSource.VERIFIED);
        studentSkillRepository.save(studentSkill);
    }

    private void seedAssessmentTemplate(Map<String, Skill> skills) {
        Assessment template = new Assessment();
        template.setTitle("Technical Skills Assessment");
        template.setStatus(null);
        assessmentRepository.save(template);

        seedQuestion(template, skills, "Which keyword prevents a class from being extended in Java?",
                QuestionType.MULTIPLE_CHOICE, "Java", "final,static,abstract,const", "final", 1);
        seedQuestion(template, skills, "Which of these is NOT a primitive type in Java?",
                QuestionType.MULTIPLE_CHOICE, "Java", "int,boolean,String,double", "String", 1);
        seedQuestion(template, skills, "Which annotation marks the main class of a Spring Boot application?",
                QuestionType.MULTIPLE_CHOICE, "Spring Boot", "@SpringBootApplication,@Configuration,@RestController,@Autowired",
                "@SpringBootApplication", 1);
        seedQuestion(template, skills, "Which embedded web server does Spring Boot use by default?",
                QuestionType.MULTIPLE_CHOICE, "Spring Boot", "Tomcat,Jetty,Netty,Undertow", "Tomcat", 1);
        seedQuestion(template, skills, "Which SQL clause filters rows returned by a query?",
                QuestionType.MULTIPLE_CHOICE, "SQL", "WHERE,ORDER BY,GROUP BY,HAVING", "WHERE", 1);
        seedQuestion(template, skills, "Which keyword retrieves data from a database table?",
                QuestionType.MULTIPLE_CHOICE, "SQL", "SELECT,UPDATE,INSERT,DELETE", "SELECT", 1);
        seedQuestion(template, skills, "Which command records staged changes as a snapshot?",
                QuestionType.MULTIPLE_CHOICE, "Git", "git commit,git push,git add,git stash", "git commit", 1);
        seedQuestion(template, skills, "Which command builds an image from a Dockerfile?",
                QuestionType.MULTIPLE_CHOICE, "Docker", "docker build,docker run,docker pull,docker push", "docker build", 2);
        seedQuestion(template, skills, "What is the name of the file that defines how a Docker image is built?",
                QuestionType.SHORT_ANSWER, "Docker", null, "Dockerfile", 1);
        seedQuestion(template, skills, "Which behaviour demonstrates active listening?",
                QuestionType.MULTIPLE_CHOICE, "Communication",
                "Interrupting to share your view,Paraphrasing what the speaker said,Checking your phone,Thinking about your reply",
                "Paraphrasing what the speaker said", 1);
    }

    private void seedQuestion(Assessment template, Map<String, Skill> skills, String text, QuestionType type,
                              String skillName, String options, String correctAnswer, int weight) {
        AssessmentQuestion question = new AssessmentQuestion();
        question.setAssessment(template);
        question.setQuestionText(text);
        question.setQuestionType(type);
        question.setTargetSkill(skills.get(skillName));
        question.setOptions(options);
        question.setCorrectAnswer(correctAnswer);
        question.setWeight(weight);
        questionRepository.save(question);
    }

    private Opportunity seedOpportunity(User recruiter, String title, String description, OpportunityType type,
                                        String company, String location, WorkMode workMode, String qualification,
                                        OpportunityStatus status, int deadlineInDays) {
        Opportunity opportunity = new Opportunity();
        opportunity.setRecruiter(recruiter);
        opportunity.setTitle(title);
        opportunity.setDescription(description);
        opportunity.setType(type);
        opportunity.setCompanyName(company);
        opportunity.setLocation(location);
        opportunity.setWorkMode(workMode);
        opportunity.setMinimumQualification(qualification);
        opportunity.setStatus(status);
        opportunity.setApplicationDeadline(LocalDate.now().plusDays(deadlineInDays));
        return opportunityRepository.save(opportunity);
    }

    private void seedOpportunitySkills(Opportunity opportunity, Map<String, Skill> skills, Map<String, int[]> required) {
        required.forEach((skillName, values) -> {
            OpportunitySkill os = new OpportunitySkill();
            os.setOpportunity(opportunity);
            os.setSkill(skills.get(skillName));
            os.setRequiredProficiency(values[0]);
            os.setImportance(values[1]);
            opportunitySkillRepository.save(os);
        });
    }

    private void seedApplication(StudentProfile student, Opportunity opportunity, String coverLetter) {
        Application application = new Application();
        application.setStudent(student);
        application.setOpportunity(opportunity);
        application.setStatus(ApplicationStatus.APPLIED);
        application.setCoverLetter(coverLetter);
        applicationRepository.save(application);
    }
}