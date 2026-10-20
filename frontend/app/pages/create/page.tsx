"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import ServiceList from './ServiceList';
import ActionsReactions from './ActionsReactions';
import { fetchServices, fetchActions, fetchReactions, fetchMethodParams, addArea, fetchAreas, deleteAreaById } from './api';
import style from './Create.module.css';

const Create: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [services, setServices] = useState<string[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [loadingAreas, setLoadingAreas] = useState<boolean>(false);
  const [loadingServices, setLoadingServices] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
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
      console.log("Existing Areas with IDs:", fetchedAreas.map((area: any) => ({ id: area._id, ...area })));
    };
    loadAreas();
  }, []);  

  const handleServiceSelect = async (service: string) => {
    setSelectedService(service);
    setLoadingActions(true);
    setLoadingReactions(true);

    const fetchedActions = await fetchActions(service);
    const fetchedReactions = await fetchReactions(service);

    setActions(fetchedActions);
    setReactions(fetchedReactions);
    setLoadingActions(false);
    setLoadingReactions(false);

    setMethodParams([]);
    setParamValues({});
    setSelectedAction({ method: '', params: {} });
    setSelectedReaction({ method: '', params: {} });
    setIsActionParamsSaved(false);
    setIsReactionParamsSaved(false);
    setCurrentMethodType(null);
  };

  const handleMethodClick = async (type: 'action' | 'reaction', method: string) => {
    if (selectedService) {
      const params = await fetchMethodParams(selectedService, method);
      setMethodParams(params);
      setParamValues({});
      setCurrentMethodType(type);

      if (type === 'action') {
        setSelectedAction({ method, params: {} });
      } else {
        setSelectedReaction({ method, params: {} });
      }
    }
  };

  const handleParamChange = (param: string, value: string) => {
    setParamValues((prev) => ({
      ...prev,
      [param]: value,
    }));
  };

  const handleSaveParams = () => {
    if (currentMethodType === 'action') {
      setSelectedAction((prev) => ({ ...prev, params: paramValues }));
      setIsActionParamsSaved(true);
      console.log("Action parameters saved:", paramValues);
    } else if (currentMethodType === 'reaction') {
      setSelectedReaction((prev) => ({ ...prev, params: paramValues }));
      setIsReactionParamsSaved(true);
      console.log("Reaction parameters saved:", paramValues);
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
      service: selectedService!, 
      method: selectedAction.method, 
      params: selectedAction.params 
    };
    
    const reaction = { 
      service: selectedService!, 
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
    console.log("Existing Areas:", areas);
  };

  const handleDeleteArea = async () => {
    if (!deleteAreaId) {
      alert("Please enter a valid Area ID.");
      return;
    }

    const success = await deleteAreaById(deleteAreaId);
    if (success) {
      alert("Area deleted successfully!");
      setDeleteAreaId('');
      const updatedAreas = await fetchAreas();
      setAreas(updatedAreas);
    } else {
      alert("Failed to delete area. Please check the ID and try again.");
    }
  };

  const isAddAreaEnabled = isActionParamsSaved && isReactionParamsSaved;

  return (
    <div className={style.container}>
      <Navbar />
      <Sidebar onToggle={setIsSidebarOpen} />

      <div className={style.content}>
        {loadingServices ? (
          <p>Loading services...</p>
        ) : (
          <ServiceList services={services} onSelectService={handleServiceSelect} />
        )}

        {selectedService && (
          <div>
            {loadingActions ? (
              <p>Loading actions...</p>
            ) : (
              <ActionsReactions type="actions" items={actions} onItemClick={(method) => handleMethodClick('action', method)} />
            )}

            {loadingReactions ? (
              <p>Loading reactions...</p>
            ) : (
              <ActionsReactions type="reactions" items={reactions} onItemClick={(method) => handleMethodClick('reaction', method)} />
            )}

            {methodParams.length > 0 && (
              <div>
                <h3>Method Parameters {currentMethodType === 'action' ? 'Action' : 'Reaction'}:</h3>
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
                  <button onClick={handleSaveParams}>Save</button>
                )}
              </div>
            )}

            <button onClick={handleAddArea} disabled={!isAddAreaEnabled}>Add Area</button>
          </div>
        )}

        <div>
          <h3>Existing Areas:</h3>
          {loadingAreas ? (
            <p>Loading areas...</p>
          ) : areas.length > 0 ? (
            <ul>
              {areas.map((area, index) => (
                <li key={index}>
                  <strong>ID:</strong> {area._id} <br />
                  <strong>Service:</strong> {area.action.service} - <strong>Method:</strong> {area.action.method}
                  <br />
                  <strong>Reaction:</strong> {area.reaction.method}
                </li>
              ))}
            </ul>
          ) : (
            <p>No areas available.</p>
          )}
        </div>
        <div style={{ marginTop: '20px' }}>
          <h3>Delete an Area</h3>
          <input 
            type="text" 
            placeholder="Enter Area ID to delete" 
            value={deleteAreaId} 
            onChange={(e) => setDeleteAreaId(e.target.value)} 
          />
          <button onClick={handleDeleteArea}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default Create;
