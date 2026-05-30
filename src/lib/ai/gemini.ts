const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-2.5-flash'

export async function generateText(prompt: string, system?: string): Promise<string> {
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    ...(system && { system_instruction: { parts: [{ text: system }] } }),
    generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
  }
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  )
  if (!res.ok) throw new Error(`Gemini API hatası: ${res.status}`)
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  return text
}

export async function generateJSON<T>(prompt: string, system?: string): Promise<T> {
  const text = await generateText(prompt, system)
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) ?? text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/)
  const raw = jsonMatch ? jsonMatch[1] ?? jsonMatch[0] : text
  return JSON.parse(raw.trim()) as T
}
