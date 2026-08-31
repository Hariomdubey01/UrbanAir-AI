import { KNOWLEDGE_BASE } from './knowledge-base';
import { KnowledgeDocument } from '../types';

export function retrieveKnowledgeDocs(query: string, maxResults: number = 3): KnowledgeDocument[] {
  if (!query) return KNOWLEDGE_BASE.slice(0, maxResults);

  const normalizedQuery = query.toLowerCase();
  const keywords = normalizedQuery.split(/\s+/).filter(w => w.length > 2);

  const scoredDocs = KNOWLEDGE_BASE.map(doc => {
    let score = 0;
    const docTitle = doc.title.toLowerCase();
    const docTopic = doc.topic.toLowerCase();
    const docContent = doc.content.toLowerCase();
    const docSnippet = doc.snippet.toLowerCase();

    for (const kw of keywords) {
      if (docTitle.includes(kw)) score += 5;
      if (docTopic.includes(kw)) score += 4;
      if (docSnippet.includes(kw)) score += 3;
      if (docContent.includes(kw)) score += 1;
    }

    // Direct topic bonus
    if (normalizedQuery.includes('pm2.5') || normalizedQuery.includes('pm25')) {
      if (doc.id === 'who-aqg-2021' || doc.id === 'epa-aqi-scale') score += 10;
    }
    if (normalizedQuery.includes('sdg') || normalizedQuery.includes('sustainable') || normalizedQuery.includes('city') || normalizedQuery.includes('community')) {
      if (doc.id === 'sdg11-target-116' || doc.id === 'c40-community-air-action') score += 10;
    }
    if (normalizedQuery.includes('aqi') || normalizedQuery.includes('scale') || normalizedQuery.includes('meaning')) {
      if (doc.id === 'epa-aqi-scale') score += 10;
    }

    return { doc, score };
  });

  scoredDocs.sort((a, b) => b.score - a.score);

  // Filter top scoring or fallback to general default
  const top = scoredDocs.filter(d => d.score > 0).map(d => d.doc);
  if (top.length === 0) {
    return KNOWLEDGE_BASE.slice(0, maxResults);
  }

  return top.slice(0, maxResults);
}
