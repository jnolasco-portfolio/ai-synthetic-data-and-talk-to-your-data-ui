import { useState } from 'react';
import type { Conversation } from '../schemas/ConversationSchema';
import type { QuestionRequest } from '../schemas/QuestionRequestSchema';
import type { QuestionResponse } from '../schemas/QuestionResponseSchema';
import ChatHistory from './ChatHistory';
import ConversationSelector from './ConversationSelector';
import QuestionForm from './QuestionForm';
import { useAskQuestion } from '../hooks/useAskQuestion';
import LoadingOverlay from './LoadingOverlay';
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import useLocalStorage from '../hooks/useLocalStorage';

type ChatHistoryItem = QuestionResponse & {
  error?: string;
  id?: string;
};

const initialConversations: Conversation[] = [
  { conversationId: 'new', name: 'New Chat' },
];

const ChatScreen = () => {
  const [currentChatHistory, setCurrentChatHistory] = useState<
    ChatHistoryItem[]
  >([]);
  const [conversations, setConversations] = useLocalStorage(
    'conversations',
    initialConversations
  );
  const [currentConversationId, setCurrentConversationId] =
    useState<string>('new');

  const handleAskQuestionSuccess = (data: QuestionResponse) => {
    setCurrentChatHistory((prev: ChatHistoryItem[]) => {
      const chatHistory = [...prev, data];
      localStorage.setItem(
        `chat-history-${currentConversationId}`,
        JSON.stringify(chatHistory)
      );
      return chatHistory;
    });
    // If it was a new chat or a newly frontend-generated ID, add it to conversations
    if (
      currentConversationId === 'new' ||
      !conversations.some(
        (c: Conversation) => c.conversationId === data.conversationId
      )
    ) {
      const newConvo: Conversation = {
        conversationId: data.conversationId,
        name: data.question.substring(0, 30) + '...', // First part of question as topic
      };
      setConversations((prev: Conversation[]) => [...prev, newConvo]);
      setCurrentConversationId(newConvo.conversationId);
    }
  };

  const handleAskQuestionError = (error: Error) => {
    setCurrentChatHistory((prev) => [
      ...prev,
      {
        conversationId: currentConversationId,
        question: 'Error',
        sqlQuery: 'Error occurred while fetching response.',
        result: [],
        error: error.message || 'Unknown error',
        id: uuidv4(), // Generate a unique ID
      },
    ]);
  };

  const askQuestionMutation = useAskQuestion({
    onSuccess: handleAskQuestionSuccess,
    onError: handleAskQuestionError,
  });

  const handleConversationSelect = (conversationId: string) => {
    const storedChatHistory = localStorage.getItem(
      `chat-history-${conversationId}`
    );
    if (storedChatHistory) {
      const chatHistory = JSON.parse(storedChatHistory);
      setCurrentChatHistory(chatHistory);
    } else {
      // If no chat history is found in local storage, initialize it as an empty array
      setCurrentChatHistory([]);
    }
    setCurrentConversationId(conversationId);
  };

  const handleOnSubmitQuestion = (formData: QuestionRequest) => {
    let conversationIdToSend = currentConversationId;
    if (currentConversationId === 'new') {
      conversationIdToSend = uuidv4(); // Generate UUID on the frontend
      // Immediately set the current conversation ID to the new UUID
      // This prevents generating a new UUID for every subsequent question in the same 'new' chat
      setCurrentConversationId(conversationIdToSend);
    }

    // Prepare the request for the AI
    const request: QuestionRequest = {
      ...formData,
      conversationId: conversationIdToSend,
      // You might need to get schemaName dynamically here or from context
      schemaName: 'library', // Mock schema name for now
    };
    askQuestionMutation.mutate(request);
  };

  return (
    <>
      {askQuestionMutation.isPending && (
        <LoadingOverlay message='AI is thinking...' />
      )}
      <section className='conversation-selector'>
        <ConversationSelector
          conversations={conversations}
          onConversationSelect={handleConversationSelect}
          selectedConversationId={currentConversationId}
        />
      </section>

      <section className='history'>
        <ChatHistory data={currentChatHistory} />
      </section>

      <section className='question-form'>
        <QuestionForm onSubmit={handleOnSubmitQuestion} />
      </section>
    </>
  );
};

export default ChatScreen;
