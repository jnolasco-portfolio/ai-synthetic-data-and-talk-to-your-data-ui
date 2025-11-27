import type { QuestionResponse } from '../schemas/QuestionResponseSchema';
import ChatHistoryItem from './ChatHistoryItem';

interface ChatHistoryProps {
  data: QuestionResponse[];
}

function ChatHistory({ data }: ChatHistoryProps) {
  return (
    <>
      {data.map((item, index) => (
        <ChatHistoryItem
          key={index}
          question={item.question}
          sqlQuery={item.sqlQuery}
          result={item.result}
        />
      ))}
    </>
  );
}

export default ChatHistory;
