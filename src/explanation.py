import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Initialize the client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

def explain(insights: dict, model: str = "openrouter/free") -> str:
    """
    Generate an explanation for the given insights using the specified model.
    
    Args:
        insights: Dictionary containing analysis insights
        model: The model to use for generating the explanation
        
    Returns:
        str: Generated explanation text
    """
    prompt = build_prompt(insights)
    
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a professional financial analyst."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating explanation: {str(e)}"

def build_prompt(report):

    return f"""
You are a quantitative trading analyst.

Here is the computed analysis:

{report}

The decision has already been determined algorithmically.

Explain why the decision is {report['decision']} using ONLY the provided metrics.
Do not contradict the data.
Do not invent information.
Keep it professional and concise.
"""
