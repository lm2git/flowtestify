import React, { useState, useEffect } from 'react';
import './TestPopup.css';

const TestPopup = ({ selectedTest, setSelectedTest }) => {
  const [newStepDescription, setNewStepDescription] = useState('');
  const [newStepActionType, setNewStepActionType] = useState('');
  const [newStepValue, setNewStepValue] = useState('');
  const [currentTest, setCurrentTest] = useState(selectedTest); // Stato locale per i dettagli aggiornati del test

  // Funzione per recuperare gli step attuali del test
  const fetchTestSteps = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/tests/${selectedTest._id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCurrentTest(data.test); // Aggiorna i dettagli del test con gli step aggiornati
      } else {
        alert(`Errore nel recupero degli step: ${data.message}`);
      }
    } catch (error) {
      console.error('Errore di rete:', error);
      alert('Errore nel recupero degli step.');
    }
  };

  // Effettua il fetch degli step quando il popup si apre
  useEffect(() => {
    fetchTestSteps();
  }, [selectedTest]);

  const handleAddStep = async () => {
    if (!newStepDescription.trim() || !newStepActionType.trim()) {
      alert('Descrizione e tipo di azione sono obbligatori.');
      return;
    }
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/tests/${selectedTest._id}/steps`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: newStepDescription,
            actionType: newStepActionType,
            value: newStepValue,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert('Step aggiunto con successo.');
        fetchTestSteps(); // Ricarica gli step aggiornati dopo l'aggiunta
        setNewStepDescription('');
        setNewStepActionType('');
        setNewStepValue('');
      } else {
        alert(`Errore: ${data.message}`);
      }
    } catch (error) {
      console.error('Errore di rete:', error);
      alert("Errore nell'aggiunta dello step.");
    }
  };

  const handleSaveAndClose = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/tests/${selectedTest._id}/update`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: currentTest.name, // Nome test
            steps: currentTest.steps, // Steps aggiornati
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSelectedTest(null); // Chiudi il popup
      } else {
        alert(`Errore durante il salvataggio: ${data.message}`);
      }
    } catch (error) {
      console.error('Errore di rete:', error);
      alert('Errore durante il salvataggio del test.');
    }
  };

  if (!currentTest) {
    return null; // Mostra nulla se il test non è ancora caricato
  }

  return (
    <div className="test-popup">
      <div className="test-popup-content">
        <h2>{currentTest.name}</h2>
        <p>{currentTest.description}</p>
        <h3>Steps</h3>
        <ul>
          {currentTest.steps && currentTest.steps.length > 0 ? (
            currentTest.steps.map((step, index) => (
              <li key={index}>
                <p><strong>{step.actionType}</strong></p>
                <p>{step.description}</p>
              </li>
            ))
          ) : (
            <p>Nessun step disponibile</p>
          )}
        </ul>
        <div>
          <h3>Aggiungi un nuovo step</h3>
          <input
            type="text"
            placeholder="Descrizione"
            value={newStepDescription}
            onChange={(e) => setNewStepDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tipo di azione"
            value={newStepActionType}
            onChange={(e) => setNewStepActionType(e.target.value)}
          />
          <input
            type="text"
            placeholder="Valore (opzionale)"
            value={newStepValue}
            onChange={(e) => setNewStepValue(e.target.value)}
          />
          <button onClick={handleAddStep}>Aggiungi Step</button>
        </div>
        <button onClick={handleSaveAndClose}>Salva e Chiudi</button>
      </div>
    </div>
  );
};

export default TestPopup;
