const { InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { aiClient } = require('../config/ai-client');

const MODEL_ID = process.env.CLOUD_MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0';

async function parseNaturalLanguageTask(userInput) {
  const today = new Date().toISOString().split('T')[0];
  const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const sys = 'You are a task extraction assistant. Today is ' + day + ', ' + today + '. ' +
    'Extract task info from user input. Return ONLY valid JSON. ' +
    'title: concise task title. description: brief. ' +
    'priority: urgent/critical=HIGH, important=HIGH, whenever/low=LOW, default=MEDIUM. ' +
    'dueDate: YYYY-MM-DD or null. status: always TODO.';

  const body = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 500, temperature: 0.1,
    system: sys,
    messages: [{ role: 'user', content: userInput }],
  };

  const cmd = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: 'application/json', accept: 'application/json',
    body: JSON.stringify(body),
  });

  const resp = await aiClient.send(cmd);
  const text = new TextDecoder().decode(resp.body);
  const json = JSON.parse(text);
  const content = json.content[0].text;
  const parsed = extractJSON(content);

  if (!parsed.title || !parsed.title.trim()) throw new Error('No valid title from AI');
  if (!['LOW','MEDIUM','HIGH'].includes(parsed.priority)) parsed.priority = 'MEDIUM';
  if (!['TODO','IN_PROGRESS','DONE'].includes(parsed.status)) parsed.status = 'TODO';
  if (parsed.dueDate && parsed.dueDate !== 'null') {
    if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(parsed.dueDate)) parsed.dueDate = null;
  } else { parsed.dueDate = null; }
  return parsed;
}

function extractJSON(text) {
  try { return JSON.parse(text); } catch(e) {}
  var m = text.match(/(?:json)?\\s*([\\s\\S]*?)/);
  if (m) { try { return JSON.parse(m[1].trim()); } catch(e) {} }
  var f = text.indexOf('{'), l = text.lastIndexOf('}');
  if (f !== -1 && l > f) { try { return JSON.parse(text.substring(f, l+1)); } catch(e) {} }
  throw new Error('Cannot extract JSON from AI');
}

module.exports = { parseNaturalLanguageTask };
