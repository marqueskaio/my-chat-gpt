import React, {useState, useRef, useEffect} from 'react';
import {Layout, Input, Button, List, Avatar, Space} from 'antd';
import {SendOutlined, UserOutlined, RobotOutlined} from '@ant-design/icons';
import {Gpt} from "./gpt";
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import {FaMicrophone} from "react-icons/fa";
import SwitchModo, {Modo} from "./switch-modo";
import {DallE} from "./dall-e";


const {Content} = Layout;

interface Message {
    text: any;
    sender: 'user' | 'bot';
}

const ChatBot: React.FC = () => {
    const [modoAtual, setModoAtual] = useState<string>(Modo.TEXTO);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() !== '') {
            setMessages([...messages, {text: newMessage, sender: 'user'}]);
            const respostaDoGpt = await Gpt(newMessage);
            console.log(respostaDoGpt);
            setMessages([
                ...messages,
                {text: newMessage, sender: 'user'},
                {text: respostaDoGpt, sender: 'bot'},
            ]);
            setNewMessage('');
        }
    };

    const handleGenerateImage = async () => {
        if (newMessage.trim() !== '') {
            setMessages([...messages, {text: newMessage, sender: 'user'}]);
            const respostaDoDallE = await DallE(newMessage);
            console.log(respostaDoDallE);
            setMessages([
                ...messages,
                {text: newMessage, sender: 'user'},
                {text: <img src={respostaDoDallE}/>, sender: 'bot'},
            ]);
            setNewMessage('');
        }
    }

    const handleSendAudio = () => {
        if (browserSupportsSpeechRecognition) {
            if (listening) {
                SpeechRecognition.stopListening();
                if (transcript.trim() !== '') {
                    handleSendMessageWithTranscript(transcript);
                }
                resetTranscript();
            } else {
                SpeechRecognition.startListening();
            }
        } else {
            alert("Seu navegador não suporta reconhecimento de fala.");
        }
    };

    const handleSendMessageWithTranscript = async (transcript: string) => {
        setMessages([...messages, {text: transcript, sender: 'user'}]);
        if (modoAtual === Modo.IMAGEM) {
            const respostaDoDall = await DallE(transcript);
            console.log(respostaDoDall);
            setMessages([
                ...messages,
                {text: transcript, sender: 'user'},
                {text: <img src={respostaDoDall}/>, sender: 'bot'},
            ]);
            return;
        }
        const respostaDoGpt = await Gpt(transcript);
        console.log(respostaDoGpt);
        setMessages([
            ...messages,
            {text: transcript, sender: 'user'},
            {text: respostaDoGpt, sender: 'bot'},
        ]);
    }

    const handleTextInputFocus = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        }
    };

    const handleTextInputBlur = () => {
        if (!listening && transcript.trim() === '') {
            SpeechRecognition.startListening();
        }
    };

    return (
        <Layout style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Content style={{
                padding: 24,
                background: '#fff',
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxHeight: '80vh'
            }}>
                <div style={{flex: 1, overflowY: 'auto'}}>
                    <List
                        dataSource={messages}
                        renderItem={(message: any) => (
                            <List.Item style={{
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                            }}>
                                {message.sender === 'bot' && <Avatar icon={<RobotOutlined/>} style={{
                                    marginRight: 8,
                                    backgroundColor: '#f0f0f0'
                                }}/>}
                                <div className={`message ${message.sender}`}
                                     style={{padding: 12, borderRadius: 8, marginBottom: 8, maxWidth: '70%'}}>
                                    {message.text}
                                </div>
                                {message.sender === 'user' && <Avatar icon={<UserOutlined/>} style={{
                                    marginLeft: 8,
                                    backgroundColor: '#e6f7ff'
                                }}/>}
                            </List.Item>
                        )}
                    />
                    <div ref={messagesEndRef}/>
                </div>
                <div style={{marginTop: 16}}>
                    <Input.Group compact style={{display: 'flex'}}>
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (modoAtual === Modo.TEXTO ? handleSendMessage() : handleGenerateImage())}
                            placeholder={modoAtual === Modo.TEXTO ? "Digite sua mensagem..." : "Descreva a imagem que você quer gerar..."}
                            style={{ flex: 1, borderRadius: 8, marginRight: 8 }}
                            onFocus={handleTextInputFocus}
                            onBlur={handleTextInputBlur}
                        />
                        <Space>
                            <SwitchModo modoAtual={modoAtual as any} setModoAtual={setModoAtual} />
                            <Button
                                type="primary"
                                onClick={modoAtual === Modo.TEXTO ? handleSendMessage : handleGenerateImage}
                                icon={<SendOutlined/>}/>
                            <Button
                                onClick={handleSendAudio}
                                icon={<FaMicrophone/>}
                                type={listening ? "primary" : "default"}
                                style={{backgroundColor: listening ? '#db3236' : '', color: listening ? 'white' : ''}}
                            />
                        </Space>
                    </Input.Group>
                </div>
            </Content>
        </Layout>

    );
};

export default ChatBot;