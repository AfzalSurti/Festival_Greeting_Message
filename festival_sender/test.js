// test.js
// Run this to test RIGHT NOW without waiting for 8am
// Command: node test.js

const twilio = require("twilio");
const contacts = require("./contacts");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ─── TWILIO CONFIG ───
const accountSid = process.env.ACCOUNT_SID; // paste from Twilio console
const authToken = process.env.AUTH_TOKEN;   // paste from Twilio console
const FROM_NUMBER = "whatsapp:+14155238886"; // Twilio sandbox number
const OPENROUTER_KEY = process.env.OPEN_ROUTER_KEY;
const AI_MODEL       = "openai/gpt-4o-mini";
// ─────────────────────────────────────

const twilioClient = twilio(accountSid, authToken);

// ─── Change this to any festival name to test ───
const TEST_FESTIVAL = "Diwali";

async function generateMessage(festivalName) {
  try {
    console.log(`🤖 Generating AI message for: ${festivalName}...\n`);

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
    console.log(`📝 Generated Message:\n─────────────────────\n${message}\n─────────────────────\n`);
    return message;

  } catch (err) {
    console.error("❌ AI failed:", err.message);
    return `✨🎉 Wishing you a very Happy ${festivalName}! 🎊\nMay this day bring joy 😊 and prosperity 💰 to you and your family.\nHave a wonderful celebration! 🎉✨`;
  }
}

async function runTest() {
  console.log("🧪 TEST MODE\n");

  const message = await generateMessage(TEST_FESTIVAL);

  console.log(`📤 Sending to ${contacts.length} contact(s)...\n`);

  for (let i = 0; i < contacts.length; i++) {
    try {
      const msg = await twilioClient.messages.create({
        from: FROM_NUMBER,
        to: `whatsapp:+${contacts[i]}`,
        body: message,
      });
      console.log(`  ✅ ${contacts[i]} → sent (SID: ${msg.sid})`);
    } catch (err) {
      console.error(`  ❌ ${contacts[i]} → failed: ${err.message}`);
    }

    if (i < contacts.length - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log("\n✅ Test complete!");
}

runTest();