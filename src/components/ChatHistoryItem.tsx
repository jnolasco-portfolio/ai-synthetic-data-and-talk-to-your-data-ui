import ResultTable from './ResultTable';

interface ChatHistoryItemProps {
  question: string;
  sqlQuery: string;
  result: Record<string, string>[];
}

function ChatHistoryItem({ question, sqlQuery, result }: ChatHistoryItemProps) {
  return (
    <article>
      <blockquote>{question}</blockquote>
      <code>{sqlQuery}</code>
      <hr />
      <ResultTable result={result} />
    </article>
  );
}

export default ChatHistoryItem;
