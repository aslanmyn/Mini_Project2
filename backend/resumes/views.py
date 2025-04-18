from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from pydantic import BaseModel, ValidationError as PydanticValidationError
from .models import Resume
from vacancies.models import Vacancy
import spacy
from docx import Document
from PyPDF2 import PdfReader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load spaCy model
nlp = spacy.load("en_core_web_md")


# Pydantic model for resume validation
class ResumeSchema(BaseModel):
    skills: list[str]
    organizations: list[str]
    dates: list[str]

    class Config:
        min_anystr_length = 1
        anystr_strip_whitespace = True

    @classmethod
    def validate_skills(cls, v):
        if len(v) < 3:
            raise ValueError("At least 3 skills must be listed.")
        return v


# Parse resume file
def parse_resume_file(file):
    print(f"📄 Parsing file: {file.name}")
    text = ""
    if file.name.endswith('.pdf'):
        reader = PdfReader(file)
        text = "".join([page.extract_text() or "" for page in reader.pages])
    elif file.name.endswith('.docx'):
        doc = Document(file)
        text = "\n".join([p.text for p in doc.paragraphs])

    text = " ".join(text.split())
    doc = nlp(text)
    extracted = extract_info(doc)
    extracted["text"] = text

    print("✅ Extracted info:")
    print(f"Skills: {extracted['skills']}")
    print(f"Organizations: {extracted['organizations']}")
    print(f"Dates: {extracted['dates']}")

    return extracted


# Extract info from doc
def extract_info(doc):
    predefined_skills = [
        "python", "django", "react", "javascript", "spacy", "nlp",
        "tensorflow", "postgresql", "git", "html", "css", "java"
    ]

    skills = list({
        token.text.lower()
        for token in doc
        if token.text.lower() in predefined_skills and len(token.text) > 2
    })
    orgs = [ent.text for ent in doc.ents if ent.label_ == "ORG"]
    dates = [ent.text for ent in doc.ents if ent.label_ == "DATE"]

    return {
        "skills": skills,
        "organizations": orgs,
        "dates": dates
    }


# Cosine similarity scoring
def score_resume_vs_job(resume_text, vacancy):
    job_text = build_job_text_from_vacancy(vacancy)

    print(f"📄 Resume Text:\n{resume_text}")
    print(f"\n📝 Job Text:\n{job_text}")

    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform([resume_text, job_text])
    score = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]

    print(f"\n📊 Cosine Similarity Score: {score:.4f}")
    return score


# Create full job description text
def build_job_text_from_vacancy(vacancy):
    job_parts = [
        f"{vacancy.required_skills}",
        f"{vacancy.experience_required} ",
    ]

    return "\n".join(job_parts)


# Check formatting
def check_formatting(text):
    issues = []
    if "experience" not in text.lower():
        issues.append("Missing 'Experience' section.")
    if "education" not in text.lower():
        issues.append("Missing 'Education' section.")
    if "skills" not in text.lower():
        issues.append("Missing 'Skills' section.")
    return issues


# ATS keyword suggestions
def ats_keywords_suggestion(resume_text, job_description):
    resume_doc = nlp(resume_text)
    job_doc = nlp(job_description)

    resume_keywords = set([token.lemma_ for token in resume_doc if token.pos_ in ['NOUN', 'PROPN']])
    job_keywords = set([token.lemma_ for token in job_doc if token.pos_ in ['NOUN', 'PROPN']])

    missing = list(job_keywords - resume_keywords)
    print("🔑 Missing Keywords:", missing)
    return missing


# Skill gap finder
def get_skill_gaps(resume_skills, required_skills):
    resume_skills_normalized = [skill.strip().lower() for skill in resume_skills]
    required_skills_normalized = [skill.strip().lower() for skill in required_skills]

    print("🧠 Resume Skills:", resume_skills_normalized)
    print("📌 Required Skills:", required_skills_normalized)

    skill_gaps = [skill for skill in required_skills_normalized if skill not in resume_skills_normalized]
    print("❗ Skill Gaps:", skill_gaps)
    return skill_gaps


class ResumeUploadParseView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get('resume')
        if not file:
            return Response({"error": "No resume uploaded."}, status=400)

        parsed_data = parse_resume_file(file)

        try:
            resume_data = ResumeSchema(**parsed_data)
        except PydanticValidationError as e:
            return Response({"error": e.errors()}, status=400)

        resume = Resume.objects.create(
            user=request.user,
            file=file,
            parsed_data=parsed_data
        )

        return Response({
            "message": "Uploaded and parsed.",
            "parsed_data": parsed_data,
            "resume_id": resume.id
        })


class JobMatchView(APIView):
    def post(self, request):
        resume_id = request.data.get('resume_id')
        vacancy_id = request.data.get('vacancy_id')

        if not resume_id or not vacancy_id:
            return Response({"error": "Resume ID and vacancy ID are required."}, status=400)

        try:
            resume = Resume.objects.get(id=resume_id, user=request.user)
        except Resume.DoesNotExist:
            return Response({"error": "Resume not found."}, status=404)

        try:
            vacancy = Vacancy.objects.get(id=vacancy_id)
        except Vacancy.DoesNotExist:
            return Response({"error": "Vacancy not found."}, status=404)

        # Check cache for parsed resume data
        cached_data = cache.get(f'resume_{request.user.id}_{resume.file.name}')
        if cached_data:
            parsed_data = cached_data
        else:
            # If no cached data, parse the resume file
            parsed_data = parse_resume_file(resume.file)
            # Cache the parsed data for future use
            cache.set(f'resume_{request.user.id}_{resume.file.name}', parsed_data, timeout=60 * 60)  # 1 hour

        resume_text = parsed_data.get('text', '')
        resume_skills = parsed_data.get('skills', [])

        match_score = score_resume_vs_job(resume_text, vacancy)

        if isinstance(vacancy.required_skills, str):
            required_skills = [skill.strip() for skill in vacancy.required_skills.split(',')]
        else:
            required_skills = vacancy.required_skills or []

        skill_gaps = get_skill_gaps(resume_skills, required_skills)
        job_text = build_job_text_from_vacancy(vacancy)
        keyword_suggestions = ats_keywords_suggestion(resume_text, job_text)
        formatting_suggestions = check_formatting(resume_text)
        rating = round(match_score * 10, 1)

        recommendations = []
        if skill_gaps:
            recommendations.append(f"Add missing skills: {', '.join(skill_gaps)}")
        if formatting_suggestions:
            recommendations.append("Improve formatting.")
        if keyword_suggestions:
            recommendations.append("Add relevant keywords.")

        match_result = {
            "match_score": match_score,
            "resume_skills": resume_skills,
            "required_skills": required_skills,
            "skill_gaps": skill_gaps,
            "formatting_suggestions": formatting_suggestions,
            "keyword_optimization": keyword_suggestions,
            "rating": rating,
            "recommendations": recommendations,
            "resume_excerpt": resume_text[:300] + "..."
        }
        

        return Response(match_result)
    
    

