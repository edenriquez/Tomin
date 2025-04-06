from openai import OpenAI
import os
import json
from dotenv import load_dotenv
from typing import Dict, Any

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1/",
)


EXPENSE_PROMPT_TEMPLATE = """
Analyze the following bank statement and return a structured JSON object with these requirements:

## CATEGORIES TO USE
- Income: "Salary", "Freelance", "Investments"
- Expenses: 
  "Payments/Credits", 
  "Shopping", 
  "Services", 
  "Entertainment", 
  "Fuel", 
  "Groceries", 
  "Telecommunications", 
  "Subscriptions", 
  "Restaurants", 
  "Other"

## OUTPUT STRUCTURE

  "category_distribution_sum": 
    "payments": float,
    "shopping": float,
    "services": float,
    "entertainment": float,
    "fuel": float,
    "groceries": float,
    "telecommunications": float,
    "subscriptions": float,
    "restaurants": float,
    "other": float
  ,
  "transactions": [
    
      "date": "YYYY-MM-DD", 
      "description": "Transaction text",
      "amount": float
    ,
    ...
  ],
  "transactions_by_category": 
    "category_name": [
      
        "date": "YYYY-MM-DD",
        "description": "Transaction text",
        "amount": float
      ,
      ...
    ],
    ...

### Statement Data:
{text}

## RULES
1. Convert all dates to "DD-MMM-YYYY" format (e.g., "14-feb-2025")
2. Maintain negative amounts for credits/payments
3. Amounts must be floats (not strings)
4. Categorize transactions using these guidelines:
   - "Payments/Credits": Any refunds or payments made to the account
   - "Shopping": Retail purchases, online/offline stores
   - "Services": Bills, utilities, professional services
   - "Fuel": Gas station transactions
   - "Groceries": Supermarkets, food stores
   - "Telecommunications": Phone, internet, tech services
   - "Subscriptions": Recurring payments
5. Include ALL transactions from the statement
6. Use "Other" for unclassifiable transactions
7. Transaction description should be the exact same that is in the document ( no translation )
7. Category names should be lower case

Return ONLY valid JSON. No commentary or formatting.
"""


async def analyze_expenses(text: str) -> Dict[str, Any]:
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "user", "content": EXPENSE_PROMPT_TEMPLATE.format(text=text)}
            ],
            response_format={"type": "json_object"},
        )
        print("--->", response)
        result = json.loads(response.choices[0].message.content)
        return result
    except Exception as e:
        print("--->err", e)
        raise RuntimeError("LLM analysis failed: ", str(e))
