// scheduler.js
// Runs every day at 8:00 AM IST
// Checks festival → generates AI message via OpenRouter → sends to all contacts

const cron = require("node-cron");
const twilio = require("twilio");
const festivals = require("./festivals");
const contacts = require("./contacts");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ─── TWILIO CONFIG ───
const accountSid = process.env.ACCOUNT_SID; // paste from Twilio console
const authToken = process.env.AUTH_TOKEN;   // paste from Twilio console
const FROM_NUMBER = "whatsapp:+14155238886"; // Twilio sandbox number
// ─── CONFIG ─────────────────────────────────────────────


const OPENROUTER_KEY = process.env.OPEN_ROUTER_KEY; // openrouter.ai → Keys
const AI_MODEL       = "openai/gpt-4o-mini"; 
// ────────────────────────────────────────────────────────

const twilioClient = twilio(accountSid, authToken);

function addGoMindzSignature(message) {
  return `${message.trim()}\n\n— GoMindz`;
}

// ─── Get today in MM-DD format ───
function getTodayDate() {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${mm}-${dd}`;
}

// ─── Filter today's festivals ───
function getTodayFestivals() {
  const today = getTodayDate();
  return festivals.filter((f) => f.date === today);
}

// ─── Generate AI message via OpenRouter ───
async function generateMessage(festivalName) {
  try {
    console.log(`🤖 Generating message for: ${festivalName}`);

    const prompt = `You are writing a WhatsApp festival greeting message for a business to send to their customers in India.

Festival: "${festivalName}"

Write a warm, heartfelt WhatsApp greeting message. Follow this exact structure:
- Line 1: Festival name with 2-3 highly relevant emojis (e.g. 🪔✨ for Diwali, 🌙⭐ for Eid)
- Line 2-4: 3 warm wish sentences, each with 1-2 inline emojis that match the festival theme
- Last line: A short warm closing with emojis

Rules:
- Total length: 5-6 lines only
- Emojis must be relevant to THIS specific festival, not generic
- Tone: warm, genuine, festive — not corporate
- Do NOT write "Dear Customer", signature, or business name
- Output ONLY the message, nothing else`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://festival-sender.app",
        "X-Title": "Festival WhatsApp Sender",
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 250,
        temperature: 0.85,
      }),
    });

    const data = await res.json();

    if (data.error) throw new Error(data.error.message);

    const message = data.choices[0].message.content.trim();
    const finalMessage = addGoMindzSignature(message);
    console.log(`\n📝 Generated Message:\n─────────────────────\n${finalMessage}\n─────────────────────\n`);
    return finalMessage;

  } catch (err) {
    console.error("❌ AI generation failed:", err.message);
    console.log("⚠️  Using fallback static message.");
    // Fallback if OpenRouter fails
    return addGoMindzSignature(`✨🎉 Wishing you a very Happy ${festivalName}! 🎊✨\nMay this special day bring joy 😊, prosperity 💰, and happiness 🌟 to you and your family.\nMay every moment of this celebration be filled with love ❤️ and positivity.\nHave a safe and wonderful celebration! 🎉`);
  }
}

// ─── Send to one number ───
async function sendOne(number, message) {
  try {
    const msg = await twilioClient.messages.create({
      from: FROM_NUMBER,
      to: `whatsapp:+${number}`,
      body: message,
    });
    console.log(`  ✅ ${number} → sent (SID: ${msg.sid})`);
  } catch (err) {
    console.error(`  ❌ ${number} → failed: ${err.message}`);
  }
}

// ─── Send to all contacts with 2s gap ───
async function sendToAll(message) {
  console.log(`📤 Sending to ${contacts.length} contacts...\n`);
  for (let i = 0; i < contacts.length; i++) {
    await sendOne(contacts[i], message);
    if (i < contacts.length - 1) {
      await new Promise((r) => setTimeout(r, 2000)); // 2 sec gap
    }
  }
}

// ─── MAIN CRON: Every day at 8:00 AM ───
cron.schedule("0 8 * * *", async () => {
  console.log(`\n⏰ [${new Date().toLocaleString("en-IN")}] Running daily festival check...`);

  const todayFestivals = getTodayFestivals();

  if (todayFestivals.length === 0) {
    console.log("📅 No festival today. Nothing to send.\n");
    return;
  }

  console.log(`🎊 Today's festival(s): ${todayFestivals.map((f) => f.name).join(", ")}\n`);

  for (const festival of todayFestivals) {
    const message = await generateMessage(festival.name);
    await sendToAll(message);
    console.log(`✅ Completed: ${festival.name}\n`);
  }

  console.log("🎉 All done for today!");

}, {
  timezone: "Asia/Kolkata" // IST timezone
});

console.log("🚀 Festival Scheduler started.");
console.log("📅 Runs every day at 8:00 AM IST.");
console.log("💡 Run 'node test.js' to send a test message right now.\n");