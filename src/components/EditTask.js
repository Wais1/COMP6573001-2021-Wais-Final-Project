import { useState } from 'react'

const EditTask = ({ onEdit }) => {
    const [text, setText] = useState('')
    const [day, setDay] = useState('')
    // const [reminder, setReminder] = useState(false)
    const [isActive, setIsActive] = useState(false)
    const [totalDuration, setTotalDuration] = useState(0)
    const [timeStart, setTimeStart] = useState(Date.now())

    // Error prevention before add task with onAdd
    const onSubmit = (e) => {
        e.preventDefault()

        // if(!text) {
        //     alert('Please fill edit detail')
        //     return
        // }
        
        // Start making a new date, then add to the database, and continue
        const timeStart = new Date();

        // Call onAdd to add task.
        onEdit({ text, day, totalDuration })        

        // Reset fields
        setText('')
        setDay('')
        // setReminder(false)
    }

    return (
        <div>
            <form className="add-form" onSubmit={onSubmit}>
            <br></br><h2>Edit Task</h2>
            <div className='form-control'>
                    <label>Task</label>
                    <input type="text" placeholder='Task Name' value={text} onChange={(e) => setText(e.target.value) } />
            </div>
            <div className='form-control'>
                    <label>Day and Time</label>
                    <input type="text" placeholder='Date and Time' value={day} onChange={(e) => setDay(e.target.value) }  />
            </div>
            <div className='form-control'>
                    <label>Total duration</label>
                    <input type="text" placeholder='Total duration' value={totalDuration} onChange={(e) => setTotalDuration(parseInt(e.target.value)) }  />
            </div>
            {/* <div className='form-control form-control-check'>
                    <label>Set Reminder</label>
                    <input type="checkbox" checked={reminder} value={reminder} onChange={(e) => setReminder(e.currentTarget.checked) } />
            </div> */}
                <input type='submit' value ='Save Task' className='btn btn-block' />
            </form>
        </div>
    )
}

export default EditTask
