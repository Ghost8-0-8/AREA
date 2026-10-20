import { useState } from 'react';

export const useCreateState = () => {
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

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    services,
    setServices,
    areas,
    setAreas,
    loadingAreas,
    setLoadingAreas,
    loadingServices,
    setLoadingServices,
    selectedService,
    setSelectedService,
    actions,
    setActions,
    loadingActions,
    setLoadingActions,
    reactions,
    setReactions,
    loadingReactions,
    setLoadingReactions,
    selectedAction,
    setSelectedAction,
    selectedReaction,
    setSelectedReaction,
    methodParams,
    setMethodParams,
    paramValues,
    setParamValues,
    isActionParamsSaved,
    setIsActionParamsSaved,
    isReactionParamsSaved,
    setIsReactionParamsSaved,
    currentMethodType,
    setCurrentMethodType,
    deleteAreaId,
    setDeleteAreaId,
  };
};
