from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from jose import jwt
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
import os
import json

load_dotenv()

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_groq_client():
    from groq import Groq
    return Groq(api_key=GROQ_API_KEY)

@router.post("/analyze-waste")
async def analyze_waste(
    photo: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    try:
        from google import genai
        from PIL import Image
        import io

        contents = await photo.read()
        image = Image.open(io.BytesIO(contents))

        client = genai.Client(api_key=GEMINI_API_KEY)

        prompt = """You are a waste identification AI for Kenya's Taka Smart Waste system. 
Analyze this image and respond in JSON only with no extra text or markdown:
{
  "waste_type": "plastic or organic or electronic or hazardous or construction or general",
  "severity": "low or medium or high or critical",
  "description": "2-3 sentence description suitable for a waste report in Kenya",
  "recommended_action": "specific action for county officials to take"
}"""

        response = client.models.generate_content(
            model="models/gemini-2.0-flash-lite",
            contents=[prompt, image]
        )

        text = response.text.strip()
        clean = text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean)

    except json.JSONDecodeError:
        return {
            "waste_type": "general",
            "severity": "medium",
            "description": "Waste detected in the uploaded image. Manual review recommended.",
            "recommended_action": "Send waste collection team to the reported location."
        }
    except Exception as e:
        return {
            "waste_type": "general",
            "severity": "medium",
            "description": "Could not analyze image automatically. Please describe the waste manually.",
            "recommended_action": "Manual review required by county officials."
        }

@router.post("/chat")
async def ai_chat(
    message: str,
    current_user: User = Depends(get_current_user)
):
    try:
        client = get_groq_client()

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": """You are Taka AI, the smart waste management assistant for Kenya's Taka Smart Waste system.

You help all stakeholders:
- RESIDENTS: report waste, earn points, check schedules, use the map
- COUNTY OFFICIALS/ADMIN: manage reports, view analytics, compliance reports
- WASTE COMPANIES: understand coverage areas and collection assignments
- ENVIRONMENTAL AGENCIES: waste data and illegal dumping reports

Key system facts:
- Residents earn 10 points for every resolved waste report
- Reports can be normal waste or illegal dumping
- Admin confirms and resolves reports
- Collection schedules notify all residents automatically
- The map shows waste hotspots across Kenya
- Leaderboard shows top reporting residents
- Compliance reports can be printed for county meetings

Be helpful, friendly and concise. Keep responses under 120 words. Always respond in English."""
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            max_tokens=300,
            temperature=0.7
        )

        return {"response": response.choices[0].message.content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.post("/generate-summary")
async def generate_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        from models.report import Report

        reports = db.query(Report).all()
        total = len(reports)
        resolved = len([r for r in reports if r.status == "resolved"])
        illegal = len([r for r in reports if r.is_illegal_dumping])
        illegal_resolved = len([r for r in reports if r.is_illegal_dumping and r.status == "resolved"])
        rate = round((resolved / total * 100), 1) if total > 0 else 0
        illegal_rate = round((illegal_resolved / illegal * 100), 1) if illegal > 0 else 0

        client = get_groq_client()

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional waste management compliance officer writing formal reports for Kenya county government meetings."
                },
                {
                    "role": "user",
                    "content": f"""Write a formal 3-4 sentence executive summary for a Kenya county government meeting about waste management performance. Use this data:

Total Reports Filed: {total}
Reports Resolved: {resolved}
Resolution Rate: {rate}%
Pending Reports: {total - resolved}
Illegal Dumping Cases: {illegal}
Illegal Cases Resolved: {illegal_resolved}
Illegal Resolution Rate: {illegal_rate}%

Be professional, factual and suitable for a formal Kenya county government document."""
                }
            ],
            max_tokens=400,
            temperature=0.5
        )

        return {"summary": response.choices[0].message.content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summary generation failed: {str(e)}")

@router.post("/predict-hotspots")
async def predict_hotspots(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        from models.report import Report

        reports = db.query(Report).all()
        locations = {}
        for r in reports:
            locations[r.location_name] = locations.get(r.location_name, 0) + 1
        top = sorted(locations.items(), key=lambda x: x[1], reverse=True)[:10]
        location_str = ", ".join([f"{k}: {v} reports" for k, v in top])
        total = len(reports)
        resolved = len([r for r in reports if r.status == "resolved"])
        illegal = len([r for r in reports if r.is_illegal_dumping])
        pending = len([r for r in reports if r.status == "pending"])

        client = get_groq_client()

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": "You are a waste management AI analyst for Kenya providing actionable insights to county officials."
                },
                {
                    "role": "user",
                    "content": f"""Based on this waste report data from Kenya, provide actionable insights:

Top Waste Locations: {location_str if location_str else 'No location data yet'}
Total Reports: {total}
Resolved: {resolved}
Pending: {pending}
Illegal Dumping Cases: {illegal}

Provide:
1. Top 3 predicted hotspot areas needing urgent attention
2. Pattern analysis (2 sentences)
3. Three specific recommendations for county officials in Kenya

Be concise and actionable. Format with clear numbered sections."""
                }
            ],
            max_tokens=500,
            temperature=0.6
        )

        return {"prediction": response.choices[0].message.content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")