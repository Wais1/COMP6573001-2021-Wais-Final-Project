import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import EditTask from './components/EditTask'
import About from './components/About'


function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [showEditTask, setShowEditTask] = useState(false)
  const [editTaskID, setEditTaskID] = useState(-1)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  // Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data;
  }

  // Fetch Task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()

    return data;
  }




  // Add Task
  const addTask = async (task) => {
    const res = await fetch(`http://localhost:5000/tasks/`, {
      method: `POST`,
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    // New task that is added
    const data = await res.json()

    setTasks([...tasks, data])

    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask])

  }


  // Edits a task
  const editTask = async (editedTask) => {

    // Filter target task to edit, so we use 0 to get the only array index sine filter returns an array.
    var curTask = tasks.filter((task) => task.id === editTaskID)[0]

    // Merges edited task with current, if edited one is not empty
    var updTask = {
      ...curTask, text: editedTask.text === '' ? curTask.text : editedTask.text,
      day: !editedTask.day ? curTask.day : editedTask.day,
      totalDuration: !editedTask.totalDuration ? curTask.totalDuration : editedTask.totalDuration
    }

    // Update at editTaskID
    const res = await fetch(`http://localhost:5000/tasks/${editTaskID}`, {
      method: `PUT`,
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updTask)
    })

    // Updated task from db
    const data = await res.json()
    setTasks(tasks.map((task) => task.id === editTaskID ? {
      ...task, text: data.text, day: data.day, isActive: data.isActive,
      timeStart: data.timeStart, totalDuration: data.totalDuration, reminder: data.reminder
    } : task))
  }

  // Edit helper function. sets showEditTask, and ID of task to be edited later (that was clicked).
  const editHelper = (taskID) => {
    setEditTaskID(taskID)         // set task ID to be edited from click
    setShowEditTask(!showEditTask)   // Toggle display of edit task if the id is the same. should use callback, since setState is not immediate, there is delay
  }

  // Refreshes tasks each second.
  useEffect(() => {
    const timer = setInterval(() => { // Creates an interval which will update the current data every second
      // setTasks([...tasks, {"Test": "test"} ]);
      setTasks(tasks.map((task) => task.id === -1 ? { ...task, day: '1' } : task))
    }, 1000);
    return () => {
      clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
    }
  }, [tasks]);

  // Toggle reminder / New: Toggle active
  const toggleReminder = async (id, curTaskDuration) => {
    const taskToToggle = await fetchTask(id) // Done through server, can do locally first then update server?

    var updTask; // Declare updTask variable

    // If is off, turn on and start the new Date() for timeStart
    if (!taskToToggle.reminder) {
      console.log("Test")
      const currTime = new Date()
      // Toggles on and adds info
      updTask = { ...taskToToggle, isActive: true, timeStart: currTime, reminder: !taskToToggle.reminder }
      console.log(updTask)
    }

    // If is currently on, should add current time to the total time, and toggle off.
    if (taskToToggle.reminder) {

      // Update task's total duration with time just spent in seconds.
      const newTotalDuration = taskToToggle.totalDuration += curTaskDuration
      // Toggles off and adds info
      updTask = { ...taskToToggle, isActive: false, totalDuration: newTotalDuration, reminder: !taskToToggle.reminder }
      console.log(updTask)
      console.log(updTask.totalDuration)
    }

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: `PUT`,
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updTask)
    })

    // Stores the updated task
    const data = await res.json()

    setTasks(tasks.map((task) => task.id === id ? { ...task, isActive: data.isActive, timeStart: data.timeStart, totalDuration: data.totalDuration, reminder: data.reminder } : task))
  }

  // // Toggle reminder / New: Toggle active
  // const toggleReminder = async (id) => {
  //   const taskToToggle = await fetchTask(id)
  //   const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder}

  //   const res = await fetch(`http://localhost:5000/tasks/${id}`, { 
  //     method: `PUT`,
  //     headers: {
  //       'Content-type': 'application/json'
  //     },
  //     body: JSON.stringify(updTask)
  //   })

  //   // Stores the updated task
  //   const data = await res.json()

  //   setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: data.reminder} : task))
  // }

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' })

    setTasks(tasks.filter((task) => task.id !== id))
  }


  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />

        <Routes>
          <Route path='/' exact element={
            <>
              {showAddTask && <AddTask onAdd={addTask} />}
              {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} onEdit={editHelper} /> : 'No Tasks To Show'}
              {showEditTask && <EditTask onEdit={editTask} editTaskID={editTaskID} />}
            </>
          } />
          <Route path='about' element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}


export default App;