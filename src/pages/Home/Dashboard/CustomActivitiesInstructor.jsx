import { useNavigate } from 'react-router';
import '../Stylesheets/Dashboard.css'
import { Accordion, AccordionDetails, AccordionSummary, Alert, Button, CircularProgress, Dialog, DialogActions, DialogTitle, Divider, FormControlLabel, LinearProgress, MenuItem, Select, Switch, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
// import axios from 'axios';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClearIcon from '@mui/icons-material/Clear';
import InfoIcon from '@mui/icons-material/Info';
import CustomiseActivities from '../../../components/CustomiseActivities';
import axios from 'axios';
import { InstructorCustomActivitiesDataRetrieval } from '../../../hooks/DataRetrieval';
import { InstructorCustomActivitiesDataStorage } from '../../../hooks/DataStorage';
import { activityLogger } from '../../../utils/Logger';
import { ActivityDataDeletion } from '../../../hooks/DataDeletion';

const CustomActivitiesInstructor = () => {

    //use state hooks to store relevant values
    const userId = sessionStorage.getItem("UserId");
    const [listOfActivities, setListOfActivities] = useState({});
    const [open, setOpen] = useState(false)
    const [deleteItem, setDeleteItem] = useState(null);
    const [loadingIdPublishing, setLoadingIdPublishing] = useState(null)
    const [loadingIdDelete, setLoadingIdDelete] = useState(null)
    const [loadingIdRemovalStudents, setLoadingIdRemovalStudents] = useState(null)
    const [activityEvents, setActivityEvents] = useState([])
    const [isInstructor, setIsInstructor] = useState([])

    const navigate = useNavigate();

    // retreives data from table if available or generates activities with default configurations
    useEffect(() => {

        // checks occupation of the user
        if (sessionStorage.getItem("Occupation") == "Instructor") {
            setIsInstructor(true);
        }

        InstructorCustomActivitiesDataRetrieval(userId, setListOfActivities)

    }, [])


    // handles updating/saving of the updated activities
    const handleSubmit = async (key, value) => {

        setLoadingIdPublishing(key);

        // data storage link
        InstructorCustomActivitiesDataStorage(key, value, setActivityEvents)

        // change status of all activities to published

        const activityLabel = ['One', 'Two', 'Three', 'Four', 'Five', 'Six']

        // data logger
        activityEvents.forEach((label, index) => {
            activityLogger(isInstructor, label, `activity${activityLabel[index]}`, `activity${activityLabel[index]}Id`)
        })

        setLoadingIdPublishing(null);

    }

    //handles the removal of instructor activities from the student's dashboard
    const handleRemovalStudentsInterface = async (value) => {

        setLoadingIdRemovalStudents(value.activityId);

        try {

            //changes the status of the activity to unpublished so that it cannot be accessed by students
            await axios.post(`https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/home/update-published-status/${value.activityId}`, { Published: false });

            setLoadingIdRemovalStudents(null);

            window.location.reload(false);

        } catch (error) {

            console.error('Failed to update template:', error);
            setLoadingIdRemovalStudents(null);

        }

    }

    //handles deletion of templates
    const handleDelete = async (value) => {

        setLoadingIdDelete(value.activityId)

        try {

            ActivityDataDeletion(value)

            setLoadingIdDelete(null);

            setListOfActivities(prevActivities => {
                const updatedActivities = { ...prevActivities };
                delete updatedActivities[value.activityId];
                return updatedActivities;
            });

        } catch (error) {

            console.error('Failed to update template:', error);
            setLoadingIdDelete(null);

        }

    }

    //dialog for confirming user action for deleting a template
    const confirmDeleteDialog = () => {
        return (
            <Dialog open={open} onClose={() => setOpen(false)}
                BackdropProps={{
                    style: {
                        opacity: "10%"
                    },
                }}
                PaperProps={{
                    style: {
                        boxShadow: 'none',

                    },
                }}>
                <DialogTitle className='dialog-delete-header'>
                    <Typography className='dialog-delete-title'><strong>Are you sure?</strong></Typography>
                    <Typography>Once deleted, retrieval is impossible. Please consult your instructor before proceeding.</Typography>
                </DialogTitle>
                <DialogActions>
                    <Button onClick={(e) => { e.stopPropagation(); setOpen(false) }} >
                        Cancel
                    </Button>
                    <Button onClick={(e) => {
                        e.stopPropagation();
                        if (deleteItem) handleDelete(deleteItem);
                        setOpen(false);
                        setDeleteItem(null);
                    }} autoFocus>
                        Proceed
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    //removes all id's of all the activities in sessionStorage
    const storeActivityDetails = (value) => {
        sessionStorage.setItem("ActivityOneId", value.activityOne.key);
        sessionStorage.setItem("ActivityTwoId", value.activityTwo.key);
        sessionStorage.setItem("ActivityThreeId", value.activityThree.key);
        sessionStorage.setItem("ActivityFourId", value.activityFour.key);
        sessionStorage.setItem("ActivityFiveId", value.activityFive.key);
        sessionStorage.setItem("ActivitySixId", value.activitySix.key);
        sessionStorage.setItem("new-chain", false);
        sessionStorage.setItem("ActivitiesId", value.activityId);
    }

    //handles start activity button
    const handleStartActivity = (value) => {
        storeActivityDetails(value);
        sessionStorage.setItem("custom-activities-instructor", true);
        if (value.activityOne.notEditableTranscript) {
            navigate(`/activitytwo/${value.activityTwo.key}`);
        } else {
            navigate(`/activityone/${value.activityOne.key}`);
        }
    }

    const handleNavigate = (activityId, activityNumber, value) => {
        sessionStorage.setItem("ActivitiesId", value.id);
        storeActivityDetails(value);
        navigate(`/activity${activityNumber}/${activityId}`);
    };

    const sampleData = {
        "34": {
            "activityTitle": "No Title Provided",
            "activityOne": {
                "label": " Activity 1 Label",
                "instruction": " Use the text boxes below to provide the details of your interview transcript. After you fill in the boxes, click the Preview button to see how the transcript looks before proceeding to the next activity. If you would like to make any changes you can do so by editing the transcript text directly. Click the Submit button when you are satisfied with the look of your interview transcript. The final version of your transcript will be used in the next activity.",
                "notEditableTranscript": false,
                "key": 34
            },
            "activityTwo": {
                "label": "Activity 2 Label",
                "instruction": " Read through the transcript and click on sentences from the <strong>interviewee</strong> that you think provide insights or convey important information. Clicking a sentence will highlight it in yellow. Clicking a highlighted sentence again will unhighlight it. When you are satisfied with your sentence selections, click the Submit button to continue to the next activity. Your choices of which sentences to highlight will be carried forward to the next activity.",
                "highlightingNotAllowed": false,
                "key": 35
            },
            "activityThree": {
                "label": "Custom Text",
                "instruction": "<typography>The transcript you submitted was passed through an AI model trained to identify important sentences. The model’s sentence selection was then compared with yours. The sentences you and the model both selected are now highlighted in green. Sentences that the model classified as being important but you did not are highlighted in blue. Sentences you selected as being important but the model did not are highlighted in yellow.</typography>\n                                <br> <br>\n                                <typography>Please review the version of your transcript with the new highlights below. You’ll likely agree with some of the sentence selections and disagree with others. As you review the transcript, feel free to refine your sentence selections. When you are satisfied with your selections, click the Submit button to continue to the next activity. Only your choices about which sentences are important (yellow and green highlights) will be used in the next activity.</typography>\n                                <br> <br>\n                                <typography>You can refer to the following key to remind yourself of what the three colours mean.</typography>\n                                <ul style=\"{{\" margintop:=\"\" 0=\"\" }}=\"\">\n                                    <li><typography>Only the model selected - blue</typography></li>\n                                    <li><typography>Only you selected - yellow</typography></li>\n                                    <li><typography>Both you and the model selected - green</typography></li>\n                                </ul>",
                "MLModel": "None",
                "enableMLModel": false,
                "key": 37
            },
            "activityFour": {
                "label": "Custom Text",
                "instruction": "<typography>The sentences you selected in the previous activity have been arranged on the left side of the pane below. Use the space below to cluster the sentences into themes by arranging the sentences that go together near each other. It’s okay if the sentences in a cluster overlap a bit.</typography>\n                                <br> <br>\n                                <typography>You can then name the cluster by clicking the Add Label button to create a new text box. You can edit the label text by clicking on its text. You can drag the label anywhere in the clustering area by clicking and holding the label area. You can remove a label from the clustering area by deleting all of its text.</typography>\n                                <br> <br>\n                                <typography>Once you are satisfied with your clusters and their labels, you can save everything by clicking the Submit button. Once submitted, your clusters and labels will be used in the next activity.</typography>\n                                ",
                "key": 38
            },
            "activityFive": {
                "label": "Custom Text",
                "instruction": "<typography>For this activity, you will see two views of your clusters and labels. In the User view, you will see the arrangement you submitted in the previous activity or the arrangement you are currently working on. In the Alternative view, you will see how the AI model would have clustered the sentences you selected. The Alternative view does not provide labels for the clusters, but you might be able to infer them yourself.</typography>\n                                <br> <br>\n                                <typography>Compare the two arrangement and refine the arrangement in the User view in anyway that you feel improves it. When you are satisfied with the arrangement in the User view, click the Submit button to continue to the next activity.</typography>\n                                ",
                "allowMLClustering": false,
                "key": 37
            },
            "activitySix": {
                "label": "Custom Text",
                "instruction": "<typography>The sentences and cluster labels you submitted for the previous activity have been arranged in the space below. For each cluster, add any number of insights that you think emerge from the selected sentences. After surfacing the insights, add a set of needs that relate to those insights one at a time. Identifying the insights and needs should be helpful when designing your prototype.</typography>\n                                <br> <br>\n                                <typography>When you are satisfied with your listed insights and needs, click the Submit button to complete this stage of the design thinking process. You can come back and make changes to your submissions whenever you like.</typography>\n                                ",
                "key": 37
            },
            "activityId": 34,
            "published": true
        },
        "35": {
            "activityTitle": "1",
            "activityOne": {
                "label": " Activity 1 Label",
                "instruction": " Use the text boxes below to provide the details of your interview transcript. After you fill in the boxes, click the Preview button to see how the transcript looks before proceeding to the next activity. If you would like to make any changes you can do so by editing the transcript text directly. Click the Submit button when you are satisfied with the look of your interview transcript. The final version of your transcript will be used in the next activity.",
                "notEditableTranscript": false,
                "key": 35
            },
            "activityTwo": {
                "label": "Activity 2 Label",
                "instruction": " Read through the transcript and click on sentences from the <strong>interviewee</strong> that you think provide insights or convey important information. Clicking a sentence will highlight it in yellow. Clicking a highlighted sentence again will unhighlight it. When you are satisfied with your sentence selections, click the Submit button to continue to the next activity. Your choices of which sentences to highlight will be carried forward to the next activity.",
                "highlightingNotAllowed": false,
                "key": 36
            },
            "activityThree": {
                "label": "Custom Text",
                "instruction": "<typography>The transcript you submitted was passed through an AI model trained to identify important sentences. The model’s sentence selection was then compared with yours. The sentences you and the model both selected are now highlighted in green. Sentences that the model classified as being important but you did not are highlighted in blue. Sentences you selected as being important but the model did not are highlighted in yellow.</typography>\n                                <br> <br>\n                                <typography>Please review the version of your transcript with the new highlights below. You’ll likely agree with some of the sentence selections and disagree with others. As you review the transcript, feel free to refine your sentence selections. When you are satisfied with your selections, click the Submit button to continue to the next activity. Only your choices about which sentences are important (yellow and green highlights) will be used in the next activity.</typography>\n                                <br> <br>\n                                <typography>You can refer to the following key to remind yourself of what the three colours mean.</typography>\n                                <ul style=\"{{\" margintop:=\"\" 0=\"\" }}=\"\">\n                                    <li><typography>Only the model selected - blue</typography></li>\n                                    <li><typography>Only you selected - yellow</typography></li>\n                                    <li><typography>Both you and the model selected - green</typography></li>\n                                </ul>",
                "MLModel": "None",
                "enableMLModel": false,
                "key": 38
            },
            "activityFour": {
                "label": "Custom Text",
                "instruction": "<typography>The sentences you selected in the previous activity have been arranged on the left side of the pane below. Use the space below to cluster the sentences into themes by arranging the sentences that go together near each other. It’s okay if the sentences in a cluster overlap a bit.</typography>\n                                <br> <br>\n                                <typography>You can then name the cluster by clicking the Add Label button to create a new text box. You can edit the label text by clicking on its text. You can drag the label anywhere in the clustering area by clicking and holding the label area. You can remove a label from the clustering area by deleting all of its text.</typography>\n                                <br> <br>\n                                <typography>Once you are satisfied with your clusters and their labels, you can save everything by clicking the Submit button. Once submitted, your clusters and labels will be used in the next activity.</typography>\n                                ",
                "key": 39
            },
            "activityFive": {
                "label": "Custom Text",
                "instruction": "<typography>For this activity, you will see two views of your clusters and labels. In the User view, you will see the arrangement you submitted in the previous activity or the arrangement you are currently working on. In the Alternative view, you will see how the AI model would have clustered the sentences you selected. The Alternative view does not provide labels for the clusters, but you might be able to infer them yourself.</typography>\n                                <br> <br>\n                                <typography>Compare the two arrangement and refine the arrangement in the User view in anyway that you feel improves it. When you are satisfied with the arrangement in the User view, click the Submit button to continue to the next activity.</typography>\n                                ",
                "allowMLClustering": false,
                "key": 38
            },
            "activitySix": {
                "label": "Custom Text",
                "instruction": "<typography>The sentences and cluster labels you submitted for the previous activity have been arranged in the space below. For each cluster, add any number of insights that you think emerge from the selected sentences. After surfacing the insights, add a set of needs that relate to those insights one at a time. Identifying the insights and needs should be helpful when designing your prototype.</typography>\n                                <br> <br>\n                                <typography>When you are satisfied with your listed insights and needs, click the Submit button to complete this stage of the design thinking process. You can come back and make changes to your submissions whenever you like.</typography>\n                                ",
                "key": 38
            },
            "activityId": 35,
            "published": true
        }
    }
    
    const initialiseNewTemplate = () => {
        // keeps track of whether a new activity is being initialised by an instructor
        sessionStorage.setItem('NewActivityInit', true)

        // activity one and two are to be reinitialised
        sessionStorage.setItem('ActivityOneId', null)
        sessionStorage.setItem('ActivityTwoId', null)

        navigate("/activityone")
    }

    return (
        <div style={{ backgroundColor: "#f8f8f8" }}>

            {/*create a new template*/}
            <Button className="create-template-button" fullWidth variant="outlined"
                onClick={() => initialiseNewTemplate()}>
                Create a Template
            </Button>

            <div className='custom-activities-container'>
                <Typography className="custom-activities-title">
                    Your Custom Activities
                </Typography>

                {/*if instructor has created no activities*/}
                {Object.entries(listOfActivities).length === 0 ? (
                    <div className='custom-activities-blank'>
                        Currently, no templates are available. Please create one using the button above.
                    </div>
                ) : (
                    /*displays set of activities created by the instructor*/
                    Object.entries(listOfActivities).map(([key, activity]) => {
                        return (
                            <div key={key} className="activity-accordion">
                                <Accordion className="accordion">

                                    {/*contents of the accordian header*/}
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} id={`panel-header-${activity.id}`} className="accordion-summary">

                                        <div className='activity-container'>
                                            {/*checks whether activity title has been provided*/}
                                            <Typography className="activity-title">
                                                {activity.activityTitle === "" ? "No Title Provided" : activity.activityTitle}
                                            </Typography>
                                        </div>

                                        <Button disableRipple className="start-activity-button" onClick={() => { handleStartActivity(activity) }}>
                                            Start Activity
                                        </Button>

                                        {/*if published, a button is displayed to remove from students template*/}
                                        {activity.published === true ? (
                                            loadingIdRemovalStudents === activity.activityId ? (
                                                <CircularProgress size={37} className='delete-template-loading' />
                                            ) : (
                                                // <Button disableRipple onClick={(e) => { e.stopPropagation(); handleRemovalStudentsInterface(value); }}>
                                                //     Remove from student interface
                                                // </Button>
                                                <Button>
                                                    Remove from student interface
                                                </Button>
                                            )
                                        ) : (
                                            <></>
                                        )}

                                        {/*delete icon*/}
                                        {loadingIdDelete === activity.activityId ? (
                                            <CircularProgress size={37} className='delete-template-loading' />
                                        ) : (
                                            <Button disableRipple onClick={(e) => { e.stopPropagation(); setOpen(true); setDeleteItem(activity); }} className='activity-button-delete'>
                                                <ClearIcon />
                                            </Button>
                                        )}

                                        {confirmDeleteDialog()}

                                    </AccordionSummary>

                                    <AccordionDetails className='accordian-details'>

                                        <Alert severity="warning" className="alert-warning" style={{ marginTop: "8px" }}>
                                            Please click the 'Publish Activities / Save Changes' button to make the activities available to all users.
                                        </Alert>

                                        <CustomiseActivities activity={activity} key={key} />

                                        {loadingIdPublishing === key ? (
                                            <LinearProgress className='update-template-loading' />
                                        ) : (
                                            // <Button fullWidth variant='contained' className='activity-submit-button' onClick={() => handleSubmit(key, value)}>
                                            //     Save / Publish Updates
                                            // </Button>
                                            <Button>
                                                Save / Publish Updates
                                            </Button>
                                        )}

                                    </AccordionDetails>

                                </Accordion>

                            </div>
                        )

                    })

                )}
            </div>



        </div>
    )
}

export default CustomActivitiesInstructor;