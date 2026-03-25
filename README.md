# ✦ Luxo Chat

A premium, minimalist, and highly customizable personal AI assistant powered by OpenAI and Next.js. 

Luxo Chat is designed to give you a ChatGPT-like experience using your own API Key (BYOK), without paying for monthly subscriptions. It focuses on privacy, speed, and a sleek user interface.

![Luxo Chat Showcase](https://via.placeholder.com/1200x600/09090b/fafafa?text=Luxo+Chat+-+Minimalist+AI+Assistant) *(You can replace this link with a real screenshot of your app later)*

## ✨ Features

- **Bring Your Own Key (BYOK):** Securely use your own OpenAI API key. The key is stored safely on the server side (`.env.local`) and is **never** exposed to the browser.
- **Bilingual & RTL Support:** Fully supports English (LTR) and Persian/Farsi (RTL) with automatic layout shifting and optimized fonts (Inter & Noto Sans Arabic).
- **Advanced UI/UX:** Built with Tailwind CSS and shadcn/ui for a glassmorphism, classic, and distraction-free design.
- **Dark/Light Mode:** Seamless theme switching based on user preference or system settings.
- **Persistent Memory:** Chat history and user preferences are saved locally in your browser's `localStorage`.
- **Advanced Settings Modal:** 
  - Choose between predefined models (`gpt-4o`, `gpt-4-turbo`, etc.) or manually enter custom/new models (e.g., `o1-preview`).
  - Adjust AI Temperature (Creativity).
  - Set custom System Instructions (Personas).
- **Developer Friendly:** Real-time streaming responses, Markdown rendering, and Syntax Highlighting for code blocks with a "Copy" button.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14/15](https://nextjs.org/) (App Router)
- **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) & [Lucide Icons](https://lucide.dev/)
- **Markdown & Code:** `react-markdown`, `remark-gfm`, `react-syntax-highlighter`

## 🚀 Getting Started

Follow these steps to run Luxo Chat locally on your machine.

### Prerequisites
- Node.js 18.x or higher
- An OpenAI API Key (Get it from [OpenAI Platform](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/afshintalebi/luxo-chat.git
cd luxo-chat
```

## 1. Install dependencies:
```bash
npm install
```

## 2. Set up environment variables:
Copy the example environment file:
```bash
cp .env.example .env.local
```
Open `.env.local` and add your OpenAI API Key:
```env
OPENAI_API_KEY=sk-proj-...your-key-here...
```

## 3. Run the development server:
```bash
npm run dev
```

## 4. Open the app:
Navigate to [http://localhost:3000](http://localhost:3000) in your browser to use Luxo Chat.

## 🔒 Security Note
Never commit your `.env.local` file to GitHub. This project is structured so that your API key is only accessed on the Next.js server (API Route). The client side simply sends the messages to your own server, keeping your OpenAI credentials 100% safe from end-users.

## 📄 License
This project is open-source and available under the `MIT License`.
