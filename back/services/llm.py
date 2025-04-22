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
- Income: "Salary", "Freelance", "Investments", "Paycheck"
- Expenses: 
  "payments", 
  "supermarket", 
  "phone", 
  "fuel", 
  "subscriptions", 
  "online_purchase", 
  "telecommunications", 
  "restaurants", 
  "cash_withdrawals", 
  "anomalies", 
  "other"

## OUTPUT STRUCTURE

  "transactions": [
    
      "date": "YYYY-MM-DD", 
      "description": "Transaction text",
      "amount": float,
      "category": string
    ,
    ...
  ],

### Statement Data:
{text}

## RULES
1. Convert all dates to "DD-MMM-YYYY" format (e.g., "14-feb-2025")
2. Maintain negative amounts for credits/payments
3. Amounts must be floats (not strings)
4. Categorize transactions using these guidelines:
   - "payments": Any refunds or payments made to the account
   - "supermarket": Retail purchases, online/offline stores
   - "phone": Phone Bills
   - "fuel": Gas station transactions
   - "subscriptions": Recurring payments
   - "telecommunications": internet, tech services
   - "restaurants": dinning, lifestyle
   - "online_purchase": mercado libre, amazon, etc
   - "cash_withdrawals": efectivo
   - "anomalies": efectivo
   - "other": other concepts
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
        # with open("./example/200-back.json", "r") as file:
        #     result = json.load(file)
        return result
    except Exception as e:
        print("--->err", e)
        raise RuntimeError("LLM analysis failed: ", str(e))
