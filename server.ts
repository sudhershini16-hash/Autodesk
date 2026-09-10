import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy Google Gen AI helper
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// AI Smart City Advisor endpoint
app.post("/api/ai/advisor", async (req, res) => {
  try {
    const { prompt, cityStats } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getAiClient();

    // Fallback heuristic engine if no key or API error
    const generateFallbackAdvice = (userQuery: string, stats: any) => {
      const q = userQuery.toLowerCase();
      const pop = stats?.populationCapacity || 85000;
      const green = stats?.greenCoverage || 42;
      const renewable = stats?.renewableEnergy || 78;
      const walk = stats?.walkabilityScore || 82;
      const traffic = stats?.trafficCongestion || "Medium";

      if (q.includes("hospital") || q.includes("health")) {
        return {
          title: "Strategic Healthcare Node Optimization",
          recommendation: `Place the regional hospital facility along the secondary arterial corridor (near coordinate [X: 40, Z: -20]), at least 300m away from heavy industrial zones. This guarantees sub-6 minute emergency access across residential quarters while buffering against peak morning commercial congestion.`,
          actionItems: [
            "Allocate 1.8 hectares near the transit line for multi-modal ambulance and public access",
            "Establish an acoustic green buffer with canopy trees around the medical perimeter",
            "Pair with a backup solar array & battery storage substation for 100% grid resilience"
          ],
          impact: "Reduces critical transit response times by ~24% and elevates civic healthcare score."
        };
      }

      if (q.includes("green") || q.includes("park") || q.includes("tree")) {
        return {
          title: "Biodiversity & Microclimate Corridor Strategy",
          recommendation: `Your current green coverage is ${green}%. To achieve the international 50% target for resilient cities, introduce linear biophilic green fingers connecting the central park to the perimeter residential zones.`,
          actionItems: [
            "Convert hardscape pedestrian alleys into continuous bioswales and tree-lined avenues",
            "Mandate extensive green rooftops on commercial and residential structures over 6 floors",
            "Add retention ponds at topographical collection nodes to boost urban cooling by 1.8°C"
          ],
          impact: "Projected 8% reduction in urban heat island intensity and +14 points to Sustainability Score."
        };
      }

      if (q.includes("solar") || q.includes("energy") || q.includes("renewable")) {
        return {
          title: "Decentralized Clean Energy Microgrid",
          recommendation: `Current renewable energy ratio is ${renewable}%. Leverage high-insolation rooftop surfaces on commercial and industrial complexes, while deploying a centralized solar farm on unshaded southern parcel boundaries.`,
          actionItems: [
            "Install high-efficiency photovoltaic canopies over parking and EV transit lots",
            "Position a 15 MW battery storage bank adjacent to primary substations to shave peak evening loads",
            "Incorporate building-integrated photovoltaics (BIPV) on south-facing glazed façades"
          ],
          impact: "Closes current grid deficits and provides a +5.4 MWh/day municipal clean energy surplus."
        };
      }

      if (q.includes("pedestrian") || q.includes("walk") || q.includes("bike")) {
        return {
          title: "15-Minute City Active Mobility Blueprint",
          recommendation: `Current walkability index stands at ${walk}/100. Bridge isolated residential clusters by expanding 4m dedicated cycling tracks and pedestrianized shopping boulevards within 400m catchment isochrones.`,
          actionItems: [
            "Enforce traffic-calmed shared zones (Woonerf) in dense residential precincts",
            "Add 6 automated bike-share hubs at primary rapid transit stops and community plazas",
            "Ensure shade tree coverage exceeds 65% along all arterial pedestrian walkways"
          ],
          impact: "Reduces short vehicular trips by 32% and boosts localized commercial footfall."
        };
      }

      if (q.includes("traffic") || q.includes("road") || q.includes("congestion")) {
        return {
          title: "Dynamic Smart Traffic Flow Harmonization",
          recommendation: `Current traffic pressure is ${traffic}. Transition from traditional fixed-phase intersections to adaptive IoT sensor-timed corridors, coupled with dedicated bus-rapid-transit (BRT) rights-of-way.`,
          actionItems: [
            "Upgrade key 4-way intersections with smart radar loop detectors and priority bus signalling",
            "Divert heavy freight transport to circumferential bypass routes during peak 07:30–09:30 hours",
            "Integrate multimodal mobility hubs equipped with EV fast-chargers at highway entrance gates"
          ],
          impact: "Lowers intersection idle emissions by 28% and smooths peak commuter transit times."
        };
      }

      return {
        title: "Holistic Smart City Synthesis & Planning Guidance",
        recommendation: `Analyzing current city state (${pop.toLocaleString()} est. population, ${green}% green space, ${renewable}% renewables): The masterplan exhibits strong density-to-amenity balance. Prioritize integrating localized circular economy nodes (smart waste recovery and greywater filtration) into the western civic sector.`,
        actionItems: [
          "Balance commercial-to-residential floor area ratio (FAR) at 1:1.6 to minimize commuter displacement",
          "Deploy smart street lighting arrays with integrated air quality sensors along collector roads",
          "Conduct shadow sweep simulation between 10:00 and 14:00 before raising central high-rise heights above 70m"
        ],
        impact: "Accelerates carbon-neutral certification path and enhances overall masterplan livability."
      };
    };

    if (ai) {
      try {
        const systemPrompt = `You are "CITY AI", an elite computational urban planner, architect, and smart city digital twin consultant.
You advise architects and urban designers using an Autodesk Forma-style interactive 3D site planner.
Current City Metrics:
- Estimated Population Capacity: ${cityStats?.populationCapacity || "85,000"}
- Total Site Area: ${cityStats?.siteArea || "250 hectares"}
- Green Coverage: ${cityStats?.greenCoverage || "42%"}
- Renewable Energy: ${cityStats?.renewableEnergy || "78%"}
- Sustainability Score: ${cityStats?.sustainabilityScore || "92"}/100
- Walkability Score: ${cityStats?.walkabilityScore || "82"}/100
- Traffic Congestion: ${cityStats?.trafficCongestion || "Medium"}
- Building Count: ${cityStats?.buildingCount || "28"}
- Daily Energy Balance: ${cityStats?.energyBalance || "+5.4 MWh surplus"}

Provide professional, concise, actionable urban planning guidance. Structure your response with:
1. Architectural / Urban Planning Recommendation (2-3 concise sentences)
2. 3 Specific Action Items (bullet points)
3. Quantitative / Environmental Impact Estimate`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: [
            {
              role: "user",
              parts: [
                { text: systemPrompt },
                { text: `User Question: "${prompt}"` }
              ]
            }
          ]
        });

        const text = response.text || "";
        return res.json({
          source: "gemini",
          model: "gemini-3.8-flash",
          adviceText: text,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.warn("Gemini API call failed, using heuristic advisor:", err);
      }
    }

    // Fallback response if no AI key or API unavailable
    const fallback = generateFallbackAdvice(prompt, cityStats);
    const adviceText = `### ${fallback.title}

${fallback.recommendation}

**Recommended Planning Actions:**
${fallback.actionItems.map(item => `• ${item}`).join("\n")}

**Estimated Impact:**
${fallback.impact}

*(Calculated via Smart City Expert Heuristics Engine)*`;

    return res.json({
      source: "expert-heuristics",
      adviceText,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("AI Advisor error:", error);
    res.status(500).json({ error: error.message || "Failed to generate advisory" });
  }
});

async function startServer() {
  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart City Site Planner server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
