$body = @{
    student = @{
        course = "Computer Science"
        academic_level = "300 Level"
        verified_skills = @(
            @{ name = "JavaScript"; level = 4 },
            @{ name = "Node.js"; level = 3 }
        )
        self_claimed_skills = @(
            @{ name = "React"; level = 3 }
        )
        project_evidence = @(
            @{ name = "E-commerce API"; link = "https://github.com/student/api" },
            @{ name = "Portfolio Website"; link = "https://student.com" }
        )
        github_activity = @{
            active_repositories = 12
            contributions_last_month = 45
        }
        availability = "Full-time"
        location = "Lagos, Remote"
    }
    requirement = @{
        role_title = "Backend Intern"
        required_skills = @("JavaScript", "Node.js")
        optional_skills = @("React", "Docker")
        minimum_competency_level = 3
        work_type = "Remote"
        duration = "6 months"
    }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:5000/api/match" -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json

