import React, { useState, useRef, useEffect } from 'react';

import { Button } from './ui/button';

import { Input } from './ui/input';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { ScrollArea } from './ui/scroll-area';

import { Avatar, AvatarFallback } from './ui/avatar';

import { 

  Bot,

  Send,

  X,

  Minimize2,

  Maximize2,

  User

} from 'lucide-react';

import { aiAssistantService } from '../api/services';



interface Message {

  id: string;

  content: string;

  sender: 'user' | 'ai';

  timestamp: Date;

}



interface AIChatWidgetProps {

  userRole?: string;

  userName?: string;

}



export function AIChatWidget({ userRole, userName }: AIChatWidgetProps) {

  const [isOpen, setIsOpen] = useState(false);

  const [isMinimized, setIsMinimized] = useState(false);

  const [messages, setMessages] = useState<Message[]>([

    {

      id: '1',

      content: `مرحباً ${userName || 'بك'}! أنا مساعد سحابة الأثر الذكي. يمكنني مساعدتك في:\n\n• إنشاء الاستبيانات وتحليلها\n• فهم التقارير والبيانات\n• الإجابة على أسئلة حول المنصة\n• تقديم إرشادات لتحسين قياس الأثر\n\nكيف يمكنني مساعدتك اليوم؟`,

      sender: 'ai',

      timestamp: new Date()

    }

  ]);

  const [inputValue, setInputValue] = useState('');

  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);



  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  };



  useEffect(() => {

    scrollToBottom();

  }, [messages]);



  const handleSendMessage = async () => {

    if (!inputValue.trim()) return;



    const userMessage: Message = {

      id: Date.now().toString(),

      content: inputValue,

      sender: 'user',

      timestamp: new Date()

    };



    setMessages(prev => [...prev, userMessage]);

    setInputValue('');

    setIsTyping(true);



    try {
      const aiResponse = await aiAssistantService.ask({ question: inputValue });
      if (aiResponse.success && aiResponse.data) {
        const message: Message = {
          id: (aiResponse.data as any).messageId || (Date.now() + 1).toString(),
          content: (aiResponse.data as any).answer || '',
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, message]);
      } else {
        const fallback: Message = {
          id: (Date.now() + 1).toString(),
          content: 'USU.U?U+O U.O O?U+O"O? O3O-OO"Oc OU,O?OO? OU,OO3O?O"USOU+ O"U+O?OO-',
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, fallback]);
      }
  } catch (error) {
    console.error('AI ask failed:', error);
    const fallback: Message = {
      id: (Date.now() + 1).toString(),
      content: 'USU.U?U+O U.O O?U+O"O? O3O-OO"Oc OU,O?OO? OU,OO3O?O"USOU+ O"U+O?OO-',
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, fallback]);
  } finally {
    setIsTyping(false);
  }
  };

  const generateAIResponse = (userInput: string): string => {

    const input = userInput.toLowerCase();

    

    if (input.includes('استبيان') || input.includes('سؤال')) {

      return 'يمكنني مساعدتك في إنشاء استبيانات فعّالة! إليك بعض النصائح:\n\n• استخدم أسئلة واضحة ومحددة\n• اختر أنواع الأسئلة المناسبة (اختيار متعدد، مقياس، نص حر)\n• أضف أسئلة قبلية وبعدية لقياس التغيير\n• حدد المجال المناسب لكل سؤال\n\nهل تريد مساعدة في نوع معين من الأسئلة؟';

    }

    

    if (input.includes('تحليل') || input.includes('تقرير') || input.includes('بيانات')) {

      return 'التحليلات في سحابة الأثر تساعدك على:\n\n• فهم تأثير برامجك ومشاريعك\n• مقارنة النتائج القبلية والبعدية\n• تحديد المجالات التي تحقق أكبر أثر\n• إنشاء تقارير مرئية واضحة\n\nيمكنك الوصول للتحليلات من صفحة النتائج لكل استبيان. هل تحتاج مساعدة في تفسير نتائج معينة؟';

    }

    

    if (input.includes('مساعدة') || input.includes('كيف')) {

      return 'أنا هنا لمساعدتك! يمكنني الإجابة على أسئلة حول:\n\n• إنشاء وإدارة الاستبيانات\n• فهم التقارير والتحليلات\n• استخدام ميزات المنصة المختلفة\n• أفضل الممارسات في قياس الأثر\n• المشاكل التقنية الشائعة\n\nما الذي تود معرفته تحديداً؟';

    }

    

    if (input.includes('مرحبا') || input.includes('أهلا') || input.includes('السلام')) {

      return `أهلاً وسهلاً ${userName || 'بك'}! سعيد لوجودك هنا في سحابة الأثر.\n\nأنا مساعدك الذكي وجاهز للإجابة على جميع استفساراتك حول المنصة وقياس الأثر الاجتماعي.\n\nكيف يمكنني مساعدتك اليوم؟`;

    }

    

    if (input.includes('شكرا') || input.includes('ممتاز') || input.includes('جيد')) {

      return 'العفو! سعيد لأنني استطعت مساعدتك 😊\n\nلا تتردد في سؤالي أي شيء آخر. أنا هنا دائماً لمساعدتك في تحقيق أقصى استفادة من سحابة الأثر!';

    }

    

    // Default response

    return 'شكراً لك على سؤالك! أنا أعمل على تحسين فهمي لأقدم لك أفضل المساعدة.\n\nفي الوقت الحالي، يمكنني مساعدتك في:\n• أسئلة حول إنشاء الاستبيانات\n• فهم التحليلات والتقارير\n• استخدام ميزات المنصة\n• أفضل الممارسات في قياس الأثر\n\nهل يمكنك إعادة صياغة سؤالك أو اختيار أحد المواضيع أعلاه؟';

  };



  const handleKeyPress = (e: React.KeyboardEvent) => {

    if (e.key === 'Enter' && !e.shiftKey) {

      e.preventDefault();

      handleSendMessage();

    }

  };



  const formatTime = (date: Date) => {

    return date.toLocaleTimeString('ar-SA', { 

      hour: '2-digit', 

      minute: '2-digit',

      hour12: false 

    });

  };



  // Only show for admin role

  if (userRole !== 'admin') {

    return null;

  }



  return (

    <>

      <style>{`

        .chat-message-scroll::-webkit-scrollbar {

          width: 4px;

        }

        .chat-message-scroll::-webkit-scrollbar-track {

          background: transparent;

        }

        .chat-message-scroll::-webkit-scrollbar-thumb {

          background: rgba(0, 0, 0, 0.2);

          border-radius: 2px;

        }

        .chat-message-scroll::-webkit-scrollbar-thumb:hover {

          background: rgba(0, 0, 0, 0.3);

        }

        .chat-message-scroll.user-message::-webkit-scrollbar-thumb {

          background: rgba(255, 255, 255, 0.3);

        }

        .chat-message-scroll.user-message::-webkit-scrollbar-thumb:hover {

          background: rgba(255, 255, 255, 0.5);

        }

      `}</style>

      

      {/* Chat Widget Button */}

      {!isOpen && (

        <Button

          onClick={() => setIsOpen(true)}

          className="fixed bottom-6 left-6 h-14 w-14 rounded-full bg-gradient-to-br from-[#183259] to-[#2a4a7a] hover:from-[#2a4a7a] hover:to-[#183259] shadow-lg hover:shadow-xl transition-all duration-300 z-50 p-0"

          title="مساعد سحابة الأثر الذكي"

        >

          <Bot className="h-6 w-6 text-white" />

        </Button>

      )}



      {/* Chat Window */}

      {isOpen && (

        <Card className={`fixed bottom-6 left-6 z-50 shadow-2xl border-0 transition-all duration-300 ${

          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px] max-h-[600px]'

        } overflow-hidden`}>

          {/* Header */}

          <CardHeader className="bg-gradient-to-r from-[#183259] to-[#2a4a7a] text-white p-4 rounded-t-lg">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <Avatar className="h-8 w-8 bg-white/20 border-2 border-white/30">

                  <AvatarFallback className="bg-transparent">

                    <Bot className="h-4 w-4 text-white" />

                  </AvatarFallback>

                </Avatar>

                <div>

                  <CardTitle className="text-sm font-semibold">برق</CardTitle>

                  {!isMinimized && (

                    <p className="text-xs text-blue-100">مساعدك الذكي لقياس الأثر</p>

                  )}

                </div>

              </div>

              <div className="flex items-center gap-2">

                <Button

                  variant="ghost"

                  size="sm"

                  onClick={() => setIsMinimized(!isMinimized)}

                  className="h-8 w-8 p-0 hover:bg-white/20 text-white"

                >

                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}

                </Button>

                <Button

                  variant="ghost"

                  size="sm"

                  onClick={() => setIsOpen(false)}

                  className="h-8 w-8 p-0 hover:bg-white/20 text-white"

                >

                  <X className="h-4 w-4" />

                </Button>

              </div>

            </div>

          </CardHeader>



          {/* Chat Content */}

          {!isMinimized && (

            <>

              <CardContent className="p-0 h-[480px] max-h-[480px] flex flex-col overflow-hidden">

                {/* Messages Area */}

                <ScrollArea className="flex-1 p-4 max-h-[400px] overflow-y-auto">

                  <div className="space-y-4">

                    {messages.map((message) => (

                      <div

                        key={message.id}

                        className={`flex gap-3 ${

                          message.sender === 'user' ? 'justify-start flex-row-reverse' : 'justify-start'

                        }`}

                      >

                        <Avatar className={`h-8 w-8 ${message.sender === 'user' ? 'bg-gray-100' : 'bg-[#183259]'}`}>

                          <AvatarFallback>

                            {message.sender === 'user' ? (

                              <User className="h-4 w-4 text-gray-600" />

                            ) : (

                              <Bot className="h-4 w-4 text-white" />

                            )}

                          </AvatarFallback>

                        </Avatar>

                        <div className={`max-w-[75%] ${message.sender === 'user' ? 'text-left' : 'text-right'}`}>

                          <div

                            className={`rounded-2xl px-4 py-3 whitespace-pre-wrap max-h-48 overflow-y-auto chat-message-scroll ${

                              message.sender === 'user'

                                ? 'bg-[#183259] text-white user-message'

                                : 'bg-gray-100 text-gray-800'

                            }`}

                          >

                            {message.content}

                          </div>

                          <div className="text-xs text-gray-500 mt-1 px-2">

                            {formatTime(message.timestamp)}

                          </div>

                        </div>

                      </div>

                    ))}

                    

                    {/* Typing Indicator */}

                    {isTyping && (

                      <div className="flex gap-3 justify-start">

                        <Avatar className="h-8 w-8 bg-[#183259]">

                          <AvatarFallback>

                            <Bot className="h-4 w-4 text-white" />

                          </AvatarFallback>

                        </Avatar>

                        <div className="bg-gray-100 rounded-2xl px-4 py-3">

                          <div className="flex gap-1">

                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>

                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>

                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>

                          </div>

                        </div>

                      </div>

                    )}

                    <div ref={messagesEndRef} />

                  </div>

                </ScrollArea>



                {/* Input Area */}

                <div className="p-4 border-t bg-gray-50 flex-shrink-0">

                  <div className="flex gap-2">

                    <Input

                      value={inputValue}

                      onChange={(e) => setInputValue(e.target.value)}

                      onKeyPress={handleKeyPress}

                      placeholder="اكتب رسالتك هنا..."

                      className="flex-1 rounded-full border-gray-200 focus:border-[#183259] focus:ring-[#183259]"

                      disabled={isTyping}

                    />

                    <Button

                      onClick={handleSendMessage}

                      disabled={!inputValue.trim() || isTyping}

                      className="rounded-full h-10 w-10 p-0 bg-[#183259] hover:bg-[#2a4a7a]"

                    >

                      <Send className="h-4 w-4" />

                    </Button>

                  </div>

                </div>

              </CardContent>

            </>

          )}

        </Card>

      )}

    </>

  );

}
