import type { QuestionResponse } from '../schemas/QuestionResponseSchema';
import ChartRenderer from './charts/ChartRenderer';

interface ChatHistoryItemProps {
  item: QuestionResponse;
}

function ChatHistoryItem({ item }: ChatHistoryItemProps) {
  const metadata = {
    ...item.metadata,
    category_key: item.metadata.category_key ?? '',
    value_key: item.metadata.value_key ?? '',
  };

  return (
    <article>
      <blockquote>{item.question}</blockquote>
      {item.sqlQuery && (
        <>
          <code>{item.sqlQuery}</code>
          <hr />
        </>
      )}
      <ChartRenderer data={item.result} metadata={metadata} />
    </article>
  );
}

export default ChatHistoryItem;
