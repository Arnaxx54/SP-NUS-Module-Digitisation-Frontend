import { use, useEffect, useState } from 'react';
import SwitchNewChain from '../../components/SwitchNewChain';
import { activityFourDefaultInstruction, activityFourDefaultLabel, componentHeight, componentWidth, numberOfComponentsPerRow, userAndModelSelectedHighlightingColorCheck, userSelectedHighlightingColorCheck } from '../../data/ActivityConstants';
import Boilerplate from './Boilerplate'
import './Stylesheets/Boilerplate.css'
import { Button, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { v4 as uuidv4 } from "uuid";
import DisplayTranscriptGraphically from '../../components/DisplayTranscriptGraphically';
import { ActivityFourDataRetrieval } from '../../hooks/DataRetrieval';
import { ActivityDataStorage } from '../../hooks/DataStorage';
import { activityLogger } from '../../utils/Logger';

const ActivityFour = () => {

    const [isInstructor, setIsInstructor] = useState(false)
    const [isNewChain, setIsNewChain] = useState(false)
    const [isTranscriptBlank, setIsTranscriptBlank] = useState(false)
    const [label, setLabel] = useState(activityFourDefaultLabel)
    const [instruction, setInstruction] = useState(activityFourDefaultInstruction)
    const [transcriptData, setTranscriptData] = useState({})

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {

        // checks occupation of the user
        if (sessionStorage.getItem("Occupation") == "Instructor") {
            setIsInstructor(true);
        }

        //retrieve data from database
        if (id !== undefined) {
            //retrieve data from database
            ActivityFourDataRetrieval(id, setLabel, setInstruction, setTranscriptData, setIsTranscriptBlank)
        } else {
            //retrieve data from previous activity
            setTranscriptData(sessionStorage.getItem('ActivityThreeBundledData'))

            setTranscriptData(prevData => {
                // Create a new copy of the state
                const newData = {
                    ...prevData,
                    content: { ...prevData.content }
                };
                let index = 0;

                if (!newData.transcriptBlank) {
                    Object.entries(newData.content).forEach(([key, line]) => {
                        if (line.response_text) {
                            // Copy the nested response_text object to avoid mutation
                            newData.content[key].response_text = { ...line.response_text };

                            Object.entries(newData.content[key].response_text).forEach(([subKey, responseLine]) => {
                                const mvcCss = newData.activity_mvc[key] && newData.activity_mvc[key][subKey] && newData.activity_mvc[key][subKey].css;
                                if (mvcCss && (mvcCss.match(userSelectedHighlightingColorCheck) || mvcCss.match(userAndModelSelectedHighlightingColorCheck))) {
                                    const x = (index % numberOfComponentsPerRow) * componentWidth;
                                    const y = Math.floor(index / numberOfComponentsPerRow) * componentHeight;
                                    newData.content[key].response_text[subKey] = {
                                        ...responseLine,
                                        clusterData: {
                                            id: uuidv4(),
                                            x,
                                            y,
                                            userClusterIndexA4: -1,
                                            type: "text",
                                            height: 0,
                                        },
                                    };
                                    index++;
                                }
                            });
                        }
                    });
                }

                return newData;
            });
        }

    }, [])

    const handleSubmit = (e) => {

        e.preventDefault()

        if (transcriptData.content !== undefined) {
            Object.entries(transcriptData.content).map(([key, data]) => {
                if (data.type === "label") {
                    const element = document.querySelector(`[data-height-id="${data.id}"]`);
                    transcriptData.content[key].height = element.clientHeight;
                } else if (data.response_id) {
                    Object.entries(data.response_text).map(([responseKey, responseData]) => {
                        if (responseData.clusterData) {
                            const element = document.querySelector(`[data-height-id="${responseData.clusterData.id}"]`);
                            transcriptData.content[key].response_text[responseKey].clusterData.height = element.clientHeight;
                        }
                    });
                }
            });
        }

        transcriptData.lastAuthored = isInstructor ? "instructor" : "student";
        transcriptData.label.push(document.getElementById("activity-four-label").innerHTML);
        transcriptData.instruction.push(document.getElementById("activity-four-instruction").innerHTML);
        transcriptData.activitiesId.push(sessionStorage.getItem("ActivitiesId"))

        sessionStorage.setItem('ActivityFourBundledData', transcriptData)

        //requests to database
        ActivityDataStorage(id, 'activityfour', transcriptData)

        // data logger
        activityLogger(isInstructor, id ? 'Update' : 'Create', 'activityFour', 'activityFourId')

        if (sessionStorage.getItem("ActivityFiveId") !== null) {
            navigate(`/activityfive/${sessionStorage.getItem("ActivityFiveId")}`);
        } else {
            navigate("/activityfive");
        }
    }

    return (

        <div className="container-activity">

            <Boilerplate activityLabel={'four'} label={label} instruction={instruction} isInstructor={isInstructor} setInstruction={setInstruction} setLabel={setLabel} />

            <form onSubmit={handleSubmit}>

                {/*if no transcript has been provided*/}
                {isTranscriptBlank &&
                    <Typography className="info-text">
                        No transcript has been displayed since no data was entered in Activity 1.
                    </Typography>}

                {/*switch button to create a new chain and reinitialise future activities*/}
                <SwitchNewChain activityLabel={4} isNewChain={isNewChain} setIsNewChain={setIsNewChain} />

                {/*displays components*/}
                <DisplayTranscriptGraphically transcriptData={transcriptData} setTranscriptData={setTranscriptData} />

                <Button className="submit-btn" fullWidth type="submit" variant="outlined">
                    Submit
                </Button>

            </form>

        </div>

    )

}

export default ActivityFour