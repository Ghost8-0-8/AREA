import { useState, useEffect } from 'react';
import {
  fetchServices,
  fetchActions,
  fetchReactions,
  fetchMethodParams,
  addArea,
  fetchAreas,
  deleteAreaById,
} from './api';

export const useHomeLogic = () => {
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

  const contentStyle = {
    marginLeft: isSidebarOpen ? '250px' : '50px',
    transition: 'margin-left 0.3s ease',
  };

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

  return {
    contentStyle,
    isSidebarOpen,
    setIsSidebarOpen,
    services,
    loadingServices,
    areas,
    loadingAreas,
    selectedService,
    actions,
    loadingActions,
    reactions,
    loadingReactions,
    selectedAction,
    selectedReaction,
    methodParams,
    paramValues,
    isAddAreaEnabled,
    deleteAreaId,
    handleServiceSelect,
    handleMethodClick,
    handleParamChange,
    handleSaveParams,
    handleAddArea,
    handleDeleteArea,
    setDeleteAreaId,
    currentMethodType
  };
};
