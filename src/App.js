import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faPenToSquare, faTrash, faCheckToSlot } from '@fortawesome/free-solid-svg-icons'
import './App.css';
import  RandomToDo from './random';
import axios from 'axios';
import baseUrl from './baseUrl';

function App() {
  const [todos, setTodos] = useState([])
  const [todo, setTodo] = useState("")
  const [todoEdit, setTodoEdit] = useState(null)
  const [todoTextEdit, setTodoTextEdit] = useState("")


  function getNewData(){
    axios.get(baseUrl)
    .then((getData) => {
      setTodos(getData.data)
    })
  }
  //Creating a GET request with axios
  useEffect(()=>{
    getNewData()
  },[])

  // Creating a DELETE request to axios
  function deleteTodo(id) {
    const newTodos = [...todos].filter((todo) => todo.id !== id)
    setTodos(newTodos)
    axios.delete(`http://localhost:3005/data/${id}`)
    .then(() => {
      getNewData()
    })
  }

  function toggleComplete(id) {
    const newTodos = [...todos].map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed
      }
      return todo
    })
    setTodos(newTodos)
  }

  function editTodo(id) {
    const newTodos = [...todos].map((todo) => {
      if (todo.id === id) {
        todo.text = todoTextEdit
      }
      return todo
    })
      axios.put(`http://localhost:3005/data/${id}`, {
        todo: todoTextEdit,
        completed: false,
      })
      .then(() => {
        getNewData()
      })
    setTodos(newTodos)
    setTodoEdit(null)
    setTodoTextEdit("")
  }

  //Getting a random todo and sending it to the main db
  function getRandom () {
    const newToDo = RandomToDo[(RandomToDo.length * Math.random()) << 0]
    newToDo.id = new Date().getTime()
    setTodos([...todos].concat(newToDo))
    axios.post(baseUrl, {
      todo : newToDo.todo,
      completed : newToDo.completed,
      id : newToDo.id
      // Sending Data
    })
  }

  //Creating a POST request with axios
  const makePostRequest = () => {
    axios.post(baseUrl, {
      todo,
      completed: false,
       // Sending Data
    })
  }

  return (
    <div className="App">
     <div id="first-section">
        <form id="home-form" > 
            <div className="form-floating" htmlFor="name">
            <textarea 
            type="text" 
            onChange={(e) => setTodo(e.target.value)} 
            value={todo}
            name="name"
            className="form-control"
            id="floatingTextarea2"
              >
            </textarea>
            <label htmlFor="floatingTextarea2">Add a new thing to do here!</label>
            </div>
            <button 
            type="submit" 
            className="btn btn-dark" 
            onClick={makePostRequest}>
              Add It!
            </button>
        </form>
  
        <div id="generate-todo">
            <h3><em>Generate a random thing to do!</em></h3>
            <button 
            type="submit" 
            className="btn btn-dark" 
            onClick={() => getRandom()}>
              Generate
            </button>

        </div>
      </div>
      {todos.map((todo) => 
        <div className="card" key={todo.id}>
          {todoEdit === todo.id ? 
          ( 
          <input type="text" 
          placeholder='Write your edit here'
          style={{borderRadius: '10px', margin: '10px'}}
          onChange={(e) => setTodoTextEdit(e.target.value)} 
          value={todoTextEdit}
          />
          ) : 
          ( <h5 className="card-title"> {todo.todo} </h5> )
          }

          <div className="buttons">
          {todo.completed ? 
          (<button className="btn btn-success" 
          onClick={() => toggleComplete(todo.id)}>
            <FontAwesomeIcon icon={faCheck} disabled/> Well Done!
          </button>) : (<button className="btn btn-primary" 
          onClick={() => toggleComplete(todo.id)}>
            <FontAwesomeIcon icon={faCheck} /> 
          </button>)}
          {todoEdit === todo.id ? 
          (<button 
          className="btn btn-success" 
          onClick={() => editTodo(todo.id)}>
            <FontAwesomeIcon icon={faCheckToSlot} /> Save
          </button>)
           : 
          (<button 
          className="btn btn-warning" 
          onClick={() => setTodoEdit(todo.id)}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>)
          }
          <button className="btn btn-danger" 
          onClick={() => deleteTodo(todo.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
          </div>
          
        </div>
      )}
    </div>
  );
}

export default App;
