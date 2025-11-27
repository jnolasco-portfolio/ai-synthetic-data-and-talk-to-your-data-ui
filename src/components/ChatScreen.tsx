import type { Conversation } from '../schemas/ConversationSchema';
import type { QuestionFormValues } from '../schemas/QuestionFormSchema';
import type { QuestionResponse } from '../schemas/QuestionResponseSchema';
import ChatHistory from './ChatHistory';
import ConversationSelector from './ConversationSelector';
import QuestionForm from './QuestionForm';

const conversations: Conversation[] = [
  { conversationId: '', name: 'Select existing …' },
  { conversationId: 'uuid-5678', name: 'Topic 1' },
  { conversationId: 'uuid-8765', name: 'Topic 2' },
];

const data = [
  {
    first_name: 'Alice',
    last_name: 'Smith',
    loan_date: '2023-01-01',
    return_date: '2023-01-15',
  },
  {
    first_name: 'Bob',
    last_name: 'Johnson',
    loan_date: '2023-02-01',
    return_date: '2023-02-15',
  },
];

const chatHistory: QuestionResponse[] = [
  {
    conversationId: '',
    question: 'Who has loaned books?',
    sqlQuery:
      'SELECT DISTINCT T1.first_name, T1.last_name FROM Library_Members AS T1 JOIN Book_Loans AS T2 ON T1.member_id = T2.member_id',
    result: data,
  },
  {
    conversationId: '123',
    question: 'Who has loaned books?',
    sqlQuery:
      'SELECT DISTINCT T1.first_name, T1.last_name FROM Library_Members AS T1 JOIN Book_Loans AS T2 ON T1.member_id = T2.member_id',
    result: data,
  },
];

const ChatScreen = () => {
  const handleConversationSelect = (conversationId: string) => {
    console.log('Selected conversation:', conversationId);
  };

  const handleOnSubmitQuestion = (data: QuestionFormValues) => {
    console.log('Submitted question:', data);
  };

  return (
    <>
      <section className='conversation-selector'>
        <ConversationSelector
          conversations={conversations}
          onConversationSelect={handleConversationSelect}
        />
      </section>

      <section className='history'>
        <ChatHistory data={chatHistory} />
      </section>

      <section className='question-form'>
        <QuestionForm onSubmit={handleOnSubmitQuestion} />
      </section>
    </>
  );
};

export default ChatScreen;
