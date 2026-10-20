import React, { useState } from 'react';
import style from './DiscordReactions.module.css';

interface ReactionParams {
  channel: string;
  content: string;
}

const DiscordReactions: React.FC<{ onReactionChange: (reaction: any) => void }> = ({ onReactionChange }) => {
  const [channel, setChannel] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleReactionChange = () => {
    const reaction = {
      service: "discord",
      method: "send_server_message",
      params: {
        channel: channel,
        content: content
      }
    };
    onReactionChange(reaction);
  };

  return (
    <div>
      <h3>Discord Reactions</h3>
      <div className={style.reactionContainer}>
        <span className={style.label}>Channel ID:</span>
        <input
          type="text"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className={style.inputField}
        />
        <span className={style.label}>Message Content:</span>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={style.inputField}
        />
        <button onClick={handleReactionChange} className={style.reactionButton}>Set Reaction</button>
      </div>
    </div>
  );
};

export default DiscordReactions;
