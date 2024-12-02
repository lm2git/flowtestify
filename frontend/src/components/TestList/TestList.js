import React from 'react';
import './TestList.css';
import '../../styles/Dashboard.css';

const TestList = ({ tests, isLoading, onTestClick, fetchTests }) => {
  const handleRunTest = async (testId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/tests/${testId}/run`, { method: 'POST' });
      const result = await response.json();

      if (response.ok) {
        alert('Test completato con successo');
      } else {
        alert(`Errore durante il test: ${result.message}`);
      }

      // Aggiorna i test dopo l'esecuzione
      fetchTests(); // Chiamata per ricaricare l'elenco dei test
    } catch (error) {
      console.error('Errore durante l\'esecuzione del test:', error);
      alert('Errore durante l\'esecuzione del test');
    }
  };

  if (isLoading) return <p>Caricamento...</p>;

  return (
    <div className="test-list">
      {Array.isArray(tests) && tests.length > 0 ? (
        tests.map((test, index) => (
          <div
            key={test._id || index}
            className={`test-card ${test.status || 'pending'}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <h3>{test.name}</h3>
            <p>
              Stato: 
              <span className={`status-label ${test.status || 'pending'}`}>
                {test.status === 'success' 
                  ? 'Successo' 
                  : test.status === 'failure' 
                  ? 'Fallito' 
                  : 'In attesa'}
              </span>
            </p>
            <div className="test-actions">
              <button onClick={() => onTestClick(test)}>Dettagli</button>
              <button onClick={() => handleRunTest(test._id)}>Esegui Test</button>
            </div>
          </div>
        ))
      ) : (
        <p>Nessun test trovato.</p>
      )}
    </div>
  );
};

export default TestList;
