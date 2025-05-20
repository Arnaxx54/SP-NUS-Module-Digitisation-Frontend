import { Button, Typography } from '@mui/material';
import './Stylesheets/Boilerplate.css'

const Boilerplate = ({ activityLabel, label, instruction, isInstructor, setInstruction, setLabel}) => {

    const handleLabelChange = (e) => {
        setLabel(e.currentTarget.innerHTML)
    }

    const handleInstructionChange = (e) => {
        setInstruction(e.currentTarget.innerHTML)
    }

    return (
        <>
            <div className='header-activity'>

                {/*activity label*/}
                <h2 onBlur={handleLabelChange} dangerouslySetInnerHTML={{ __html: ` ${label}` }} contentEditable="true" id={`activity-${activityLabel}-label`}></h2>

                <Button onClick={() => { window.location.reload(); }} className="reset-btn">
                    Reset
                </Button>

            </div>
            {/*activity instruction*/}
            <Typography onBlur={handleInstructionChange} id={`activity-${activityLabel}-instruction`} dangerouslySetInnerHTML={{ __html: ` ${instruction}` }} contentEditable={isInstructor} className="instructions"></Typography>

        </>

    )
}

export default Boilerplate