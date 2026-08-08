import uuid
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.infrastructure.database.connection import SessionLocal, settings
from src.infrastructure.database.models import BrandModel, ProductModel, LoyaltyMemberModel, LeasingInquiryModel

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_classic.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.tools import tool
from langchain_core.messages import AIMessage, HumanMessage

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = [] # list of {"from": "user"|"bot", "text": "..."}

# Define Tools
@tool
def search_mall_directory(query: str) -> str:
    """
    Search the Zivanta Mall directory for brands, stores, categories, or specific products.
    Use this tool whenever the user asks about stores, locations, products, prices, ratings, or what items are sold at the mall.
    """
    with SessionLocal() as db:
        # Search brands by name, type, or description
        brand_search = f"%{query}%"
        brands = db.query(BrandModel).filter(
            (BrandModel.name.ilike(brand_search)) |
            (BrandModel.type.ilike(brand_search)) |
            (BrandModel.description.ilike(brand_search))
        ).limit(10).all()
        
        # Search products by name or category
        products = db.query(ProductModel).filter(
            (ProductModel.name.ilike(brand_search)) |
            (ProductModel.category.ilike(brand_search))
        ).limit(10).all()
        
        if not brands and not products:
            return f"No brands or products found matching '{query}' in the mall directory."
        
        result = []
        if brands:
            result.append("### Matching Brands/Stores:")
            for b in brands:
                result.append(f"- **{b.name}** (Floor: {b.floor}, Category: {b.type}): {b.description}")
        
        if products:
            result.append("\n### Matching Products:")
            for p in products:
                # Find product's brand name
                brand_name = "Unknown Store"
                b = db.query(BrandModel).filter(BrandModel.id == p.brand_id).first()
                if b:
                    brand_name = b.name
                result.append(f"- **{p.name}** (Store: {brand_name}, Price: {p.price}, Rating: {p.rating} stars, Category: {p.category})")
                
        return "\n".join(result)

@tool
def join_loyalty_program(name: str, email: str) -> str:
    """
    Sign up a customer for the Zivanta Elite Loyalty Program.
    Use this tool when the user explicitly requests to join, sign up, or register for the loyalty rewards program, and provides their name and email.
    """
    if not name or not email:
        return "Error: Both a name and a valid email are required to sign up for the loyalty program."
        
    with SessionLocal() as db:
        # Check if email already registered
        existing = db.query(LoyaltyMemberModel).filter(LoyaltyMemberModel.email == email).first()
        if existing:
            return f"You are already registered in the Zivanta loyalty program under the tier '{existing.tier}' with {existing.points} points."
        
        try:
            # Create member
            new_member = LoyaltyMemberModel(
                id=uuid.uuid4(),
                email=email,
                name=name,
                tier="Elite",
                points=100  # Welcome bonus points
            )
            db.add(new_member)
            db.commit()
            return f"Success! **{name}** has been registered for the Zivanta Elite Loyalty Program (Email: {email}). As a welcome gift, 100 points have been added to your account! You now have access to concierge, valet, and the private lounge."
        except Exception as e:
            db.rollback()
            return f"Failed to register for loyalty program due to a database error: {str(e)}"

@tool
def submit_leasing_inquiry(full_name: str, company_name: str, email: str, category: str, message: str) -> str:
    """
    Submit a leasing inquiry to rent retail, dining, or commercial space in Zivanta Mall.
    Use this tool when the user wants to lease, rent, open a shop, or inquire about available commercial spaces, and provides their contact information.
    """
    if not full_name or not company_name or not email or not category:
        return "Error: Full name, company name, email, and business category are required to submit a leasing inquiry."
        
    with SessionLocal() as db:
        try:
            new_inquiry = LeasingInquiryModel(
                id=uuid.uuid4(),
                full_name=full_name,
                company_name=company_name,
                email=email,
                category=category,
                message=message or ""
            )
            db.add(new_inquiry)
            db.commit()
            return f"Success! Leasing inquiry submitted for **{company_name}** (Contact: {full_name}, Email: {email}). Our leasing team will contact you shortly regarding available retail space in the '{category}' category."
        except Exception as e:
            db.rollback()
            return f"Failed to submit leasing inquiry due to a database error: {str(e)}"

@tool
def get_general_mall_info() -> str:
    """
    Get general information about Zivanta Luxury Mall, such as hours of operation, parking locations/rates, Wi-Fi networks, services, and contacts.
    Use this tool when the user asks generic questions about mall timing, how to park, wifi passwords, customer support, or layouts.
    """
    return (
        "### Zivanta Luxury Mall Info:\n"
        "- **Mall Hours**: Open daily 10:00 AM – 11:00 PM (including weekends & holidays).\n"
        "- **Parking**: Paid parking is accessible from the North & South entrances. Zivanta Elite loyalty members receive complimentary 4 hours parking.\n"
        "- **Free Wi-Fi**: Network: 'Zivanta_Guest' · Password/Code: ELITE2025.\n"
        "- **Floor Layout**: \n"
        "  - Ground Floor: Premium Dining, Cafes (like Starbucks Reserve), Information Desk.\n"
        "  - Level 1: Luxury Fashion (Dior, Gucci, etc.).\n"
        "  - Level 2: Jewellery & Fine Watches (Cartier, Rolex, etc.).\n"
        "  - Level 3: Electronics (Apple Store, etc.) and Entertainment.\n"
        "- **Contact**: Email: info@zivanta.com · Phone: +1 (555) 0100-1000 · Or visit the Information Desk on the Ground Floor.\n"
        "- **Events**: Diwali Grand Celebration, Spring Fashion Week, etc. (more details in the Events section)."
    )

tools = [search_mall_directory, join_loyalty_program, submit_leasing_inquiry, get_general_mall_info]

# Initialize Chat Model
def get_chat_agent():
    if settings.GROQ_API_KEY:
        llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            groq_api_key=settings.GROQ_API_KEY
        )
    elif settings.GOOGLE_API_KEY:
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            temperature=0.3,
            google_api_key=settings.GOOGLE_API_KEY
        )
    else:
        raise ValueError("Neither GROQ_API_KEY nor GOOGLE_API_KEY is configured in backend .env file.")
    
    # Prompt Template
    prompt = ChatPromptTemplate.from_messages([
        ("system", 
         "You are the Zivanta Luxury Mall Concierge, a highly sophisticated, helpful, and polite AI assistant representing Zivanta Luxury Mall.\n\n"
         "Your goal is to guide visitors and answer questions about stores, products, dining, services, parking, leasing, and mall hours.\n\n"
         "Follow these strict response guidelines:\n"
         "1. Structure your answers clearly. Use headers (## or ###), bold text, and bulleted or numbered lists for readability. Keep lists in this simple format:\n"
         "   - **Item Name**: Description or details.\n"
         "2. Always search the mall directory using `search_mall_directory` when visitors ask about specific stores, categories, products, prices, or ratings.\n"
         "3. If a visitor wants to sign up for the Zivanta Elite Loyalty Program, ask for their name and email if they haven't provided them, then invoke `join_loyalty_program` immediately.\n"
         "4. If a visitor wants to lease, rent, or open a shop, ask for their name, company, email, category, and message if not provided, then invoke `submit_leasing_inquiry` immediately.\n"
         "5. For general queries (hours, Wi-Fi, floor layouts, parking rates), use `get_general_mall_info`.\n"
         "6. Always respond professionally. If a requested brand or product is not found in the directory, suggest exploring general categories or checking with the Information Desk on the Ground Floor."),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])
    
    agent = create_tool_calling_agent(llm, tools, prompt)
    return AgentExecutor(agent=agent, tools=tools, verbose=True)

@router.post("")
async def chat_endpoint(payload: ChatRequest):
    if not settings.GROQ_API_KEY and not settings.GOOGLE_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Neither GROQ_API_KEY nor GOOGLE_API_KEY is set on the server. Please add one to your backend .env file."
        )
        
    try:
        agent_executor = get_chat_agent()
        
        # Convert history format to LangChain message classes
        chat_history = []
        for msg in payload.history:
            if msg.get("from") == "user":
                chat_history.append(HumanMessage(content=msg.get("text", "")))
            elif msg.get("from") == "bot":
                chat_history.append(AIMessage(content=msg.get("text", "")))
                
        # Invoke agent
        response = agent_executor.invoke({
            "input": payload.message,
            "chat_history": chat_history
        })
        
        return {"response": response.get("output", "I'm sorry, I couldn't process that request.")}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing chat agent: {str(e)}"
        )
