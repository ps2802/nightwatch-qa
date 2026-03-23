#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { GoogleGenerativeAI } from '@google/generative-ai';

function printUsage() {
  console.error(`Usage: node scripts/generate-gemini-findings.mjs --image <png> --json <out.json> [--metadata <metadata.json>] [--markdown <out.md>] [--flow <flow-name>]`);
}

function parseArgs(argv) {
  const args = {
    image: undefined,
    metadata: undefined,
    json: undefined,
    markdown: undefined,
    flow: undefined,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith('--')) {
      continue;
    }
    const value = argv[index + 1];
    switch (key) {
      case '--image':
        args.image = value;
        index += 1;
        break;
      case '--metadata':
        args.metadata = value;
        index += 1;
        break;
      case '--json':
        args.json = value;
        index += 1;
        break;
      case '--markdown':
        args.markdown = value;
        index += 1;
        break;
      case '--flow':
        args.flow = value;
        index += 1;
        break;
      default:
        break;
    }
  }
  return args;
}

function normalizeJsonText(rawText) {
  if (!rawText) {
    return undefined;
  }
  const trimmed = rawText.trim();
  if (trimmed.startsWith('```')) {
    const parts = trimmed.split('```');
    if (parts.length >= 3) {
      return parts[1].trim().replace(/^json\s+/i, '');
    }
    return parts[parts.length - 1].trim();
  }
  return trimmed;
}

function safeJsonParse(text) {
  if (!text) {
    return undefined;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    return undefined;
  }
}

function fallbackFindings(rawText, flow) {
  return {
    flow: flow || 'unknown',
    summary: 'Gemini response could not be parsed as JSON. See raw field for details.',
    findings: rawText
      ? [
          {
            title: 'Unparsed Gemini output',
            issue: rawText,
            impact: 'Unable to structure Gemini reasoning without valid JSON response.',
            evidence: '',
          },
        ]
      : [],
  };
}

function findingsToMarkdown(payload) {
  const lines = [];
  const flowLabel = payload.flow ? `— ${payload.flow}` : '';
  lines.push(`# Gemini Findings ${flowLabel}`.trim());
  lines.push('');
  lines.push(`- Model: ${payload.model}`);
  lines.push(`- Generated: ${payload.generatedAt}`);
  if (payload.metadata?.url) {
    lines.push(`- Source URL: ${payload.metadata.url}`);
  }
  lines.push(`- Prompt version: ${payload.promptVersion}`);
  lines.push('');
  lines.push('## Summary');
  lines.push(payload.findings.summary || 'No summary provided.');
  lines.push('');
  if (Array.isArray(payload.findings.findings) && payload.findings.findings.length > 0) {
    lines.push('## Detailed Findings');
    payload.findings.findings.forEach((finding, index) => {
      lines.push(`### ${index + 1}. ${finding.title || 'Untitled finding'}`);
      if (finding.issue) {
        lines.push(`- **Issue:** ${finding.issue}`);
      }
      if (finding.impact) {
        lines.push(`- **Impact:** ${finding.impact}`);
      }
      if (finding.evidence) {
        lines.push(`- **Evidence:** ${finding.evidence}`);
      }
      lines.push('');
    });
  } else {
    lines.push('## Detailed Findings');
    lines.push('No structured findings returned.');
    lines.push('');
  }
  return lines.join('\n');
}

async function main() {
  const argv = parseArgs(process.argv.slice(2));
  if (!argv.image || !argv.json) {
    printUsage();
    process.exit(1);
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY or GOOGLE_API_KEY environment variable.');
    process.exit(1);
  }

  const screenshot = await readFile(argv.image);
  const metadata = argv.metadata ? JSON.parse(await readFile(argv.metadata, 'utf8')) : undefined;

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelId =
    process.env.NIGHTWATCH_GEMINI_MODEL ||
    process.env.GEMINI_MODEL ||
    'gemini-1.5-flash';
  const model = genAI.getGenerativeModel({ model: modelId });

  const contextChunks = [];
  if (metadata?.url) {
    contextChunks.push(`Page URL: ${metadata.url}`);
  }
  if (metadata?.title) {
    contextChunks.push(`Page title: ${metadata.title}`);
  }

  const flowName = argv.flow || 'unknown';
  const promptText = [
    `You are assisting a QA engineer who needs concise UX findings from a screenshot of the "${flowName}" flow.`,
    'Return JSON with this exact shape:',
    '{',
    `  "flow": "${flowName}",`,
    '  "summary": "<one paragraph>",',
    '  "findings": [',
    '    {',
    '      "title": "<short name>",',
    '      "issue": "<what is wrong>",',
    '      "impact": "<why it matters>",',
    '      "evidence": "<one sentence quoting or describing what you see>"',
    '    }',
    '  ]',
    '}',
    'Focus on UX or trust gaps that are visible in the screenshot. Avoid speculating about backend systems.',
  ];
  if (contextChunks.length > 0) {
    promptText.push('Additional context:');
    promptText.push(...contextChunks);
  }

  const contents = [
    {
      text: promptText.join('\n'),
    },
    {
      inlineData: {
        data: screenshot.toString('base64'),
        mimeType: 'image/png',
      },
    },
  ];

  const response = await model.generateContent(contents);
  const text = response?.response?.text?.();
  const parsed = safeJsonParse(normalizeJsonText(text));
  const findings = parsed ?? fallbackFindings(text, flowName);

  const payload = {
    generatedAt: new Date().toISOString(),
    model: modelId,
    flow: flowName,
    promptVersion: `${flowName}-v1`,
    metadata: metadata ?? null,
    findings,
    raw: text,
  };

  await writeFile(argv.json, JSON.stringify(payload, null, 2));
  if (argv.markdown) {
    await writeFile(argv.markdown, `${findingsToMarkdown(payload)}\n`, 'utf8');
  }
}

main().catch((error) => {
  console.error('Gemini findings generation failed:', error?.message || error);
  process.exit(1);
});
