import { useState } from 'react';
import './App.css';

const systemMessage = `
You are FarmerAI, a helpful assistant for Indian farmers.

Your job is to reply in the same language the user speaks. You support these Indian languages: Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Gujarati, Bengali, Punjabi, Odia, Assamese, Urdu, and English.

Always be:
- Friendly and clear
- Simple enough for rural farmers
- Accurate about farming, crop care, pests, pesticides, weather, and soil

If the user asks in Hindi, reply in Hindi.
If in Tamil, reply in Tamil. Same for Telugu, Kannada, etc.

Avoid long replies. Give tips that are useful and practical for small farmers.
`;

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'system', content: systemMessage }]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: newMessages,
      }),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || 'Sorry, I didn’t understand.';
    setMessages([...newMessages, { role: 'assistant', content: reply }]);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-green-700">🌾 FarmerAI - Free Assistant</h1>
      <div className="border rounded p-2 h-96 overflow-y-scroll bg-gray-100 mb-4">
        {messages.slice(1).map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded ${msg.role === 'user' ? 'bg-green-200' : 'bg-white'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your crop in any language..."
        />
        <button onClick={sendMessage} className="bg-green-600 text-white px-4 py-2 rounded">Send</button>
      </div>
    </div>
  );
}

export default App;
