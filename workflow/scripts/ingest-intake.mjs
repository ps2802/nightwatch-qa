import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

function slugify(value) {
  return (value || 'unknown-client')
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80) || 'unknown-client';
}

function escapeMarkdown(value) {
  if (!value) return 'n/a';
  return value
    .toString()
    .replace(/[<>]/g, '')
    .replace(/\r/g, '')
    .trim();
}

const payloadPath = process.env.INTAKE_PAYLOAD_PATH || path.resolve(repoRoot, 'workflow', 'intake.json');
const raw = fs.readFileSync(payloadPath, 'utf8');
if (!raw.trim()) {
  throw new Error('Intake payload is empty.');
}

let payload;
try {
  payload = JSON.parse(raw);
} catch (error) {
  throw new Error(`Unable to parse intake payload: ${error.message}`);
}

const clientName = payload.company || payload.product || payload.client || 'Unknown Client';
const flowType = payload.flow || payload.flow_type || payload.flowType || 'Unspecified flow';
const metric = payload.metric || payload.goal || payload.primary_metric || 'n/a';
const paymentStatus = payload.payment || payload.payment_status || 'Pending';
const deadline = payload.deadline || payload.promised_at || '08:00 tomorrow';
const contact = payload.contact || payload.contact_name || payload.owner || 'Unknown contact';
const contactEmail = payload.contact_email || payload.email || 'n/a';
const notes = payload.notes || payload.hypotheses || 'n/a';

const slug = slugify(clientName);
const dateStamp = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'UTC',
}).format(new Date()).replace(/-/g, '');

const dropDir = path.join(repoRoot, 'workflow', 'intake-drops', dateStamp);
fs.mkdirSync(dropDir, { recursive: true });

const dropPath = path.join(dropDir, `${slug}.json`);
fs.writeFileSync(dropPath, JSON.stringify(payload, null, 2));

const bodyPath = path.join(dropDir, `${slug}.md`);
const issueBody = `### Client\n- **Product:** ${escapeMarkdown(clientName)}\n- **Flow:** ${escapeMarkdown(flowType)}\n- **Metric:** ${escapeMarkdown(metric)}\n- **Payment:** ${escapeMarkdown(paymentStatus)}\n- **Deadline:** ${escapeMarkdown(deadline)}\n- **Contact:** ${escapeMarkdown(contact)} (${escapeMarkdown(contactEmail)})\n\n### Access\n${escapeMarkdown(payload.access || payload.links || 'None provided')}\n\n### Notes / Hypotheses\n${escapeMarkdown(notes)}\n`;
fs.writeFileSync(bodyPath, issueBody);

const outputs = [
  `issue_title=[Intake] ${escapeMarkdown(clientName)} – ${escapeMarkdown(flowType)}`,
  `issue_body_path=${bodyPath}`,
  `payload_path=${dropPath}`,
];

const outputFile = process.env.GITHUB_OUTPUT;
if (!outputFile) {
  console.log(outputs.join('\n'));
} else {
  fs.appendFileSync(outputFile, outputs.join('\n') + '\n');
}

console.log(`Stored intake payload at ${dropPath}`);
console.log(`Issue body prepared at ${bodyPath}`);
