/**
 * Text Analysis for AI Detection
 * Анализирует текст на признаки AI-генерации через perplexity и burstiness
 */

export interface TextAnalysisResult {
  aiProbability: number;
  verdict: 'human' | 'ai' | 'uncertain';
  confidence: number;
  signals: {
    perplexity: number;
    burstiness: number;
    avgWordLength: number;
    sentenceVariance: number;
    uniqueWordsRatio: number;
  };
  topReasons: string[];
  wordCount: number;
  sentenceCount: number;
  description: string;
}

export function analyzeText(text: string): TextAnalysisResult {
  if (!text || text.trim().length === 0) {
    return {
      aiProbability: 0,
      verdict: 'uncertain',
      confidence: 0,
      signals: {
        perplexity: 0,
        burstiness: 0,
        avgWordLength: 0,
        sentenceVariance: 0,
        uniqueWordsRatio: 0,
      },
      topReasons: ['Текст пуст или не извлечён'],
      wordCount: 0,
      sentenceCount: 0,
      description: 'Недостаточно данных для анализа',
    };
  }

  // Разбиваем на предложения
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;
  
  // Разбиваем на слова
  const words = text.toLowerCase().match(/\b[а-яёa-z]+\b/g) || [];
  const wordCount = words.length;
  
  if (wordCount < 10) {
    return {
      aiProbability: 0,
      verdict: 'uncertain',
      confidence: 0,
      signals: {
        perplexity: 0,
        burstiness: 0,
        avgWordLength: 0,
        sentenceVariance: 0,
        uniqueWordsRatio: 0,
      },
      topReasons: ['Слишком короткий текст для анализа'],
      wordCount,
      sentenceCount,
      description: 'Текст слишком короткий для надёжной детекции',
    };
  }

  // 1. Perplexity (упрощённая версия)
  // AI текст обычно имеет более низкую perplexity (более предсказуем)
  const uniqueWords = new Set(words);
  const uniqueWordsRatio = uniqueWords.size / wordCount;
  
  // Частотный анализ
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  // Perplexity: чем ниже, тем более предсказуем текст (признак AI)
  let perplexity = 0;
  words.forEach(word => {
    const prob = wordFreq[word] / wordCount;
    if (prob > 0) {
      perplexity -= Math.log2(prob);
    }
  });
  perplexity = perplexity / wordCount;
  
  // Нормализуем perplexity (типичные значения: 5-15 для человеческого, 3-8 для AI)
  const normalizedPerplexity = Math.max(0, Math.min(1, (perplexity - 3) / 10));
  
  // 2. Burstiness (вариативность длины предложений)
  // Человеческий текст имеет высокую burstiness (разная длина предложений)
  // AI текст имеет низкую burstiness (одинаковая длина)
  const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
  const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  
  let sentenceVariance = 0;
  sentenceLengths.forEach(len => {
    sentenceVariance += Math.pow(len - avgSentenceLength, 2);
  });
  sentenceVariance = sentenceVariance / sentenceLengths.length;
  
  // Нормализуем burstiness (типичные значения: 10-50 для человеческого, 2-10 для AI)
  const normalizedBurstiness = Math.max(0, Math.min(1, sentenceVariance / 30));
  
  // 3. Средняя длина слов
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / wordCount;
  
  // 4. Коэффициент уникальных слов
  // AI текст часто повторяет одни и те же слова
  
  // Расчёт AI probability
  let aiProbability = 0;
  const topReasons: string[] = [];
  
  // Низкая perplexity = признак AI
  if (normalizedPerplexity < 0.4) {
    aiProbability += 0.3;
    topReasons.push(`Низкая perplexity (${perplexity.toFixed(2)}) — текст слишком предсказуем`);
  } else if (normalizedPerplexity < 0.6) {
    aiProbability += 0.15;
    topReasons.push(`Умеренная perplexity (${perplexity.toFixed(2)})`);
  }
  
  // Низкая burstiness = признак AI
  if (normalizedBurstiness < 0.3) {
    aiProbability += 0.3;
    topReasons.push(`Низкая burstiness (${sentenceVariance.toFixed(2)}) — предложения одинаковой длины`);
  } else if (normalizedBurstiness < 0.5) {
    aiProbability += 0.15;
    topReasons.push(`Умеренная burstiness (${sentenceVariance.toFixed(2)})`);
  }
  
  // Низкий коэффициент уникальных слов
  if (uniqueWordsRatio < 0.4) {
    aiProbability += 0.2;
    topReasons.push(`Низкое разнообразие слов (${(uniqueWordsRatio * 100).toFixed(1)}%) — много повторений`);
  }
  
  // Очень равномерная длина предложений
  const lengthStdDev = Math.sqrt(sentenceVariance);
  if (lengthStdDev < 2 && sentenceCount > 3) {
    aiProbability += 0.2;
    topReasons.push(`Слишком равномерная длина предложений (σ=${lengthStdDev.toFixed(2)})`);
  }
  
  // Ограничиваем вероятность
  aiProbability = Math.min(1, Math.max(0, aiProbability));
  
  // Определяем вердикт
  let verdict: 'human' | 'ai' | 'uncertain';
  let confidence: number;
  
  if (aiProbability > 0.7) {
    verdict = 'ai';
    confidence = Math.round(aiProbability * 100);
  } else if (aiProbability < 0.3) {
    verdict = 'human';
    confidence = Math.round((1 - aiProbability) * 100);
  } else {
    verdict = 'uncertain';
    confidence = Math.round(50 + Math.abs(aiProbability - 0.5) * 100);
  }
  
  if (topReasons.length === 0) {
    topReasons.push('Текст не показывает явных признаков AI-генерации');
  }
  
  const description = verdict === 'ai'
    ? `Текст вероятно сгенерирован ИИ (уверенность ${confidence}%)`
    : verdict === 'human'
    ? `Текст вероятно написан человеком (уверенность ${confidence}%)`
    : `Невозможно однозначно определить авторство (уверенность ${confidence}%)`;

  return {
    aiProbability: Math.round(aiProbability * 100) / 100,
    verdict,
    confidence,
    signals: {
      perplexity: Math.round(perplexity * 100) / 100,
      burstiness: Math.round(sentenceVariance * 100) / 100,
      avgWordLength: Math.round(avgWordLength * 100) / 100,
      sentenceVariance: Math.round(sentenceVariance * 100) / 100,
      uniqueWordsRatio: Math.round(uniqueWordsRatio * 100) / 100,
    },
    topReasons,
    wordCount,
    sentenceCount,
    description,
  };
}
