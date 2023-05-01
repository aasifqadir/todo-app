import { useState, useEffect } from 'react';
import './App.css'
function App() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await fetch('http://localhost:3001/items');
    const data = await response.json();
    setItems(data);
  };

  const addItem = async (newItem) => {
    const response = await fetch('http://localhost:3001/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });
    const data = await response.json();
    setItems([...items, data]);
  };

  const updateItem = async (id, updatedItem) => {
    const response = await fetch(`http://localhost:3001/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedItem)
    });
    const data = await response.json();
    setItems(
      items.map((item) => (item.id === id ? { ...data } : item))
    );
    setSelectedItem(null);
  };

  const deleteItem = async (id) => {
    await fetch(`http://localhost:3001/items/${id}`, {
      method: 'DELETE'
    });
    setItems(items.filter((item) => item.id !== id));
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
  };

  const handleCancel = () => {
    setSelectedItem(null);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    const updatedItem = {
      id: selectedItem.id,
      name: event.target.name.value,
      description: event.target.description.value
    };
    updateItem(selectedItem.id, updatedItem);
    event.target.reset();
  };

  return (
    <div className="App">
      <h1>My CRUD App</h1>

      {!selectedItem ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const newItem = {
              name: event.target.name.value,
              description: event.target.description.value
            };
            addItem(newItem);
            event.target.reset();
          }}
        >
          <label>Name:</label>
          <input type="text" name="name" required />
          <label>Description:</label>
          <input type="text" name="description" required />
          <button type="submit">Add Item</button>
        </form>
      ) : (
        <form onSubmit={handleUpdate}>
          <label>Name:</label>
          <input type="text" name="name" defaultValue={selectedItem.name} required />
          <label>Description:</label>
          <input type="text" name="description" defaultValue={selectedItem.description} required />
          <button type="submit">Update Item</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
      )}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <p> {item.name} - {item.description}</p>
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button type='button' onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
