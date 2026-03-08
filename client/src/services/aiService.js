/* src/services/aiService.js */

// 1. Point to the free model alias
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

// 2. SECURE THE KEY: Read from the .env file
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // <--- This is the fix! 

export const suggestSubtasks = async (taskTitle) => {
  console.log(`🤖 AI: Trying 'gemini-flash-latest' for "${taskTitle}"...`);

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `
            You are a productivity expert. 
            Goal: "${taskTitle}". 
            
            STRICT INSTRUCTION: Break this into EXACTLY 3 to 5 distinct, actionable steps.
            
            Format: Return ONLY a raw JSON array of strings. 
            Example: ["Step 1: Do X", "Step 2: Do Y", "Step 3: Do Z"].
            
            Do NOT return a single step. Do NOT return markdown.
          `
          }]
        }]
      })
    });

    const data = await response.json();

    // Error Handling
    if (!response.ok) {
      console.error("API Error Detail:", data);
      throw new Error(data.error?.message || "Google API Error");
    }

    // Extract Text
    const text = data.candidates[0].content.parts[0].text;
    const cleanText = text.replace(/```json|```/g, "").trim();
    
    return JSON.parse(cleanText);

  } catch (error) {
    console.error("❌ AI Service Failed:", error);
    return [
      "Manual Step 1",
      "Manual Step 2 (Free Tier Limit Hit)",
      "Try again in 1 minute"
    ];
  }
};