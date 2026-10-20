import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import ServiceList from './ServiceList';
import ActionsReactions from './ActionsReactions';
import style from './Create.module.css';

type CreateSecondProps = {
  isSidebarOpen: boolean;
  contentStyle: React.CSSProperties;
  loadingServices: boolean;
  services: string[];
  selectedService: string | null;
  loadingActions: boolean;
  loadingReactions: boolean;
  actions: string[];
  reactions: string[];
  methodParams: string[];
  paramValues: Record<string, string>;
  currentMethodType: 'action' | 'reaction' | null;
  areas: any[];
  loadingAreas: boolean;
  deleteAreaId: string;
  isAddAreaEnabled: boolean;
  onServiceSelect: (service: string) => void;
  onMethodClick: (type: 'action' | 'reaction', method: string) => void;
  onParamChange: (param: string, value: string) => void;
  onSaveParams: () => void;
  onAddArea: () => void;
  onDeleteArea: () => void;
  setDeleteAreaId: (value: string) => void;
};

const CreateSecond: React.FC<CreateSecondProps> = ({
  isSidebarOpen,
  contentStyle,
  loadingServices,
  services,
  selectedService,
  loadingActions,
  loadingReactions,
  actions,
  reactions,
  methodParams,
  paramValues,
  currentMethodType,
  areas,
  loadingAreas,
  deleteAreaId,
  isAddAreaEnabled,
  onServiceSelect,
  onMethodClick,
  onParamChange,
  onSaveParams,
  onAddArea,
  onDeleteArea,
  setDeleteAreaId,
}) => {
  return (
    <div className={style.container}>
      <Navbar />
      <Sidebar onToggle={() => {}} />
      <div className={style.content} style={contentStyle}>
        {loadingServices ? (
          <p>Loading services...</p>
        ) : (
          <ServiceList services={services} onSelectService={onServiceSelect} />
        )}

        {selectedService && (
          <div>
            {loadingActions ? (
              <p>Loading actions...</p>
            ) : (
              <ActionsReactions type="actions" items={actions} onItemClick={(method) => onMethodClick('action', method)} />
            )}

            {loadingReactions ? (
              <p>Loading reactions...</p>
            ) : (
              <ActionsReactions type="reactions" items={reactions} onItemClick={(method) => onMethodClick('reaction', method)} />
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
                          onChange={(e) => onParamChange(param, e.target.value)} 
                          placeholder={`Enter ${param}`} 
                        />
                      </label>
                    </li>
                  ))}
                </ul>
                {Object.values(paramValues).every((value) => value !== '') && (
                  <button onClick={onSaveParams}>Save</button>
                )}
              </div>
            )}

            <button onClick={onAddArea} disabled={!isAddAreaEnabled}>Add Area</button>
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
          <button onClick={onDeleteArea}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default CreateSecond;
