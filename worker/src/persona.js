/**
 * System prompt for the portfolio assistant.
 *
 * The resume is small enough (about 1.5k tokens) to sit in the prompt verbatim,
 * so there is no retrieval step, no embeddings and no vector store.
 *
 * There is one prompt per language rather than one bilingual prompt. Handing the
 * model a Korean resume and telling it to answer in English made it translate
 * proper nouns on the fly and blurred the "never translate for the visitor"
 * refusal into "never use English". Two clean prompts avoid both problems, and
 * each still carries the rule to follow the language the question was asked in —
 * so a Korean question on the English site is still answered in Korean.
 */

import { PROFILE as PROFILE_KO, RULES as RULES_KO } from './persona-ko.js';
import { PROFILE as PROFILE_EN, RULES as RULES_EN } from './persona-en.js';

const PROMPTS = {
  ko: `${PROFILE_KO}\n\n---\n\n${RULES_KO}`,
  en: `${PROFILE_EN}\n\n---\n\n${RULES_EN}`,
};

/**
 * @param {string} [lang] 'ko' or 'en'; anything else falls back to Korean, which
 *   is the language of the site's markup and of most visitors.
 */
export function systemPrompt(lang) {
  return PROMPTS[lang] || PROMPTS.ko;
}
