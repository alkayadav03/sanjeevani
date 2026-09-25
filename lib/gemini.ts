export interface GeminiResponse {
  text: string;
  source: 'live_gemini' | 'algorithmic_fallback';
  modelUsed: string;
  error?: string;
}

export async function callGemini(prompt: string, fallbackText: string): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY') {
    return {
      text: `${fallbackText}\n\n[System Note: Configure GEMINI_API_KEY in .env.local to enable live generative explanations from Google Gemini 1.5 Flash.]`,
      source: 'algorithmic_fallback',
      modelUsed: 'Local Algorithmic Expert Fallback',
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 350,
          },
        }),
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API returned error status:', response.status, errText);
      return {
        text: `${fallbackText}\n\n[Gemini API Note: HTTP ${response.status}. Serving algorithmic clinical explanation.]`,
        source: 'algorithmic_fallback',
        modelUsed: 'Local Algorithmic Expert Fallback',
        error: `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidate) {
      return {
        text: fallbackText,
        source: 'algorithmic_fallback',
        modelUsed: 'Local Algorithmic Expert Fallback',
      };
    }

    return {
      text: candidate.trim(),
      source: 'live_gemini',
      modelUsed: 'gemini-1.5-flash',
    };
  } catch (err: any) {
    console.error('Gemini call failed or timed out:', err.message);
    return {
      text: `${fallbackText}\n\n[Connection notice: Live Gemini call unreachable (${err.message}). Serving local algorithmic analysis.]`,
      source: 'algorithmic_fallback',
      modelUsed: 'Local Algorithmic Expert Fallback',
      error: err.message,
    };
  }
}
