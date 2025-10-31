import { GoogleGenAI, Type } from "@google/genai";
import type { KeywordAnalysis, ProductAnalysis, ShopAnalysis, RankAnalysis } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a safeguard. The environment is expected to have the API key.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const model = "gemini-2.5-flash";

const generateJson = async <T,>(prompt: string, schema: any): Promise<T | null> => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });
    
    const text = response.text.trim();
    return JSON.parse(text) as T;

  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    return null;
  }
};


export const analyzeKeyword = async (keyword: string): Promise<KeywordAnalysis | null> => {
  const prompt = `
    You are an expert Etsy SEO and market research analyst.
    Analyze the following keyword for a seller on Etsy: "${keyword}".

    Provide a detailed analysis in JSON format. The JSON object should have the following structure:
    {
      "competition": "Low|Medium|High",
      "search_volume": "Low|Medium|High",
      "buyer_intent": "Informational|Commercial|Transactional",
      "competition_score": 78,
      "estimated_monthly_searches": 12500,
      "historical_data": [
        {"month": "Jan", "value": 60},
        {"month": "Feb", "value": 65},
        {"month": "Mar", "value": 70},
        {"month": "Apr", "value": 75},
        {"month": "May", "value": 80},
        {"month": "Jun", "value": 85},
        {"month": "Jul", "value": 70},
        {"month": "Aug", "value": 65},
        {"month": "Sep", "value": 80},
        {"month": "Oct", "value": 90},
        {"month": "Nov", "value": 100},
        {"month": "Dec", "value": 95}
      ],
      "niche_suggestions": ["niche idea 1", "niche idea 2"],
      "long_tail_keywords": ["long tail 1", "long tail 2"],
      "suggested_tags": ["tag 1", "tag 2", "tag 3", "tag 4", "tag 5", "tag 6", "tag 7", "tag 8", "tag 9", "tag 10", "tag 11", "tag 12", "tag 13"],
      "product_ideas": ["product idea 1", "product idea 2"]
    }

    Base your analysis on typical e-commerce and Etsy trends. Ensure the historical data shows some realistic fluctuation (e.g., seasonal peaks).
    Provide ONLY the raw JSON object in your response, without any markdown formatting like \`\`\`json.
  `;
  const schema = {
    type: Type.OBJECT,
    properties: {
      competition: { type: Type.STRING },
      search_volume: { type: Type.STRING },
      buyer_intent: { type: Type.STRING },
      competition_score: { type: Type.NUMBER },
      estimated_monthly_searches: { type: Type.NUMBER },
      historical_data: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            month: { type: Type.STRING },
            value: { type: Type.NUMBER },
          },
          required: ["month", "value"],
        },
      },
      niche_suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
      long_tail_keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
      suggested_tags: { type: Type.ARRAY, items: { type: Type.STRING } },
      product_ideas: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["competition", "search_volume", "buyer_intent", "competition_score", "estimated_monthly_searches", "historical_data", "niche_suggestions", "long_tail_keywords", "suggested_tags", "product_ideas"],
  };
  return generateJson<KeywordAnalysis>(prompt, schema);
};


export const analyzeShop = async (shopName: string): Promise<ShopAnalysis | null> => {
    const prompt = `
      You are an expert Etsy business analyst. You cannot access live data, but you can generate a realistic, hypothetical analysis based on a shop name.
      Analyze the hypothetical Etsy shop named: "${shopName}".
  
      Provide a detailed analysis in JSON format. The JSON object should have the following structure:
      {
        "shop_name": "${shopName}",
        "niche": "description of the shop's niche",
        "estimated_monthly_sales": "e.g., 50-100 sales",
        "top_keywords": ["keyword 1", "keyword 2", "keyword 3"],
        "strengths": ["strength 1", "strength 2"],
        "areas_for_improvement": ["suggestion 1", "suggestion 2"]
      }
  
      Provide ONLY the raw JSON object in your response, without any markdown formatting like \`\`\`json.
    `;
    const schema = {
      type: Type.OBJECT,
      properties: {
        shop_name: { type: Type.STRING },
        niche: { type: Type.STRING },
        estimated_monthly_sales: { type: Type.STRING },
        top_keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        areas_for_improvement: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["shop_name", "niche", "estimated_monthly_sales", "top_keywords", "strengths", "areas_for_improvement"],
    };
    return generateJson<ShopAnalysis>(prompt, schema);
};

export const analyzeProduct = async (productDescription: string): Promise<ProductAnalysis | null> => {
    const prompt = `
      You are an expert Etsy listing optimizer and data analyst. You cannot access live Etsy data.
      Analyze the following Etsy product concept: "${productDescription}".
      Even if a URL is provided, you cannot access it; generate a realistic, hypothetical analysis based on the product concept derived from the text.
  
      Provide a detailed, comprehensive, and realistic hypothetical analysis in JSON format for a successful listing of this type. The JSON object must have the exact structure below:
      {
        "product_concept": "${productDescription}",
        "title_suggestion": "A highly optimized title suggestion.",
        "description_feedback": "Actionable feedback on how to improve the product description.",
        "pricing_suggestion": "$25-$35",
        "monthly_sales": "30-50",
        "monthly_revenue": "$900 - $1,500",
        "total_sales": 320,
        "listing_age": "7 months",
        "reviews": 65,
        "views": 2500,
        "favorites": 210,
        "monthly_reviews": "5-8",
        "conversion_rate": "2.1%",
        "category": "Home & Living > Home Decor",
        "visibility_score": "92/100",
        "review_ratio": "20%",
        "tags_analysis": [
          {"tag": "custom star map", "volume": "High", "competition": "Medium", "score": 85},
          {"tag": "night sky print", "volume": "High", "competition": "High", "score": 75},
          {"tag": "anniversary gift", "volume": "High", "competition": "High", "score": 72},
          {"tag": "personalized gift", "volume": "High", "competition": "High", "score": 70},
          {"tag": "constellation map", "volume": "Medium", "competition": "Medium", "score": 68},
          {"tag": "gift for him", "volume": "High", "competition": "High", "score": 65}
        ],
        "listing_details": {
          "when_made": "Made to order",
          "listing_type": "Physical",
          "customizable": true,
          "craft_supply": false,
          "personalized": true,
          "auto_renew": true,
          "has_variations": true,
          "title_character_count": 135,
          "tags_count": 13,
          "who_made": "I did"
        },
        "historical_data": {
            "sales": [{"month": "Jan", "value": 20}, {"month": "Feb", "value": 22}, {"month": "Mar", "value": 25}, {"month": "Apr", "value": 30}, {"month": "May", "value": 28}, {"month": "Jun", "value": 35}, {"month": "Jul", "value": 32}, {"month": "Aug", "value": 38}, {"month": "Sep", "value": 40}, {"month": "Oct", "value": 45}, {"month": "Nov", "value": 55}, {"month": "Dec", "value": 60}],
            "views": [{"month": "Jan", "value": 1500}, {"month": "Feb", "value": 1600}, {"month": "Mar", "value": 1700}, {"month": "Apr", "value": 1800}, {"month": "May", "value": 1900}, {"month": "Jun", "value": 2100}, {"month": "Jul", "value": 2000}, {"month": "Aug", "value": 2200}, {"month": "Sep", "value": 2400}, {"month": "Oct", "value": 2800}, {"month": "Nov", "value": 3200}, {"month": "Dec", "value": 3500}],
            "favorites": [{"month": "Jan", "value": 15}, {"month": "Feb", "value": 18}, {"month": "Mar", "value": 20}, {"month": "Apr", "value": 25}, {"month": "May", "value": 30}, {"month": "Jun", "value": 35}, {"month": "Jul", "value": 32}, {"month": "Aug", "value": 40}, {"month": "Sep", "value": 45}, {"month": "Oct", "value": 50}, {"month": "Nov", "value": 60}, {"month": "Dec", "value": 70}]
        },
        "visibility_analysis": "This listing likely ranks well for its primary keywords due to strong SEO. It probably appears on the first two pages of search results for 'custom star map' and benefits from being featured in gift guides."
      }
  
      Ensure the performance metrics and historical data are realistic for a well-performing Etsy listing in a moderately competitive niche.
      Provide ONLY the raw JSON object in your response, without any markdown formatting.
    `;
    
    const historicalDataSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          month: { type: Type.STRING },
          value: { type: Type.NUMBER },
        },
        required: ["month", "value"],
      },
    };

    const schema = {
        type: Type.OBJECT,
        properties: {
            product_concept: { type: Type.STRING },
            title_suggestion: { type: Type.STRING },
            description_feedback: { type: Type.STRING },
            pricing_suggestion: { type: Type.STRING },
            monthly_sales: { type: Type.STRING },
            monthly_revenue: { type: Type.STRING },
            total_sales: { type: Type.NUMBER },
            listing_age: { type: Type.STRING },
            reviews: { type: Type.NUMBER },
            views: { type: Type.NUMBER },
            favorites: { type: Type.NUMBER },
            monthly_reviews: { type: Type.STRING },
            conversion_rate: { type: Type.STRING },
            category: { type: Type.STRING },
            visibility_score: { type: Type.STRING },
            review_ratio: { type: Type.STRING },
            tags_analysis: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        tag: { type: Type.STRING },
                        volume: { type: Type.STRING },
                        competition: { type: Type.STRING },
                        score: { type: Type.NUMBER },
                    },
                    required: ["tag", "volume", "competition", "score"],
                },
            },
            listing_details: {
                type: Type.OBJECT,
                properties: {
                    when_made: { type: Type.STRING },
                    listing_type: { type: Type.STRING },
                    customizable: { type: Type.BOOLEAN },
                    craft_supply: { type: Type.BOOLEAN },
                    personalized: { type: Type.BOOLEAN },
                    auto_renew: { type: Type.BOOLEAN },
                    has_variations: { type: Type.BOOLEAN },
                    title_character_count: { type: Type.NUMBER },
                    tags_count: { type: Type.NUMBER },
                    who_made: { type: Type.STRING },
                },
                required: ["when_made", "listing_type", "customizable", "craft_supply", "personalized", "auto_renew", "has_variations", "title_character_count", "tags_count", "who_made"],
            },
            historical_data: {
                type: Type.OBJECT,
                properties: {
                    sales: historicalDataSchema,
                    views: historicalDataSchema,
                    favorites: historicalDataSchema,
                },
                required: ["sales", "views", "favorites"],
            },
            visibility_analysis: { type: Type.STRING },
        },
        required: [
            "product_concept", "title_suggestion", "description_feedback", "pricing_suggestion",
            "monthly_sales", "monthly_revenue", "total_sales", "listing_age", "reviews",
            "views", "favorites", "monthly_reviews", "conversion_rate", "category",
            "visibility_score", "review_ratio", "tags_analysis", "listing_details",
            "historical_data", "visibility_analysis"
        ],
    };
    return generateJson<ProductAnalysis>(prompt, schema);
};

export const analyzeRank = async (keyword: string, productDescription: string): Promise<RankAnalysis | null> => {
    const prompt = `
      You are an expert Etsy SEO and search ranking analyst. You cannot access live Etsy data.
      Analyze the hypothetical ranking potential for an Etsy product based on its description and a target keyword.

      Product Description: "${productDescription}"
      Target Keyword: "${keyword}"

      Provide a detailed, realistic, and hypothetical analysis in JSON format. The JSON object must have the exact structure below. Assume the product has good photos, a complete shop profile, and positive reviews.
      {
        "estimated_rank": "e.g., Page 1, Top 10 OR Page 3, spots 20-30",
        "rank_explanation": "A detailed explanation for the estimated rank, considering keyword relevance, competition, and potential listing quality based on the description.",
        "improvement_suggestions": [
          "Actionable suggestion 1 to improve rank.",
          "Actionable suggestion 2.",
          "Actionable suggestion 3."
        ]
      }
  
      Provide ONLY the raw JSON object in your response, without any markdown formatting.
    `;
    
    const schema = {
        type: Type.OBJECT,
        properties: {
            estimated_rank: { type: Type.STRING },
            rank_explanation: { type: Type.STRING },
            improvement_suggestions: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
            },
        },
        required: ["estimated_rank", "rank_explanation", "improvement_suggestions"],
    };
    return generateJson<RankAnalysis>(prompt, schema);
};