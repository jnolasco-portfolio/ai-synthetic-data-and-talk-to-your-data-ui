import type { Conversation } from '../schemas/ConversationSchema';

interface ConversationSelectorProps {
  conversations: Conversation[];
  onConversationSelect: (conversationId: string) => void;
}

function ConversationSelector({ conversations }: ConversationSelectorProps) {
  return (
    <form>
      <select>
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
