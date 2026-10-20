import React, { FC, useState } from 'react';
import styles from './Modal.module.css';
import { useTranslations } from '../../translation/useTranslations'; 

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardName: string, actionService: string, action: string, reactionService: string, reaction: string) => void;
  cardName: string;
  actionService: string;
  action: string;
  reactionService: string;
  reaction: string;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  onSave,
  cardName: initialCardName,
  actionService: initialActionService,
  action: initialAction,
  reactionService: initialReactionService,
  reaction: initialReaction,
}) => {
  const [cardName, setCardName] = useState(initialCardName);
  const [actionService, setActionService] = useState(initialActionService);
  const [action, setAction] = useState(initialAction);
  const [reactionService, setReactionService] = useState(initialReactionService);
  const [reaction, setReaction] = useState(initialReaction);
  const { t } = useTranslations();

  const handleSave = () => {
    onSave(cardName, actionService, action, reactionService, reaction);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
        <h2 className={styles.modalContent}>{t('editArea')}</h2>
        <div className={styles.modalContent}>
          <input
            type="text"
            className={styles.inputFieldSolo}
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder={t('areaName')}
          />
          <div className={styles.inputGroup}>
            <div className={styles.leftSection}>
              <input
                type="text"
                className={styles.inputFieldDuo}
                value={actionService}
                onChange={(e) => setActionService(e.target.value)}
                placeholder={t('actionService')}
              />
              <input
                type="text"
                className={styles.inputFieldDuo}
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder={t('action')}
              />
            </div>

            <div className={styles.rightSection}>
              <input
                type="text"
                className={styles.inputFieldDuo}
                value={reactionService}
                onChange={(e) => setReactionService(e.target.value)}
                placeholder={t('reactionService')}
              />
              <input
                type="text"
                className={styles.inputFieldDuo}
                value={reaction}
                onChange={(e) => setReaction(e.target.value)}
                placeholder={t('reaction')}
              />
            </div>
          </div>
        </div>
        <div className={styles.buttons}>
          <button className={styles.cancelButton} onClick={onClose}>
          {t('cancel')}
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
          {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
