import { useEffect, useState } from 'react';
import { activitySixDefaultInstruction, activitySixDefaultLabel } from '../../data/ActivityConstants';
import Boilerplate from './Boilerplate'
import './Stylesheets/Boilerplate.css'
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import './Stylesheets/ActivitySix.css'
import { useParams } from 'react-router';
import { ActivitySixDataRetrieval } from '../../hooks/DataRetrieval';
import { ActivityDataStorage } from '../../hooks/DataStorage';
import { activityLogger } from '../../utils/Logger';

const ActivitySix = () => {

    const [isInstructor, setIsInstructor] = useState(false)
    const [isTranscriptBlank, setIsTranscriptBlank] = useState(false)
    const [insightsAndNeeds, setInsightsAndNeeds] = useState({})
    const [label, setLabel] = useState(activitySixDefaultLabel)
    const [instruction, setInstruction] = useState(activitySixDefaultInstruction)
    const [transcriptData, setTranscriptData] = useState({})

    const { id } = useParams();

    useEffect(() => {
        // checks occupation of the user
        if (sessionStorage.getItem("Occupation") == "Instructor") {
            setIsInstructor(true);
        }

        if (id !== undefined) {
            //retrieve data from database
            ActivitySixDataRetrieval(id, setLabel, setInstruction, setIsTranscriptBlank, setInsightsAndNeeds)
        } else {
            //retrieve data from previous activity
            setTranscriptData(sessionStorage.getItem('ActivityFourBundledData'))

            let insightsAndNeedsCollector = {}

            Object.entries(transcriptData.content).map(([key, value]) => {
                if (value.type === "label") {
                    insightsAndNeedsCollector[value.userClusterIndexA5] = {
                        content: {}, insights: {}, needs: {},
                        label: {
                            text: value.clusterLabelA5,
                            coreKey: value.coreKey,
                        },
                    };
                }
            })

            Object.entries(transcriptData.content).map(([key, value]) => {
                if (value.response_id) {
                    Object.entries(value.response_text).map(([responseKey, responseValue]) => {
                        if (responseValue.clusterData) {
                            insightsAndNeedsCollector[responseValue.clusterData.userClusterIndexA5].content[Object.keys(insightsAndNeedsCollector[responseValue.clusterData.userClusterIndexA5].content).length] = {
                                text: responseValue.text,
                                coreKey: responseValue.clusterData.coreKey,
                                subKey: responseValue.clusterData.subKey,
                            };
                        }
                    })
                }
            })

            setInsightsAndNeeds(insightsAndNeedsCollector)
        }

    }, [])

    const handleSubmit = (e) => {

        e.preventDefault()

        transcriptData.lastAuthored = isInstructor ? "instructor" : "student";
        transcriptData.label.push(document.getElementById("activity-six-label").innerHTML);
        transcriptData.instruction.push(document.getElementById("activity-six-instruction").innerHTML);
        transcriptData.activitiesId.push(sessionStorage.getItem("ActivitiesId"))
        transcriptData.insightsAndNeeds = insightsAndNeeds

        //requests to database
        sessionStorage.setItem('ActivitySixBundledData', transcriptData)

        //requests to database
        ActivityDataStorage(id, 'activitysix', transcriptData)

        // data logger
        activityLogger(isInstructor, id ? 'Update' : 'Create', 'activitySix', 'activitySixId')


    }

    const getInsightOrNeeds = (whatToGet, data, baseKey) => {
        return Object.entries(data[whatToGet]).map(([subKey, value]) => {
            return (
                <div className={`cluster-accordian-${whatToGet}`}>
                    <Typography
                        onBlur={() => {
                            let element = document.querySelector(`[${whatToGet}-id="${baseKey.toString() + subKey.toString()}"]`);
                            if (element.innerHTML === "" || element.innerHTML === '<br>' || element.innerHTML === '<div><br></div>') { deleteInsightOrNeed(whatToGet, baseKey, subKey) }
                        }}
                        {...{ [`${whatToGet}-id`]: baseKey.toString() + subKey.toString() }}
                        contenteditable="true"
                        className={`cluster-accordian-${whatToGet}-text`}
                    >
                        {value}
                    </Typography>
                </div>
            );
        });
    }

    const deleteInsightOrNeed = (whatToDelete, baseKey, subKey) => {
        setInsightsAndNeeds((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            delete newData[baseKey][whatToDelete][subKey];
            return newData;
        });
    }

    const addInsightOrNeed = (whatToAdd, key) => {
        setInsightsAndNeeds((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData));
            newData[key][whatToAdd][Object.keys(newData[key][whatToAdd]).length] = "Edit";
            return newData;
        });
    }

    return (

        <div className="container-activity">

            <Boilerplate activityLabel={'six'} label={label} instruction={instruction} isInstructor={isInstructor} setInstruction={setInstruction} setLabel={setLabel} />

            <form onSubmit={handleSubmit}>

                {/*if no transcript has been provided*/}
                {isTranscriptBlank && <Typography className="info-text">
                    No transcript has been displayed since no data was entered in Activity 1.
                </Typography>}

                {/*displays transcript*/}
                {Object.entries(insightsAndNeeds).map(([key, value]) => {
                    return (
                        <div key={key} className='cluster-details-container'>

                            {/*displays selected components for each label*/}
                            <div style={{ width: "100%" }}>
                                <Accordion className='cluster-accordian'>
                                    <AccordionSummary className='cluster-accordian-header' expandIcon={<ExpandMoreIcon />}>
                                        <Typography className='cluster-accordian-label'>
                                            {value.label.text}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {Object.entries(value.content).map(([key, componentValue]) => {
                                            return (
                                                <div key={key} className='cluster-accordian-content'>
                                                    {componentValue.text}
                                                </div>
                                            )
                                        })}
                                    </AccordionDetails>
                                </Accordion>
                            </div>

                            {/*displays insights*/}
                            <div style={{ width: "100%" }}>
                                {getInsightOrNeeds('insights', value, key)}
                                <Button variant="outlined"
                                    onClick={() => addInsightOrNeed('insights', key)}
                                    className='cluster-button'>
                                    +
                                </Button>
                            </div>

                            {/*displays needs*/}
                            <div style={{ width: "100%" }}>
                                {getInsightOrNeeds('needs', value, key)}
                                <Button variant="outlined"
                                    onClick={() => addInsightOrNeed('needs', key)}
                                    className='cluster-button'>
                                    +
                                </Button>
                            </div>

                        </div>
                    )
                })}

                <Button className="submit-btn" fullWidth type="submit" variant="outlined">
                    Submit
                </Button>

            </form>

        </div>



    )

}

export default ActivitySix
