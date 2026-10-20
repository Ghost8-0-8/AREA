import React from 'react';

interface ActionsReactionsProps {
  type: 'actions' | 'reactions';
  items: string[];
  onItemClick: (method: string) => void;
}

const ActionsReactions: React.FC<ActionsReactionsProps> = ({ type, items, onItemClick }) => {
  return (
    <div>
      <h3>{type === 'actions' ? 'Actions' : 'Reactions'}:</h3>
      <ul>
        {items.length > 0 ? (
          items.map((item, index) => (
            <li key={index} onClick={() => onItemClick(item)} style={{ cursor: 'pointer' }}>
              {item}
            </li>
          ))
        ) : (
          <li>No {type} available</li>
        )}
      </ul>
    </div>
  );
};

export default ActionsReactions;
