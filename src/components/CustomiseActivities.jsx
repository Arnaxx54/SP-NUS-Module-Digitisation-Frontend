import { Accordion, AccordionDetails, AccordionSummary, Alert, Button, CircularProgress, Dialog, DialogActions, DialogTitle, Divider, FormControlLabel, LinearProgress, MenuItem, Select, Switch, Tooltip, Typography } from '@mui/material';
import './Components.css'

const CustomiseActivities = ({ activity, key }) => {

    const activityTitles = ['Activity 1', 'Activity 2', 'Activity 3', 'Activity 4', 'Activity 5', 'Activity 6']
    const activityLabels = ['one', 'two', 'three', 'four', 'five', 'six'];
    const activityJsonRef = ['activityOne', 'activityTwo', 'activityThree', 'activityFour', 'activityFive', 'activitySix']

    // const activityOneSpecifics = () => {
    //     return (
    //         <>
    //             {/*activity one info text*/}
    //             <Typography className='activity-info-text'>
    //                 To update the transcript, kindly navigate to Activity 1 and implement the necessary modifications.
    //             </Typography>


    //             {/*activity one switch for standardising transcript*/}
    //             <FormControlLabel className='activity-switch'
    //                     control={
    //                         <Switch
    //                             checked={value.activityOne.notEditableTranscript}
    //                             onChange={() => setListOfActivities(prevValues => {
    //                                 const updatedActivity = {
    //                                     ...prevValues[key],
    //                                     activityOne: {
    //                                         ...prevValues[key].activityOne,
    //                                         notEditableTranscript: !prevValues[key].activityOne.notEditableTranscript
    //                                     }
    //                                 };
    //                                 return {
    //                                     ...prevValues,
    //                                     [key]: updatedActivity
    //                                 };
    //                             })}
    //                         />
    //                     }
    //                     label={
    //                         <div style={{ display: 'flex', alignItems: 'center' }}>
    //                             Standardised Script
    //                             <Tooltip title="The transcript is standardized and cannot be edited by students across all template copies.">
    //                                 <InfoIcon style={{ marginLeft: 4 }} fontSize="small" />
    //                             </Tooltip>
    //                         </div>
    //                     }
    //                 />
    //         </>
    //     )
    // }

    // const activityTwoSpecifics = () => {
    //         return (
    //             <>
    //                 {/*activity two switch for standardising highlighting*/}
    //                 <FormControlLabel className='activity-switch'
    //                     control={
    //                         <Switch
    //                             checked={value.activityTwo.highlightingNotAllowed}
    //                             onChange={() => setListOfActivities(prevValues => {
    //                                 const updatedActivity = {
    //                                     ...prevValues[key],
    //                                     activityTwo: {
    //                                         ...prevValues[key].activityTwo,
    //                                         highlightingNotAllowed: !prevValues[key].activityTwo.highlightingNotAllowed
    //                                     }
    //                                 };
    //                                 return {
    //                                     ...prevValues,
    //                                     [key]: updatedActivity
    //                                 };
    //                             })}
    //                         />
    //                     }
    //                     label={
    //                         <div style={{ display: 'flex', alignItems: 'center' }}>
    //                             Standardised Script Highlighting
    //                             <Tooltip title="The highlighting of the script is standardized and cannot be edited by students across all template copies.">
    //                                 <InfoIcon style={{ marginLeft: 4 }} fontSize="small" />
    //                             </Tooltip>
    //                         </div>
    //                     }
    //                 />
    //             </>
    //         )
    // }

    // const activityThreeSpecifics = () => {
    //     return (
    //         <>
    //             <Typography className='activity-info-text'>
    //                 If a machine learning model isn't chosen, no selections based on machine learning will occur.
    //             </Typography>

    //             <Typography className='activity-info-text'>
    //                 Currently selected machine learning model: {value.activityThree.MLModel}
    //             </Typography>

    //             <Typography className='activity-info-text'>
    //                 To choose a different machine learning model, please make your selection from the options below.
    //             </Typography>

    //             {/*activity three dropdown for selecting model*/}
    //             <Select className='activity-switch'
    //                 value={value.activityThree.MLModel}
    //                 onChange={(e) => setListOfActivities(prevValues => {
    //                     const updatedActivity = {
    //                         ...prevValues[key],
    //                         activityThree: {
    //                             ...prevValues[key].activityThree,
    //                             MLModel: e.target.value,
    //                         }
    //                     };
    //                     return {
    //                         ...prevValues,
    //                         [key]: updatedActivity
    //                     };
    //                 })}

    //             >
    //                 <MenuItem value={"None"}>None</MenuItem>
    //                 <MenuItem value={"Model1"}>Model 1</MenuItem>
    //                 <MenuItem value={"Model2"}>Model 2</MenuItem>
    //                 <MenuItem value={"Model3"}>Model 3</MenuItem>
    //                 <MenuItem value={"Model4"}>Model 4</MenuItem>
    //             </Select>

    //             {/*activity three switch for enabling machine learning model selections*/}
    //             <FormControlLabel className='activity-switch'
    //                 control={
    //                     <Switch
    //                         checked={value.activityThree.enableMLModel}
    //                         onChange={() => setListOfActivities(prevValues => {
    //                             const updatedActivity = {
    //                                 ...prevValues[key],
    //                                 activityThree: {
    //                                     ...prevValues[key].activityThree,
    //                                     enableMLModel: !prevValues[key].activityThree.enableMLModel
    //                                 }
    //                             };
    //                             return {
    //                                 ...prevValues,
    //                                 [key]: updatedActivity
    //                             };
    //                         })}
    //                     />
    //                 }
    //                 label={
    //                     <div style={{ display: 'flex', alignItems: 'center' }}>
    //                         Enable Selections Based on Machine Learning Analysis
    //                         <Tooltip title="Grant the machine learning model permission to highlight text.">
    //                             <InfoIcon style={{ marginLeft: 4 }} fontSize="small" />
    //                         </Tooltip>
    //                     </div>
    //                 }
    //             />
    //         </>
    //     )
    // }

    // const activityFiveSpecifics = () => {
    //     return (
    //         <>
    //             {/*activity five switch for enabling machine learning clustering*/}
    //             <FormControlLabel className='activity-switch'
    //                 control={
    //                     <Switch
    //                         checked={value.activityFive.allowMLClustering}
    //                         onChange={() => setListOfActivities(prevValues => {
    //                             const updatedActivity = {
    //                                 ...prevValues[key],
    //                                 activityFive: {
    //                                     ...prevValues[key].activityFive,
    //                                     allowMLClustering: !prevValues[key].activityFive.allowMLClustering
    //                                 }
    //                             };
    //                             return {
    //                                 ...prevValues,
    //                                 [key]: updatedActivity
    //                             };
    //                         })}
    //                     />
    //                 }
    //                 label={
    //                     <div style={{ display: 'flex', alignItems: 'center' }}>
    //                         Allow Machine Learning Clustering
    //                         <Tooltip title="Grant the machine learning model permission to cluster text.">
    //                             <InfoIcon style={{ marginLeft: 4 }} fontSize="small" />
    //                         </Tooltip>
    //                     </div>
    //                 }
    //             />
    //         </>
    //     )
    // }

    return (
        <div>
            {activityTitles.map((title, i) => (
                <div className='activity-header-section'>

                    <Typography className="activity-sub-title" variant="h6">
                        <strong>{title}</strong>
                    </Typography>

                    {/* <Button onClick={() => { handleNavigate(activity.activityJsonRef[i].key, activityLabels[i], activity) }} disabled={!activity.activityJsonRef[i].key}
                        className={`activity-button ${value.activityJsonRef[i].key ? "active" : "disabled"}`}>
                        {title}
                    </Button> */}

                    {/*activity label*/}
                    
                    <div className='activity-sub-section'>
                        <Typography
                            dangerouslySetInnerHTML={{ __html: activity[activityJsonRef[i]].label }}
                            contentEditable="true"
                            className="editable-label"
                            id={`activity-${activityLabels[i]}-${key}-label-${activity[activityJsonRef[i]].key}`}
                        ></Typography>
                    </div>

                    {/*activity instruction*/}
                    <Typography
                        dangerouslySetInnerHTML={{ __html: activity[activityJsonRef[i]].instruction }}
                        contentEditable="true"
                        className="editable-instruction"
                        id={`activity-${activityLabels[i]}-${key}-instruction-${activity[activityJsonRef[i]].key}`}
                    ></Typography>

                    {/*remember to add activity specifics*/}

                    <Divider className='activity-divider' />

                </div>
            ))}
        </div>
    )

}

export default CustomiseActivities