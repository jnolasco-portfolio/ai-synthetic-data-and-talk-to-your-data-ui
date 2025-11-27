import { useEffect, useState } from 'react';
import type { Conversation } from '../schemas/ConversationSchema';
import type { QuestionRequest } from '../schemas/QuestionRequestSchema';
import type { QuestionResponse } from '../schemas/QuestionResponseSchema';
import ChatHistory from './ChatHistory';
import ConversationSelector from './ConversationSelector';
import QuestionForm from './QuestionForm';
import { useAskQuestion } from '../hooks/useAskQuestion';
import LoadingOverlay from './LoadingOverlay';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

const initialConversations: Conversation[] = [
  { conversationId: 'new', name: 'New Chat' },
  { conversationId: 'uuid-5678', name: 'Topic 1 (Mock)' },
  { conversationId: 'uuid-8765', name: 'Topic 2 (Mock)' },
];

const ChatScreen = () => {
  const [currentChatHistory, setCurrentChatHistory] = useState<
    QuestionResponse[]
  >([]);
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [currentConversationId, setCurrentConversationId] =
    useState<string>('new');

  const askQuestionMutation = useAskQuestion();

  // Effect to handle the AI's response
  useEffect(() => {
    if (askQuestionMutation.isSuccess && askQuestionMutation.data) {
      setCurrentChatHistory((prev) => [...prev, askQuestionMutation.data!]);
      // If it was a new chat or a newly frontend-generated ID, add it to conversations
      if (
        currentConversationId === 'new' ||
        !conversations.some(
          (c) => c.conversationId === askQuestionMutation.data.conversationId
        )
      ) {
        const newConvo: Conversation = {
          conversationId: askQuestionMutation.data.conversationId,
          name: askQuestionMutation.data.question.substring(0, 30) + '...', // First part of question as topic
        };
        setConversations((prev) => [...prev, newConvo]);
        setCurrentConversationId(newConvo.conversationId);
      }
    }
  }, [askQuestionMutation.isSuccess, askQuestionMutation.data, currentConversationId, conversations]);

  // Effect to handle errors from the AI's response
  useEffect(() => {
    if (askQuestionMutation.isError) {
      setCurrentChatHistory((prev) => [
        ...prev,
        {
          conversationId: currentConversationId,
          question: 'Error',
          sqlQuery: 'Error occurred while fetching response.',
          result: [],
          error: askQuestionMutation.error?.message || 'Unknown error',
        },
      ]);
    }
  }, [askQuestionMutation.isError, askQuestionMutation.error, currentConversationId]);

  const handleConversationSelect = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    // In a real app, you would fetch the history for this conversationId
    // For now, let's clear history for 'new' and keep mock for others or fetch
    if (conversationId === 'new') {
      setCurrentChatHistory([]);
    } else {
      // Mock history for selected conversation for demonstration
      setCurrentChatHistory([
        {
          conversationId: conversationId,
          question: `Mock question for ${conversationId}`,
          sqlQuery: 'SELECT * FROM mock_table',
          result: [{ id: '1', name: 'Mock Data' }],
        },
      ]);
    }
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
