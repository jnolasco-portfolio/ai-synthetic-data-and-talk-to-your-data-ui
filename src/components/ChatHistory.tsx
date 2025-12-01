import type { QuestionResponse } from '../schemas/QuestionResponseSchema';
import ChatHistoryItem from './ChatHistoryItem';

interface ChatHistoryProps {
  data: QuestionResponse[];
}

function ChatHistory({ data }: ChatHistoryProps) {
  return (
    <>
      {data.map((item) => (
        <ChatHistoryItem key={item.id} item={item} />
      ))}
    </>
  );
}

export default ChatHistory;
