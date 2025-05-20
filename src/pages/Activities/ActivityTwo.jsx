import { useEffect, useState } from 'react'
import { activityTwoDefaultInstruction, activityTwoDefaultLabel, userSelectedHighlightingColor, noTranscriptData, userSelectedHighlightingColorCheck } from '../../data/ActivityConstants'
import Boilerplate from './Boilerplate'
import './Stylesheets/Boilerplate.css'
import { Button, Divider, FormControlLabel, Switch, Tooltip, Typography } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info';
import SwitchNewChain from '../../components/SwitchNewChain'
import { useNavigate, useParams } from 'react-router'
import DisplayTranscript from '../../components/DisplayTranscript'
import { ActivityTwoDataRetrieval } from '../../hooks/DataRetrieval'
import { activityLogger } from '../../utils/Logger'
import { ActivityDataStorage } from '../../hooks/DataStorage'

const ActivityTwo = () => {

    const [isInstructor, setIsInstructor] = useState(true)
    const [isTranscriptBlank, setIsTranscriptBlank] = useState(false)
    const [isHighlightingAllowed, setIsHighlightingAllowed] = useState(true);
    const [isNewChain, setIsNewChain] = useState(false)
    const [label, setLabel] = useState(activityTwoDefaultLabel)
    const [instruction, setInstruction] = useState(activityTwoDefaultInstruction)
    const [transcriptData, setTranscriptData] = useState({})
    const [isNewActivityInit, setIsNewActivityInit] = useState(false)

    const { id } = useParams();
    const navigate = useNavigate();


    useEffect(() => {

        // checks occupation of the user
        if (sessionStorage.getItem("Occupation") == "Instructor") {
            setIsInstructor(true);
        }

        setIsNewActivityInit(sessionStorage.getItem('NewActivityInit'))

        if (id !== undefined) {
            //retrieve data from database
            ActivityTwoDataRetrieval(id, setIsHighlightingAllowed, setLabel, setInstruction, setIsTranscriptBlank, setTranscriptData)
        } else {
            //retrieve data from previous activity
            setTranscriptData(JSON.parse(sessionStorage.getItem('ActivityOneBundledData')))
        }

    }, [])

    //handles highlighting of interviewee text
    const handleClick = (event) => {
        if (isHighlightingAllowed || isInstructor) {
            const currentStyle = event.target.style;
            //yellow to no color
            if (currentStyle.backgroundColor === userSelectedHighlightingColor) {
                currentStyle.backgroundColor = "";
                currentStyle.borderRadius = "";
                currentStyle.padding = "";
            } else {
                //no color to yellow
                currentStyle.backgroundColor = userSelectedHighlightingColor;
                currentStyle.borderRadius = "4px";
                currentStyle.padding = "2px";
            }
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        //gets html and css of each of the sentences in the transcript
        const getActivityMVC = (elementId) => {
            const element = document.querySelector(`[id="${elementId}"]`);
            if (element) {
                const htmlContent = element.outerHTML;
                const inlineStyles = element.getAttribute("style") || "No inline styles";
                return { html: htmlContent, css: inlineStyles };
            } else {
                alert("Element not found");
                return undefined;
            }
        };

        let bundledData = transcriptData

        //gets activity mvc after user changes
        for (let i = 1; i < Object.keys(bundledData.activity_mvc).length + 1; i++) {
            if (i % 2 != 0) {
                let activity_mvc_value = getActivityMVC(i.toString());
                bundledData.activity_mvc[i] = activity_mvc_value;
                bundledData.content[i].sentenceUserHighlightA2 = false;
            } else {
                for (
                    let j = 1; j < Object.keys(bundledData.activity_mvc[i]).length + 1; j++) {
                    let activity_mvc_value = getActivityMVC(i.toString() + j.toString());
                    bundledData.activity_mvc[i][j] = activity_mvc_value;
                    if (activity_mvc_value.css.match(userSelectedHighlightingColorCheck)) {
                        bundledData.content[i].response_text[j].sentenceUserHighlightA2 = true;
                    } else {
                        bundledData.content[i].response_text[j].sentenceUserHighlightA2 = false;
                    }
                }
            }
        }

        bundledData.isHighlightingAllowed = isHighlightingAllowed
        bundledData.lastAuthored = isInstructor ? "instructor" : "student";
        bundledData.label = document.getElementById("activity-two-label").innerHTML
        bundledData.instruction = document.getElementById("activity-two-instruction").innerHTML

        sessionStorage.setItem('ActivityTwoBundledData', JSON.stringify(bundledData))

        //requests to database
        await ActivityDataStorage(id, 'activitytwo', bundledData)

        // data logger
        await activityLogger(isInstructor, id ? 'Update' : 'Create', 'activityTwo', 'activityTwoId')

        // new activity being initialised by an instructor
        if (isNewActivityInit) {
            //store ActivityId, ActivityOneId, ActivityTwoId stored in session storage
            //set the remaining activity id to null
            
            //cleanup
            sessionStorage.removeItem('NewActivityInit')
            sessionStorage.removeItem('ActivityOneId')
            sessionStorage.removeItem('ActivityTwoId')
            sessionStorage.removeItem('ActivitiesId')
            sessionStorage.removeItem('ActivityOneBundledData')
            sessionStorage.removeItem('ActivityTwoBundledData')

            navigate("/home");
        } else if (sessionStorage.getItem("ActivityThreeId") !== null) {
            navigate(`/activitythree/${sessionStorage.getItem("ActivityThreeId")}`);
        } else {
            navigate("/activitythree");
        }

    }

    return (

        <div className='container-activity'>

            <Boilerplate activityLabel={'two'} label={label} instruction={instruction} isInstructor={isInstructor} setInstruction={setInstruction} setLabel={setLabel} />

            <form onSubmit={handleSubmit}>

                {isInstructor && <Divider className="divider" />}

                {/*display this information only to instructors*/}
                {isInstructor && (
                    <Typography className="info-text">
                        After submitting this activity, you will be automatically redirected to the home page. From there, you can return to select configurations for the remaining activities.
                    </Typography>
                )}

                {/*if no transcript has been provided*/}
                {isTranscriptBlank && <Typography className="info-text">
                    {noTranscriptData}
                </Typography>}

                {/*display the switch for standard highlighting only to instructors*/}
                {isInstructor && (
                    <FormControlLabel className="formControlLabel" control={
                        <Switch checked={!isHighlightingAllowed} onChange={() => setIsHighlightingAllowed((prev) => !prev)} />
                    }
                        label={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                Standardised Script Highlighting
                                <Tooltip title="The highlighting of the script is standardized and cannot be edited by students across all template copies.">
                                    <InfoIcon style={{ marginLeft: 4 }} fontSize="small" />
                                </Tooltip>
                            </div>
                        }
                    />
                )}

                {/*informs users regarding standardised highlighting*/}
                {!isInstructor && !isHighlightingAllowed && (
                    <Typography className="info-text">
                        You are not allowed to edit the highlighting of the transcript in this template.
                    </Typography>
                )}

                {/*switch button to create a new chain and reinitialise future activities*/}
                <SwitchNewChain activityLabel={2} isNewChain={isNewChain} setIsNewChain={setIsNewChain} isNewActivityInit={isNewActivityInit} />

                {/* displays transcript */}
                <DisplayTranscript transcriptData={transcriptData} handleClick={handleClick} />

                <Button className="submit-btn" fullWidth type="submit" variant="outlined">
                    Submit
                </Button>

            </form>

        </div>
    )
}

export default ActivityTwo