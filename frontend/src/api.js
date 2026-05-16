const BASE = ''  // Vite proxy routes /hints, /solution, /run, /leetcode to localhost:8000

export async function getHints(question, userCode) {
  const res = await fetch(`${BASE}/hints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, user_code: userCode }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'Failed to get hints')
  }
  return res.json()
}

export async function getSolution(question) {
  const res = await fetch(`${BASE}/solution`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'Failed to get solution')
  }
  return res.json()
}

export async function runCode(language, sourceCode) {
  const res = await fetch(`${BASE}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language, code: sourceCode }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? `Execution error: ${res.statusText}`)
  }
  const data = await res.json()
  return {
    stdout: data.stdout ?? '',
    stderr: data.stderr ?? '',
    exitCode: data.exit_code ?? 0,
  }
}

export async function getLeetCodeProblems(tag = 'array', skip = 0, limit = 50) {
  const params = new URLSearchParams({ tag, skip, limit })
  const res = await fetch(`${BASE}/leetcode/problems?${params}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'Failed to fetch problems')
  }
  return res.json() // { totalNum, data: [{ questionId, title, titleSlug, difficulty }] }
}

export async function getLeetCodeProblem(titleSlug) {
  const res = await fetch(`${BASE}/leetcode/problem/${encodeURIComponent(titleSlug)}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'Failed to fetch problem')
  }
  return res.json() // { title, difficulty, content, exampleTestcases }
}


