import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type PropertyItem = {
  id: string;
  title: string | null;
  image: string | null;
  video_url: string | null;
  property_type: string | null;
  operation_type: string | null;
  city: string | null;
  description: string | null;
  price: number | string | null;
  currency: string | null;
  status: string | null;
  created_at: string | null;
  owner_id: string | null;
};

type AiFilters = {
  city?: string | null;
  property_type?: string | null;
  operation_type?: string | null;
  max_price?: number | string | null;
  min_price?: number | string | null;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await req.json().catch(() => ({}));
    const message = String(body?.message || "").trim();

    if (!message) {
      return jsonResponse({ error: "الرسالة مطلوبة" }, 400);
    }

    const openAiApiKey = Deno.env.get("OPENAI_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!openAiApiKey) {
      return jsonResponse({ error: "OPENAI_API_KEY is missing" }, 500);
    }

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return jsonResponse(
        { error: "Supabase Edge Function environment variables are missing" },
        500
      );
    }

    const filters = await extractFiltersWithOpenAi(message, openAiApiKey);
    const properties = await getAvailableProperties(
      supabaseUrl,
      supabaseServiceRoleKey,
      filters
    );

    const results = rankProperties(properties, message, filters).slice(0, 5);
    const reply = buildArabicReply(results, filters);

    return jsonResponse({
      reply,
      filters,
      results,
    });
  } catch (error) {
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

async function extractFiltersWithOpenAi(
  message: string,
  openAiApiKey: string
): Promise<AiFilters> {
  const aiRes = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `
أنت محلل طلبات عقارية لمنصة عقاري.
استخرج فلاتر البحث من رسالة المستخدم وأرجع JSON فقط بدون شرح.
القيم المتوقعة:
city: اسم المدينة أو null
property_type: شقة أو بيت أو فيلا أو أرض أو محل أو مصيف أو null
operation_type: بيع أو إيجار أو null
max_price: رقم فقط أو null
min_price: رقم فقط أو null
لا تخترع قيماً غير موجودة في الرسالة.
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.1,
    }),
  });

  const aiData = await aiRes.json().catch(() => ({}));

  if (!aiRes.ok) {
    throw new Error(aiData?.error?.message || "OpenAI request failed");
  }

  const rawText = String(aiData?.output_text || "{}").trim();
  const jsonText = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(jsonText) as AiFilters;
  } catch {
    return {};
  }
}

async function getAvailableProperties(
  supabaseUrl: string,
  supabaseServiceRoleKey: string,
  filters: AiFilters
): Promise<PropertyItem[]> {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  let query = supabase
    .from("properties")
    .select(
      "id,title,image,video_url,property_type,operation_type,city,description,price,currency,status,created_at,owner_id"
    )
    .eq("status", "متاح")
    .order("created_at", { ascending: false })
    .limit(80);

  if (filters.city) {
    query = query.ilike("city", `%${String(filters.city).trim()}%`);
  }

  if (filters.property_type) {
    query = query.ilike(
      "property_type",
      `%${String(filters.property_type).trim()}%`
    );
  }

  if (filters.operation_type) {
    query = query.ilike(
      "operation_type",
      `%${String(filters.operation_type).trim()}%`
    );
  }

  const maxPrice = Number(filters.max_price || 0);
  if (Number.isFinite(maxPrice) && maxPrice > 0) {
    query = query.lte("price", maxPrice);
  }

  const minPrice = Number(filters.min_price || 0);
  if (Number.isFinite(minPrice) && minPrice > 0) {
    query = query.gte("price", minPrice);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message || "Failed to load properties");
  }

  return (data || []) as PropertyItem[];
}

function rankProperties(
  properties: PropertyItem[],
  message: string,
  filters: AiFilters
): PropertyItem[] {
  const searchText = normalize(message);

  return [...properties].sort((a, b) => {
    const scoreA = getPropertyScore(a, searchText, filters);
    const scoreB = getPropertyScore(b, searchText, filters);

    if (scoreA !== scoreB) return scoreB - scoreA;

    return (
      new Date(b.created_at || 0).getTime() -
      new Date(a.created_at || 0).getTime()
    );
  });
}

function getPropertyScore(
  item: PropertyItem,
  searchText: string,
  filters: AiFilters
): number {
  let score = 0;

  if (filters.city && normalize(item.city).includes(normalize(filters.city))) {
    score += 5;
  }

  if (
    filters.property_type &&
    normalize(item.property_type).includes(normalize(filters.property_type))
  ) {
    score += 4;
  }

  if (
    filters.operation_type &&
    normalize(item.operation_type).includes(normalize(filters.operation_type))
  ) {
    score += 4;
  }

  const combined = normalize(
    `${item.title || ""} ${item.city || ""} ${item.property_type || ""} ${
      item.operation_type || ""
    } ${item.description || ""}`
  );

  for (const token of searchText.split(/\s+/).filter((word) => word.length > 2)) {
    if (combined.includes(token)) score += 1;
  }

  return score;
}

function buildArabicReply(results: PropertyItem[], filters: AiFilters): string {
  if (!results.length) {
    return "ما لقيت عقارات متاحة مطابقة بدقة لطلبك حاليًا. جرّب توسّع البحث أو اترك بياناتك وسيتواصل معك فريق عقاري.";
  }

  const cityText = filters.city ? ` في ${filters.city}` : "";
  const typeText = filters.property_type ? ` من نوع ${filters.property_type}` : "";
  const operationText = filters.operation_type ? ` للـ${filters.operation_type}` : "";

  return `لقيت لك ${results.length} عقارات متاحة${cityText}${typeText}${operationText}. هاي أفضل النتائج حسب طلبك 👇`;
}

function normalize(value: unknown): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
