import React, { useState } from 'react';
import GradeIcon from '@mui/icons-material/Grade';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import styles from './Card.module.css';
import Modal from '../modal/Modal';

interface BubbleProps {
    id: number;
    date: string;
    isToggled: boolean;
    isPriority: boolean;
    message: string;
    cardName: string;
    onToggleSwitch: () => void;
    onDelete: () => void;
    onTogglePriority: () => void;
    onOpenModal: () => void;
  }
  
  const BubbleCard: React.FC<BubbleProps> = ({
    date,
    isToggled,
    isPriority,
    message,
    cardName,
    onToggleSwitch,
    onDelete,
    onTogglePriority,
    onOpenModal,
  }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCardName, setNewCardName] = useState(cardName);
    const [actionService, setActionService] = useState('');
    const [reactionService, setReactionService] = useState('');
    const [action, setAction] = useState('');
    const [reaction, setReaction] = useState('');

    const handleSave = () => {
      console.log('Nouveau Nom de la carte:', newCardName);
      console.log('Action Service:', actionService);
      console.log('Reaction Service:', reactionService);
      console.log('Action:', action);
      console.log('Reaction:', reaction);
      setIsModalOpen(false);
    };
  
    return (
      <div className={`${styles.bubble} ${isPriority ? styles.priority : ''}`}>
        <div className={styles.topSection}>
          <div className={styles.date}>{date}</div>
          <div className={styles.toggleContainer}>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={isToggled} 
                onChange={onToggleSwitch} 
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        
          <div className={styles.iconSection}>
            <div className={styles.iconPlaceholder}></div>
            <span className={styles.dots}>...</span>
            <div className={styles.iconPlaceholder}></div>
            <div className={styles.linkText}>{cardName}</div>
          </div>
  
          <div className={styles.actionIcons}>
            {isPriority ? (
              <GradeIcon
                fontSize="large"
                style={{ color: 'yellow', cursor: 'pointer' }}
                onClick={onTogglePriority}
              />
            ) : (
              <StarBorderIcon
                fontSize="large"
                style={{ color: 'gold', cursor: 'pointer' }}
                onClick={onTogglePriority}
              />
            )}
            <DeleteIcon
              fontSize="large"
              style={{ color: 'red', cursor: 'pointer', display: 'block' }}
              onClick={onDelete}
            />
            <EditIcon
              fontSize="large"
              style={{ color: 'gray', cursor: 'pointer', marginTop: '10px' }}
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>
  
        <div className={styles.messageSection}>
          <p className={styles.messageContent}>{message}</p>
        </div>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            cardName={newCardName}
            actionService={actionService}
            action={action}
            reactionService={reactionService}
            reaction={reaction}
        />
      </div>
    );
  };
  
  interface BubbleData {
    id: number;
    date: string;
    isToggled: boolean;
    isPriority: boolean;
    message: string;
    cardName: string;
  }
  
  interface BubbleListProps {
    showFavorites?: boolean;
  }
  
  const BubbleList: React.FC<BubbleListProps> = ({ showFavorites = false }) => {
    const [bubbles, setBubbles] = useState<BubbleData[]>([
      { id: 1, date: '11/11/2011', isToggled: false, isPriority: false, message: 'First message', cardName: 'Card 1' },
      { id: 2, date: '12/11/2011', isToggled: true, isPriority: true, message: 'Second message', cardName: 'Card 2' },
    ]);
  
    const handleToggleSwitch = (id: number) => {
      setBubbles(prevBubbles =>
        prevBubbles.map(bubble =>
          bubble.id === id ? { ...bubble, isToggled: !bubble.isToggled } : bubble
        )
      );
    };
  
    const handleDeleteBubble = (id: number) => {
      setBubbles(prevBubbles => prevBubbles.filter(bubble => bubble.id !== id));
    };
  
    const handleTogglePriority = (id: number) => {
      setBubbles(prevBubbles =>
        prevBubbles.map(bubble =>
          bubble.id === id ? { ...bubble, isPriority: !bubble.isPriority } : bubble
        )
      );
    };
  
    const handleOpenModal = (id: number) => {
      console.log('Open modal for bubble id:', id);
    };
  
    const displayedBubbles = showFavorites
      ? bubbles.filter(bubble => bubble.isPriority)
      : bubbles;
  
    return (
      <div className={styles.bubbleList}>
        {displayedBubbles.map(bubble => (
          <BubbleCard
            key={bubble.id}
            id={bubble.id}
            date={bubble.date}
            isToggled={bubble.isToggled}
            isPriority={bubble.isPriority}
            message={bubble.message}
            cardName={bubble.cardName}
            onToggleSwitch={() => handleToggleSwitch(bubble.id)}
            onDelete={() => handleDeleteBubble(bubble.id)}
            onTogglePriority={() => handleTogglePriority(bubble.id)}
            onOpenModal={() => handleOpenModal(bubble.id)}
          />
        ))}
      </div>
    );
  };
  
export default BubbleList;
