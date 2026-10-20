"use client";

import React, { useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import styles from './Usercard.module.css';
import { useTheme } from '../../features/ThemeContext';
import { useTranslations } from '../../translation/useTranslations'; 

type UserField = 'firstName' | 'lastName' | 'birthName' | 'phone' | 'email' | 'password';

const UserCard: React.FC = () => {

    const { isNightMode, toggleTheme } = useTheme();
    
    const username = "USERNAME";
    const { t } = useTranslations();

    const [firstName, setFirstName] = useState(() => localStorage.getItem('firstName') || "NAME");
    const [lastName, setLastName] = useState(() => localStorage.getItem('lastName') || "LASTNAME");
    const [birthName, setBirthName] = useState(() => localStorage.getItem('birthName') || "DD-MM-YYYY");
    const [phone, setPhone] = useState(() => localStorage.getItem('phone') || "123-456-7890");
    const [email, setEmail] = useState(() => localStorage.getItem('email') || "email@example.com");
    const [password, setPassword] = useState(() => localStorage.getItem('password') || "tryndameregoat");

    const [isEditing, setIsEditing] = useState<Record<UserField, boolean>>({
        firstName: false,
        lastName: false,
        birthName: false,
        phone: false,
        email: false,
        password: false,
    });

    const [isVisible, setIsVisible] = useState(true);

    const handleEditClick = (field: UserField) => {
        setIsEditing((prev) => ({ ...prev, [field]: true }));
    };

    const handleInputChange = (field: UserField, value: string) => {
        switch (field) {
            case 'firstName':
                setFirstName(value);
                break;
            case 'lastName':
                setLastName(value);
                break;
            case 'birthName':
                setBirthName(value);
                break;
            case 'phone':
                setPhone(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
        }
    };

    const handleBlur = (field: UserField) => {
        setIsEditing((prev) => ({ ...prev, [field]: false }));
    };
    
    const handleSave = () => {
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        localStorage.setItem('birthName', birthName);
        localStorage.setItem('phone', phone);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);

        console.log('User data saved', { firstName, lastName, birthName, phone, email, password });
        setIsVisible(false);
    };

    const handleCancel = () => {
        setIsVisible(false);
    };

    const EditableField = ({
        label,
        value,
        onChange,
        isEditing,
        onEditClick,
        onBlur,
    }: {
        label: string;
        value: string;
        onChange: (value: string) => void;
        isEditing: boolean;
        onEditClick: () => void;
        onBlur: () => void;
    }) => (
        <div className={styles.infoItem}>
            <div className={`${styles.rectangle} ${isNightMode ? styles['night-mode-rectangle'] : ''}`}>
                {isEditing ? (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onBlur}
                        autoFocus
                        className={`${styles.editInput} ${isNightMode ? styles['night-mode-editInput'] : ''}`}
                    />
                ) : (
                    <p onClick={onEditClick}>
                        <strong>{label}:</strong> {value}
                        <EditIcon className={styles.editIcon} />
                    </p>
                )}
            </div>
        </div>
    );

    return (
        isVisible && (
            <div className={`${styles.userCard} ${isNightMode ? styles['night-mode-user-card'] : ''}`}>
                <div className={styles.userInfo}>
                    <h3 className={`${styles.username} ${isNightMode ? styles['night-mode-username'] : ''}`}>{username}</h3>

                    <EditableField
                        label={t('firstname')}
                        value={firstName}
                        onChange={(value) => handleInputChange('firstName', value)}
                        isEditing={isEditing.firstName}
                        onEditClick={() => handleEditClick('firstName')}
                        onBlur={() => handleBlur('firstName')}
                    />
                    <EditableField
                        label={t('lastname')}
                        value={lastName}
                        onChange={(value) => handleInputChange('lastName', value)}
                        isEditing={isEditing.lastName}
                        onEditClick={() => handleEditClick('lastName')}
                        onBlur={() => handleBlur('lastName')}
                    />
                    <EditableField
                        label={t('birthday')}
                        value={birthName}
                        onChange={(value) => handleInputChange('birthName', value)}
                        isEditing={isEditing.birthName}
                        onEditClick={() => handleEditClick('birthName')}
                        onBlur={() => handleBlur('birthName')}
                    />
                    <EditableField
                        label={t('phone')}
                        value={phone}
                        onChange={(value) => handleInputChange('phone', value)}
                        isEditing={isEditing.phone}
                        onEditClick={() => handleEditClick('phone')}
                        onBlur={() => handleBlur('phone')}
                    />
                    <EditableField
                        label={t('email')}
                        value={email}
                        onChange={(value) => handleInputChange('email', value)}
                        isEditing={isEditing.email}
                        onEditClick={() => handleEditClick('email')}
                        onBlur={() => handleBlur('email')}
                    />
                    <EditableField
                        label={t('password')}
                        value={password ? '••••••••' : 'Not Set'}
                        onChange={(value) => handleInputChange('password', value)}
                        isEditing={isEditing.password}
                        onEditClick={() => handleEditClick('password')}
                        onBlur={() => handleBlur('password')}
                    />

                    <div className={styles.buttonContainer}>
                        <button className={styles.cancelButton} onClick={handleCancel}>{t('cancel')}</button>
                        <button className={styles.saveButton} onClick={handleSave}>{t('save')}</button>
                    </div>
                </div>
            </div>
        )
    );
};

export default UserCard;
