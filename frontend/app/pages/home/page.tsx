"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import style from './Home.module.css';
import { fetchServices, fetchActions, fetchReactions, fetchMethodParams, addArea, fetchAreas, deleteAreaById } from './api';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '../../features/ThemeContext';
import { useTranslations } from '../../translation/useTranslations'; 

const Home: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [services, setServices] = useState<string[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [loadingAreas, setLoadingAreas] = useState<boolean>(false);
  const [loadingServices, setLoadingServices] = useState<boolean>(false);
  const [selectedActionService, setSelectedActionService] = useState<string | null>(null);
  const [selectedReactionService, setSelectedReactionService] = useState<string | null>(null);
  const [actions, setActions] = useState<string[]>([]);
  const [loadingActions, setLoadingActions] = useState<boolean>(false);
  const [reactions, setReactions] = useState<string[]>([]);
  const [loadingReactions, setLoadingReactions] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<{ method: string; params: Record<string, any> }>({ method: '', params: {} });
  const [selectedReaction, setSelectedReaction] = useState<{ method: string; params: Record<string, any> }>({ method: '', params: {} });
  const [methodParams, setMethodParams] = useState<string[]>([]);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [isActionParamsSaved, setIsActionParamsSaved] = useState<boolean>(false);
  const [isReactionParamsSaved, setIsReactionParamsSaved] = useState<boolean>(false);
  const [currentMethodType, setCurrentMethodType] = useState<'action' | 'reaction' | null>(null);
  const [deleteAreaId, setDeleteAreaId] = useState<string>('');
  const [showServicesInActions, setShowServicesInActions] = useState(false);
  const [showServicesInReactions, setShowServicesInReactions] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const { isNightMode } = useTheme();
  const { t } = useTranslations();

  useEffect(() => {
    const fetchAllServices = async () => {
      setLoadingServices(true);
      const fetchedServices = await fetchServices();
      setServices(fetchedServices);
      setLoadingServices(false);
    };
    fetchAllServices();
  }, []);

  useEffect(() => {
    const loadAreas = async () => {
      setLoadingAreas(true);
      const fetchedAreas = await fetchAreas();
      setAreas(fetchedAreas);
      setLoadingAreas(false);
    };
    loadAreas();
  }, []);  

  const handleServiceSelect = async (service: string, type: 'action' | 'reaction') => {
    if (type === 'action') {
      setSelectedActionService(service);
      setLoadingActions(true);
      const fetchedActions = await fetchActions(service);
      setActions(fetchedActions);
      setLoadingActions(false);
      
      
      setSelectedAction({ method: '', params: {} });
      setIsActionParamsSaved(false);
      setCurrentMethodType(null);
    } else {
      setSelectedReactionService(service);
      setLoadingReactions(true);
      const fetchedReactions = await fetchReactions(service);
      setReactions(fetchedReactions);
      setLoadingReactions(false);
      
      
      setSelectedReaction({ method: '', params: {} });
      setIsReactionParamsSaved(false);
      setCurrentMethodType(null);
    }
    
    
    setMethodParams([]);
    setParamValues({});
  };

  const handleMethodClick = async (type: 'action' | 'reaction', method: string) => {
    if (type === 'action' && selectedActionService) {
      const params = await fetchMethodParams(selectedActionService, method);
      setMethodParams(params);
      setCurrentMethodType('action');
      setSelectedAction({ method, params: {} });
    } else if (type === 'reaction' && selectedReactionService) {
      const params = await fetchMethodParams(selectedReactionService, method);
      setMethodParams(params);
      setCurrentMethodType('reaction');
      setSelectedReaction({ method, params: {} });
    }
    setParamValues({});
  };

  const handleParamChange = (param: string, value: string) => {
    setParamValues((prev) => ({
      ...prev,
      [param]: value,
    }));
  };

  const handleSaveParams = () => {
    const completedParams = methodParams.reduce((acc, param) => {
      acc[param] = paramValues[param] || ""; 
      return acc;
    }, {});

    if (currentMethodType === 'action') {
      setSelectedAction((prev) => ({ ...prev, params: completedParams }));
      setIsActionParamsSaved(true);
    } else if (currentMethodType === 'reaction') {
      setSelectedReaction((prev) => ({ ...prev, params: completedParams }));
      setIsReactionParamsSaved(true);
    }

    setMethodParams([]);
    setParamValues({});
    setCurrentMethodType(null);
  };  

  const handleAddArea = async () => {
    if (!isActionParamsSaved || !isReactionParamsSaved) {
      alert("Please select and fill in all required fields for both action and reaction.");
      return;
    }

    const action = { 
      service: selectedActionService!, 
      method: selectedAction.method, 
      params: selectedAction.params 
    };
    
    const reaction = { 
      service: selectedReactionService!, 
      method: selectedReaction.method, 
      params: selectedReaction.params 
    };
    
    const areaJson = { action, reaction };
    console.log("JSON to be sent:", JSON.stringify(areaJson, null, 2));

    const success = await addArea(action, reaction);
    if (success) {
      alert("Area added successfully!");
      const updatedAreas = await fetchAreas();
      setAreas(updatedAreas);
    } else {
      alert("Failed to add area.");
    }
  }; 

  const handleDeleteArea = async (areaId: string) => {
    const success = await deleteAreaById(areaId);
    if (success) {
      alert("Area deleted successfully!");
      const updatedAreas = await fetchAreas();
      setAreas(updatedAreas);
    } else {
      alert("Failed to delete area. Please check the ID and try again.");
    }
  };

  const isAddAreaEnabled = isActionParamsSaved && isReactionParamsSaved;

  return (
    <div  className={`${style.container} ${isNightMode ? style['container-night'] : ''}`}>
      <Navbar />
      <Sidebar onToggle={(isOpen) => setIsSidebarOpen(isOpen)} />

      <div className={`${style.leftSection} ${isNightMode ? style['leftSection-night'] : ''}`}>
        <div className={`${style.areasSection} ${isNightMode ? style['areasSection-night'] : ''}`}>
          <h3 className={`${style.areasSectionTitle} ${isNightMode ? style['areasSectionTitle-night'] : ''}`}>{t('ExistingArea')}</h3>
          {loadingAreas ? (
            <p>{t('loadingArea')}</p>
          ) : areas.length > 0 ? (
            <ul>
              {areas.map((area, index) => (
                <li key={index} className={style.areaItem}>
                  <div className={style.areaContent}>
                    <div>
                      <strong>ID:</strong> {area._id} <br />
                      <strong>{t('service')}:</strong> {area.action.service} - <strong>{t('method')}:</strong> {area.action.method}
                      <br />
                      <strong>{t('reaction')}:</strong> {area.reaction.method}
                    </div>
                    <button
                      className={style.closeButton}
                      onClick={() => handleDeleteArea(area._id)}
                    >
                      <CloseIcon fontSize="small" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>{t('noarea')}</p>
          )}
        </div>
      </div>

      <div className={`${style.rightSection} ${isNightMode ? style['rightSection-night'] : ''}`}>
        <div className={`${style.contentBubble} ${isNightMode ? style['contentBubble-night'] : ''}`}>
          <div className={style.content}>
            <div className={style.section}>
            <h2 className={`${style.sectionTitle} ${isNightMode ? style['sectionTitle-night'] : ''}`}>{t('actions')}</h2>
              <button className={style.button} onClick={() => setShowServicesInActions((prev) => !prev)}>
                {showServicesInActions ? t('hideS') : t('showS')}
              </button>
              {showServicesInActions && (
                  <ul className={`${style.serviceList} ${isNightMode ? style['serviceList-night'] : ''}`}>
                  {loadingServices ? (
                    <li>{t('loadingService')}</li>
                  ) : (
                    services.map((service) => (
                      <li
                        key={service}
                        className={`${style.serviceListItem} ${isNightMode ? style['serviceListItem-night'] : ''}`}
                        onClick={() => handleServiceSelect(service, 'action')}
                      >
                        {service}
                      </li>
                    ))
                  )}
                </ul>
              )}
              {selectedActionService && (
                <>
                  <button className={style.actionButton} onClick={() => setShowActions((prev) => !prev)}>
                    {showActions ? t('hideA') : t('showA')}
                  </button>
                  {showActions && (
                    <div className={style.sectionContent}>
                        <ul className={`${style.actionList} ${isNightMode ? style['actionList-night'] : ''}`}>
                        {loadingActions ? (
                          <li>{t('loadingAction')}</li>
                        ) : (
                          actions.map((method) => (
                            <li
                              key={method}
                              className={`${style.actionListItem} ${isNightMode ? style['actionListItem-night'] : ''}`}
                              onClick={() => handleMethodClick('action', method)}
                            >
                              {method}
                            </li>
                          ))
                        )}
                      </ul>
                      {currentMethodType === 'action' && methodParams.length > 0 && (
                        <div className={style.overlay}>
                          <div className={style.methodParams}>
                            <h3>{t('paramA')}:</h3>
                            <ul>
                              {methodParams.map((param, index) => (
                                <li key={index}>
                                  <label>
                                    {param}:
                                    <input
                                      type="text"
                                      value={paramValues[param] || ''}
                                      onChange={(e) => handleParamChange(param, e.target.value)}
                                      placeholder={`Enter ${param}`}
                                    />
                                  </label>
                                </li>
                              ))}
                            </ul>
                            {Object.values(paramValues).every((value) => value !== '') && (
                              <button onClick={handleSaveParams}>{t('save')}</button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className={style.section}>
            <h2 className={`${style.sectionTitle} ${isNightMode ? style['sectionTitle-night'] : ''}`}>{t('reactions')}</h2>
              <button className={style.button} onClick={() => setShowServicesInReactions((prev) => !prev)}>
                {showServicesInReactions ? t('hideS') : t('showS')}
              </button>
              {showServicesInReactions && (
                 <ul className={`${style.serviceList} ${isNightMode ? style['serviceList-night'] : ''}`}>
                  {loadingServices ? (
                    <li>{t('loadingService')}</li>
                  ) : (
                    services.map((service) => (
                      <li
                        key={service}
                        className={`${style.serviceListItem} ${isNightMode ? style['serviceListItem-night'] : ''}`}
                        onClick={() => handleServiceSelect(service, 'reaction')}
                      >
                        {service}
                      </li>
                    ))
                  )}
                </ul>
              )}
              {selectedReactionService && (
                <>
                  <button className={style.reactionButton} onClick={() => setShowReactions((prev) => !prev)}>
                    {showReactions ? t('hideR') : t('showR')}
                  </button>
                  {showReactions && (
                    <div className={style.sectionContent}>
                       <ul className={`${style.reactionList} ${isNightMode ? style['reactionList-night'] : ''}`}>
                        {loadingReactions ? (
                          <li>{t('loadingReaction')}</li>
                        ) : (
                          reactions.map((method) => (
                            <li
                              key={method}
                              className={`${style.reactionListItem} ${isNightMode ? style['reactionListItem-night'] : ''}`}
                              onClick={() => handleMethodClick('reaction', method)}
                            >
                              {method}
                            </li>
                          ))
                        )}
                      </ul>
                      {currentMethodType === 'reaction' && methodParams.length > 0 && (
                        <div className={style.overlay}>
                          <div className={style.methodParams}>
                            <h3>{t('paramR')}:</h3>
                            <ul>
                              {methodParams.map((param, index) => (
                                <li key={index}>
                                  <label>
                                    {param}:
                                    <input
                                      type="text"
                                      value={paramValues[param] || ''}
                                      onChange={(e) => handleParamChange(param, e.target.value)}
                                      placeholder={`Enter ${param}`}
                                    />
                                  </label>
                                </li>
                              ))}
                            </ul>
                            {Object.values(paramValues).every((value) => value !== '') && (
                              <button onClick={handleSaveParams}>{t('save')}</button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <button className={style.addAreaButton} onClick={handleAddArea} disabled={!isAddAreaEnabled}>
              {t('add')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
