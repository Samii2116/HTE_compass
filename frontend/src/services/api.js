const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);
    if (!response.ok) return { status: "unhealthy" };
    return await response.json();
  } catch (error) {
    return { status: "offline", error: error.message };
  }
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Upload failed (${response.status})`);
  }

  return await response.json();
}

export async function getDocuments() {
  const response = await fetch(`${API_URL}/documents`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to fetch documents (${response.status})`);
  }
  return await response.json();
}

export async function getStats() {
  const response = await fetch(`${API_URL}/stats`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to fetch stats (${response.status})`);
  }
  return await response.json();
}

export async function triggerRepositoryIndex() {
  const response = await fetch(`${API_URL}/repository/index`, {
    method: "POST",
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Repository index failed (${response.status})`);
  }
  return await response.json();
}

export async function askQuestion(question, language) {
  const selectedLanguage = language || localStorage.getItem('hte_language') || 'English';

  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      language: selectedLanguage,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Chat request failed (${response.status})`);
  }

  return await response.json();
}