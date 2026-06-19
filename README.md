# Heifer

> *Keeps the peace. *

Heifer is a Discord bot built to keep your server in order by moderating sinners, welcoming the faithful, and fact-checking the dumb. Powered by Node.js, discord.js, and Google Gemini (subject to change).

---

##  What Heifer Does

Heifer is a full-featured moderation and AI-assisted bot. It punishes those who deserve it... or those who don't, I mean who cares right? You don't have to explain yourself and heifer wont ask questions.

---

## Commands (More coming soon)

| Command | Description |
|---|---|
| `/kick @user [reason]` | Banishes a member from the server. Temporarily. |
| `/ban @user [reason]` | Executes a member. Permanently. |
| `/warn @user [message_id] [reason]` | Issues a formal warning. References the crime scene if provided. |
| `/mute @user <duration> <reason>` | Silences a sinner for a given duration (`10s`, `5m`, `1h`, `2d`, up to `28d`). |
| `/unmute @user [reason]` | Forgives a sinner and restores their voice. |

---

## AI Features

Heifer is powered by Google Gemini and can fact-check claims or analyze statements on demand through the chat itself, not through commands making it more interactive for chatters.

| Trigger | How to use | What Heifer does |
|---|---|---|
| `is this true` | Reply to any message with this phrase | Fact checks the message with a verdict, explanation and sources |
| `heifer, thoughts?` | Reply to any message with this phrase | Gives an objective analysis of the message with sources |
| mention or reply | reply to any message, or @ him with a new one | gives a simpler more concise answer- good for simpler explanations |

Verdicts are color coded:
- ✅ **True** — proven with evidence
- ❌ **False** — disproven with evidence  
- ⚠️ **Partially True** — some elements proven, others not
- ❓ **Unverified** — no evidence either way

---

## Automatic Features

- **Welcome message** — pings new members when they join
- **Goodbye message** — bids farewell to departing members
- **Auto-moderation** — detects and deletes banned words, auto-warns the offender
- **Message logs** — logs deleted and edited messages to a dedicated channel
- **Join/leave logs** — logs members joining and leaving with account info

---

*heifer might be sentient, we're not sure but we are actively looking into it. thanks ^_^
