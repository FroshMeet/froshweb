
import ModernChatInterface from "../ModernChatInterface";

interface ChatsTabContentProps {
  schoolName?: string;
}

const ChatsTabContent = ({ schoolName }: ChatsTabContentProps) => {
  return <ModernChatInterface schoolName={schoolName} />;
};

export default ChatsTabContent;
