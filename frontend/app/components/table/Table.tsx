import React from "react";
import styles from "./Table.module.css";
import { useTheme } from '../../features/ThemeContext';


type SoftwareItem = {
  name: string;
  comment: string;
};

type TableProps = {
    softwareList: SoftwareItem[];
    columnNames: [string, string];
  };

  const TableComponent: React.FC<TableProps> = ({ softwareList, columnNames }) => {
    const { isNightMode, toggleTheme } = useTheme();

    return (
      <div className={styles['table-container']}>
        <table className={`${styles.table} ${isNightMode ? styles['night-mode-table'] : ''}`}>
          <thead>
            <tr className={`${styles.tr} ${isNightMode ? styles['night-mode-tr'] : ''}`}>
              <th className={`${styles.th} ${isNightMode ? styles['night-mode-th'] : ''}`}>{columnNames[0]}</th>
              <th className={`${styles.th} ${isNightMode ? styles['night-mode-th'] : ''}`}>{columnNames[1]}</th>
            </tr>
          </thead>
          <tbody>
            {softwareList.map((software, index) => (
              <tr key={index} className={`${styles.tr} ${isNightMode ? styles['night-mode-tr'] : ''}`}>
                <td className={`${styles.td} ${isNightMode ? styles['night-mode-td'] : ''}`}>{software.name}</td>
                <td className={`${styles.td} ${isNightMode ? styles['night-mode-td'] : ''}`}>{software.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }    

export default TableComponent;
