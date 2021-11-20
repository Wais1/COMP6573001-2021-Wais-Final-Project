import { FaTimes } from 'react-icons/fa'
import { useState, useEffect } from 'react';

// Returns task duration in seconds
const getTaskDuration = (taskStartDate) => {
    // Convert JSON to Date object
    const timeStart = new Date(taskStartDate);
    // Get current time
    const timeEnd = new Date();

    // calculate time passed with getTime, divide ms by 1000 to store seconds
    const secondsPassed = Math.floor(Math.abs(( timeStart.getTime() - timeEnd.getTime() ) / 1000)) 

    return(secondsPassed)
}

const Task = ({task, onDelete, onToggle}) => {
    return (
        <div className={`task ${task.reminder ? 'reminder' : ''}`} onDoubleClick={() => onToggle(task.id, getTaskDuration(task.timeStart))}>
            <h3>{task.text}  {Math.floor(task.totalDuration / 60) + ' minutes'} <FaTimes style={{color: 'red', cursor: 'pointer' }} onClick={() => onDelete(task.id)}/></h3>
            <p>{task.day} { task.isActive? (getTaskDuration(task.timeStart) > 60 ? Math.floor(getTaskDuration(task.timeStart)/60) + ' minutes' : getTaskDuration(task.timeStart) + ' seconds') : ''}  </p>
        </div>
    )
}

export default Task
