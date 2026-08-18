/**
 * AI Service Abstraction for CivicPulse
 * Uses external LLM API if key is present; otherwise falls back to deterministic rule engine.
 */

function calculatePriorityScore(severity, urgency, keywords, description) {
  let severityMap = { Low: 15, Medium: 30, High: 65, Critical: 90 };
  let urgencyMap = { Low: 15, Medium: 30, High: 65, Critical: 90 };

  const sScore = severityMap[severity] || 30;
  const uScore = urgencyMap[urgency] || 30;

  // Keyword hazard weight
  const text = description.toLowerCase();
  let safetyRisk = 20;
  if (text.includes('child') || text.includes('school') || text.includes('hospital') || text.includes('injury') || text.includes('accident') || text.includes('collapse') || text.includes('electric')) {
    safetyRisk = 90;
  } else if (text.includes('hazard') || text.includes('deep') || text.includes('overflow') || text.includes('dark') || text.includes('broken')) {
    safetyRisk = 60;
  }

  let affectedPopulation = 30;
  if (text.includes('main road') || text.includes('highway') || text.includes('market') || text.includes('junction') || text.includes('bridge')) {
    affectedPopulation = 85;
  } else if (text.includes('street') || text.includes('residential') || text.includes('neighborhood')) {
    affectedPopulation = 50;
  }

  const durationDays = text.includes('weeks') || text.includes('month') ? 80 : 35;
  const duplicateFrequency = 20; // default baseline

  // Weighted calculation (out of 100)
  const weightedScore = Math.round(
    sScore * 0.35 +
    uScore * 0.25 +
    safetyRisk * 0.20 +
    affectedPopulation * 0.12 +
    durationDays * 0.08
  );

  const priorityScore = Math.min(99, Math.max(10, weightedScore));

  return {
    priorityScore,
    factors: {
      severityScore: Math.round(sScore * 0.35),
      urgencyScore: Math.round(uScore * 0.25),
      safetyRisk: Math.round(safetyRisk * 0.20),
      affectedPopulation: Math.round(affectedPopulation * 0.12),
      durationDays: Math.round(durationDays * 0.08),
      duplicateFrequency: 5
    }
  };
}

async function analyzeIssue({ title, description, category, location, image }) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (apiKey && process.env.GEMINI_API_KEY) {
    try {
      // Optional external API call wrapper if valid key is set
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this civic issue report and output ONLY a raw JSON object with keys: category, severity (Low/Medium/High/Critical), urgency (Low/Medium/High/Critical), summary, suggestedAction, confidence (0.5 to 0.99).
Issue Title: ${title}
Category: ${category}
Description: ${description}
Location: ${location ? JSON.stringify(location) : 'N/A'}`
            }]
          }]
        })
      });
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        const calc = calculatePriorityScore(parsed.severity, parsed.urgency, [], description);
        return {
          category: parsed.category || category,
          severity: parsed.severity || 'Medium',
          urgency: parsed.urgency || 'Medium',
          summary: parsed.summary || `${title} reported near location.`,
          suggestedAction: parsed.suggestedAction || 'Dispatch local inspection team.',
          confidence: parsed.confidence || 0.88,
          priorityScore: calc.priorityScore,
          factors: calc.factors
        };
      }
    } catch (err) {
      console.warn('[AI Service] External API call failed, falling back to deterministic analyzer:', err.message);
    }
  }

  // Deterministic Intelligent Fallback
  const lowerText = `${title} ${description}`.toLowerCase();
  
  let detectedSeverity = 'Medium';
  let detectedUrgency = 'Medium';

  if (lowerText.includes('critical') || lowerText.includes('burst') || lowerText.includes('collapse') || lowerText.includes('live wire') || lowerText.includes('fire hazard') || lowerText.includes('severe accident')) {
    detectedSeverity = 'Critical';
    detectedUrgency = 'Critical';
  } else if (lowerText.includes('deep pothole') || lowerText.includes('dark') || lowerText.includes('flood') || lowerText.includes('blocked drain') || lowerText.includes('major leak')) {
    detectedSeverity = 'High';
    detectedUrgency = 'High';
  } else if (lowerText.includes('small') || lowerText.includes('minor') || lowerText.includes('litter') || lowerText.includes('paint')) {
    detectedSeverity = 'Low';
    detectedUrgency = 'Low';
  }

  // Category refining
  let detectedCategory = category || 'Public Infrastructure';
  if (lowerText.includes('pothole') || lowerText.includes('crack') || lowerText.includes('road')) detectedCategory = 'Potholes & Roads';
  else if (lowerText.includes('light') || lowerText.includes('pole') || lowerText.includes('power')) detectedCategory = 'Streetlights & Power';
  else if (lowerText.includes('water') || lowerText.includes('leak') || lowerText.includes('pipe')) detectedCategory = 'Water & Leakage';
  else if (lowerText.includes('garbage') || lowerText.includes('trash') || lowerText.includes('waste')) detectedCategory = 'Garbage & Sanitation';
  else if (lowerText.includes('drain') || lowerText.includes('sewage') || lowerText.includes('clog')) detectedCategory = 'Drainage & Sewage';
  else if (lowerText.includes('traffic') || lowerText.includes('signal') || lowerText.includes('sign')) detectedCategory = 'Traffic & Signage';

  const calc = calculatePriorityScore(detectedSeverity, detectedUrgency, [], description);

  const summary = `${detectedCategory} anomaly detected. ${description.substring(0, 110)}${description.length > 110 ? '...' : ''}`;
  
  let suggestedAction = 'Dispatch field inspection unit for on-site assessment.';
  if (detectedSeverity === 'Critical') {
    suggestedAction = 'IMMEDIATE DISPATCH: Route emergency municipal response team within 2 hours.';
  } else if (detectedSeverity === 'High') {
    suggestedAction = 'High priority ticket: Queue for crew dispatch within 24 hours.';
  } else if (detectedCategory === 'Garbage & Sanitation') {
    suggestedAction = 'Schedule sanitation team for next collection cycle.';
  }

  return {
    category: detectedCategory,
    severity: detectedSeverity,
    urgency: detectedUrgency,
    summary,
    suggestedAction,
    confidence: 0.91,
    priorityScore: calc.priorityScore,
    factors: calc.factors
  };
}

module.exports = { analyzeIssue };
