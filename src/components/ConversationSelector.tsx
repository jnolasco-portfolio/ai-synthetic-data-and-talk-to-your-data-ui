import type { Conversation } from '../schemas/ConversationSchema';

interface ConversationSelectorProps {
  conversations: Conversation[];
  onConversationSelect: (conversationId: string) => void;
  selectedConversationId: string;
}

function ConversationSelector({ conversations, onConversationSelect, selectedConversationId }: ConversationSelectorProps) {
  return (
    <form>
      <select value={selectedConversationId} onChange={(e) => onConversationSelect(e.target.value)}>
        {conversations.map((conversation) => (
          <option
            key={conversation.conversationId}
            value={conversation.conversationId}
          >
            {conversation.name}
          </option>
        ))}
      </select>
    </form>
  );
}

export default ConversationSelector;
