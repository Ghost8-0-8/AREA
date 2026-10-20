import React, { useState } from 'react';
import style from './DiscordActions.module.css';

interface ActionParams {
  channel: string;
}

const DiscordActions: React.FC<{ onActionChange: (action: any) => void }> = ({ onActionChange }) => {
  const [channel, setChannel] = useState<string>('');

  const handleActionChange = () => {
    const action = {
      service: "discord",
      method: "get_server_message",
      params: {
        channel: channel
      }
    };
    onActionChange(action);
  };

  return (
    <div>
      <h3>Discord Actions</h3>
      <div className={style.actionContainer}>
        <span className={style.label}>Channel ID:</span>
        <input
          type="text"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className={style.inputField}
        />
        <button onClick={handleActionChange} className={style.actionButton}>Set Action</button>
      </div>
    </div>
  );
};

export default DiscordActions;
