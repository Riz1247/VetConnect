import React, { useState, useEffect } from 'react';
import './ChatBot.css';
import botAvatar from '../assets/bot-avatar.png';

const ChatBot = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your VetConnect assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(true);

    const handleSend = () => {
        if (input.trim() === '') return;

        // Add user message
        const newMessages = [...messages, { text: input, isBot: false }];
        setMessages(newMessages);

        // Simple response logic
        const response = generateResponse(input.toLowerCase());
        setTimeout(() => {
            setMessages([...newMessages, { text: response, isBot: true }]);
        }, 500);

        setInput('');
    };

    const generateResponse = (input) => {
        if (input.includes('appointment') || input.includes('schedule')) {
            return "To schedule an appointment, please use our appointment booking feature or call our clinic directly.";
        } else if (input.includes('emergency') || input.includes('emergency vet')) {
            return "If this is a medical emergency, please call our emergency hotline immediately or visit the nearest veterinary emergency center.";
        }
        else if( input.includes("Login") || input.includes("Register") || input.includes("User login") ) {
            return "To login or register, please use the login or register button in the top right corner of the website.";
        }
        else if (input.includes('services') || input.includes('offer')) {
            return "We offer various veterinary services including vaccinations, check-ups, surgery, dental care, and more. Check our services page for details.";
        } else if (input.includes('location') || input.includes('address')) {
            return "You can find our clinic's location and contact details in the Contact section of the website.";
        } else {
            return "I'm here to help! You can ask me about appointments, services, emergencies, or location information.";
        }
    };

    return (
        <div className="chatbot-container" style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '320px',
            maxHeight: isOpen ? '500px' : '60px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden'
        }}>
            <div 
                className="gradient-header"
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    padding: '12px 16px',
                    color: 'white',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img 
                        src={botAvatar} 
                        alt="Bot Avatar" 
                        className="bot-avatar"
                    />
                    <h3 style={{ margin: 0 }}>VetConnect Assistant</h3>
                </div>
                <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>▼</span>
            </div>
            
            <div style={{ 
                flex: 1,
                overflowY: 'auto',
                maxHeight: '300px',
                padding: '16px'
            }}>
                {messages.map((message, index) => (
                    <div 
                        key={index}
                        style={{
                            display: 'flex',
                            justifyContent: message.isBot ? 'flex-start' : 'flex-end',
                            marginBottom: '8px'
                        }}
                    >
                        <div className={`message-bubble ${message.isBot ? 'bot-message' : 'user-message'}`} style={{
                            padding: '10px 16px',
                            borderRadius: '16px',
                            maxWidth: '80%',
                            wordBreak: 'break-word',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                        }}>
                            {message.text}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ padding: '16px', borderTop: '1px solid #eee' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        className="chat-input"
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            border: '1px solid #ddd',
                            borderRadius: '20px',
                            outline: 'none',
                            fontSize: '14px'
                        }}
                    />
                    <button 
                        onClick={handleSend}
                        className="send-button"
                        style={{
                            padding: '12px 20px',
                            backgroundColor: '#2196f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
