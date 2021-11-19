import { useState } from 'react'

const AddTask = ({ onAdd }) => {

    const [text, setText] = useState('')
    const [day, setDay] = useState('')
    const [reminder, setReminder] = useState(false)

    // Error prevention before add task with onAdd
    const onSubmit = (e) => {
        e.preventDefault()

        if(!text) {
            alert('Please add a task')
            return
        }
        
        // Start making a new date, then add to the database, and continue
        const timeStart = new Date();

        // Call onAdd to add task.
        onAdd({ text, day, reminder, timeStart })

        // Reset fields
        setText('')
        setDay('')
        setReminder(false)
    }

    return (
        <div>
            <form className="add-form" onSubmit={onSubmit}>
            <div className='form-control'>
                    <label>Task</label>
                    <input type="text" placeholder='Add Task' value={text} onChange={(e) => setText(e.target.value) } />
            </div>
            <div className='form-control'>
                    <label>Day and Time</label>
                    <input type="text" placeholder='Add Day and Time' value={day} onChange={(e) => setDay(e.target.value) }  />
            </div>
            <div className='form-control form-control-check'>
                    <label>Set Reminder</label>
                    <input type="checkbox" checked={reminder} value={reminder} onChange={(e) => setReminder(e.currentTarget.checked) } />
            </div>
                <input type='submit' value ='Save Task' className='btn btn-block' />
            </form>
        </div>
    )
}

export default AddTask
