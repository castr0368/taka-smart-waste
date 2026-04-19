import { useState, useRef, useEffect } from 'react';

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am Taka AI, your smart waste management assistant. I can help you with reporting waste, understanding schedules, earning points, and anything else about the Taka Smart Waste system. How can I help you today? 🗑️'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

 const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/ai/chat?message=${encodeURIComponent(currentInput)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setMessages([...newMessages, {
        role: 'assistant',
        content: data.response || 'Sorry I could not process that. Please try again.'
      }]);
    } catch (err) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Sorry I am having trouble connecting. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    'How do I report waste?',
    'How do I earn points?',
    'What is illegal dumping?',
    'How does the schedule work?'
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '60px', height: '60px', borderRadius: '50%',
          background: '#2d6a4f', color: 'white', border: 'none',
          fontSize: '24px', cursor: 'pointer', zIndex: 9998,
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '96px', right: '24px',
          width: '380px', height: '500px', background: 'white',
          borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column', zIndex: 9997,
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
            padding: '16px 20px', color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>🤖</span>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '15px' }}>Taka AI Assistant</p>
                <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>Powered by Claude AI</p>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#52b788' }} />
                <span style={{ fontSize: '12px', opacity: 0.8 }}>Online</span>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: '12px',
                  background: msg.role === 'user' ? '#2d6a4f' : '#f0f7f4',
                  color: msg.role === 'user' ? 'white' : '#333',
                  fontSize: '14px', lineHeight: 1.5
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#f0f7f4', padding: '10px 14px', borderRadius: '12px', fontSize: '14px', color: '#666' }}>
                  Taka AI is thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div style={{ padding: '0 16px 8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {quickQuestions.map((q) => (
                <button key={q} onClick={() => { setInput(q); }} style={{
                  background: '#f0f7f4', border: '1px solid #d8f3dc', color: '#2d6a4f',
                  padding: '6px 10px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer'
                }}>{q}</button>
              ))}
            </div>
          )}

          <div style={{ padding: '12px 16px', borderTop: '1px solid #eee', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Taka AI anything..."
              style={{
                flex: 1, padding: '10px 14px', borderRadius: '24px',
                border: '1px solid #ccc', fontSize: '14px', outline: 'none'
              }}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
              background: '#2d6a4f', color: 'white', border: 'none',
              width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer',
              fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>→</button>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatbot;