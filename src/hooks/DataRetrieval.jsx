import axios from "axios";
import { activityFiveDefaultInstruction, activityFiveDefaultLabel, activityFourDefaultInstruction, activityFourDefaultLabel, activityOneDefaultInstruction, activityOneDefaultLabel, activitySixDefaultInstruction, activitySixDefaultLabel, activityThreeDefaultInstruction, activityThreeDefaultLabel, activityTwoDefaultInstruction, activityTwoDefaultLabel } from "../data/ActivityConstants";

//retrieve data from activity one
export const ActivityOneDataRetrieval =
    async ({ activityId,
        setTranscriptTitle,
        setInterviewer,
        setInterviewee,
        setTranscriptEditable,
        setLabel,
        setInstruction,
        setTranscript,
    }) => {
        await axios.get(`https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/activityone/byId/${activityId}`).then((response) => {
            if (response.data) {
                setTranscriptTitle(response.data.transcript_source_id)
                setInterviewer(response.data.interviewer)
                setInterviewee(response.data.interviewee)
                setTranscriptEditable(response.data.transcriptEditable)
                setLabel(response.data.label[0])
                setInstruction(response.data.instruction[0])
                if (Object.entries(response.data.content).length !== 0) {
                    let transcriptText = "";
                    Object.entries(response.data.content).map(([key, value]) => {
                        if (value.questioner_tag !== undefined) {
                            if (transcriptText === "") {
                                transcriptText = transcriptText + value.questioner_tag + ": " + value.question_text;
                            } else {
                                transcriptText = transcriptText + "\n\n" + value.questioner_tag + ": " + value.question_text;
                            }
                        } else {
                            transcriptText = transcriptText + "\n\n" + value.response_tag + ": ";
                            Object.entries(value.response_text).map(([responseKey, responseText]) => {
                                transcriptText = transcriptText + " " + responseText.text;
                            });
                        }
                    });
                    setTranscript(transcriptText);
                }
            }
        })
    }

//retrieve data from activity two
export const ActivityTwoDataRetrieval = async ({
    id,
    setIsHighlightingNotAllowed,
    setLabel,
    setInstruction,
    setIsTranscriptBlank,
    setTranscriptData
}) => {
    await axios.get(`https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/activitytwo/byId/${id}`).then((response) => {
        if (response.data) {
            setIsHighlightingNotAllowed(response.data.isHighlightingAllowed)
            setLabel(response.data.label[1])
            setInstruction(response.data.instruction[1])
            setIsTranscriptBlank(response.data.transcriptBlank)
            setTranscriptData(response.data.content)
        }
    })
}

//retrieve data from activity three
export const ActivityThreeDataRetrieval = async ({
    id,
    setModel,
    setIsHighlightingAllowed,
    setIsModelAllowed,
    setLabel,
    setInstruction,
    setIsTranscriptBlank,
    setTranscriptData
}) => {
    await axios.get(`https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/activitythree/byId/${id}`).then((response) => {
        if (response.data) {
            setModel(response.data.model)
            setIsModelAllowed(response.data.isModelAllowed)
            setLabel(response.data.label[2])
            setInstruction(response.data.instruction[2])
            setIsHighlightingAllowed(response.data.isHighlightingAllowed)
            setIsTranscriptBlank(response.data.transcriptBlank)
            setTranscriptData(response.data.content)
        }
    })
}

//retrieve data from activity four
export const ActivityFourDataRetrieval = async ({
    id,
    setLabel,
    setInstruction,
    setTranscriptData,
    setIsTranscriptBlank
}) => {
    await axios.get(`https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/activityfour/byId/${id}`).then((response) => {
        setLabel(response.data.label[3])
        setInstruction(response.data.instruction[3])
        setIsTranscriptBlank(response.data.transcriptBlank)
        setTranscriptData(response.data.content)
    })
}

//retrieve data from activity five
export const ActivityFiveDataRetrieval = async ({
    id,
    setLabel,
    setInstruction,
    setIsTranscriptBlank,
    setClustering,
    setTranscriptData
}) => {
    await axios.get(`https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/activityfive/byId/${id}`).then((response) => {
        setLabel(response.data.label[4])
        setInstruction(response.data.instruction[4])
        setIsTranscriptBlank(response.data.transcriptBlank)
        setTranscriptData(response.data.content)
        setClustering(response.data.clustering)
    })
}

//retrieve data from activity six
export const ActivitySixDataRetrieval = async ({
    id,
    setLabel,
    setInstruction,
    setIsTranscriptBlank,
    setInsightsAndNeeds
}) => {
    await axios.get(`https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/activitysix/byId/${id}`).then((response) => {
        setLabel(response.data.label[5])
        setInstruction(response.data.instruction[5])
        setIsTranscriptBlank(response.data.transcriptBlank)
        setInsightsAndNeeds(response.data.insightsAndNeeds)
    })
}

export const InstructorCustomActivitiesDataRetrieval = async ({
    userId,
    setListOfActivities
}) => {

    await axios.post("https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/home", { UserId: userId }).then((response) => {
        if (response.data) {
            Object.entries(response.data).forEach(([key, activitySet]) => {

                let activityData = {}
                let activityTitle
                let activityLabels = ['One', 'Two', 'Three', 'Four', 'Five', 'Six']

                activityLabels.forEach((label, index) => {
                    const activityKey = `Activity${label}Id`;
                    if (activitySet[activityKey] !== null) {
                        axios.get(`https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/activity${label.toLowerCase()}/byId/${parseInt(activitySet[activityKey])}`).then((response) => {
                            activityData[`activity${label}Data`] = response.data;
                        })
                    }
                })

                Object.entries(activityData).map(([key, activity]) => {
                    switch (key) {
                        case 'activityOneData': {
                            let dataExists = Object.keys(activity) !== 0
                            let tempDataStorage = {
                                label: dataExists ? activity.label : activityOneDefaultLabel,
                                instruction: dataExists ? activity.instruction : activityOneDefaultInstruction,
                                isEditableTranscript: dataExists ? activity.transcriptEditable : true,
                                key: activitySet['ActivityOneId']
                            }

                            activityData['activityOneData'] = tempDataStorage
                            break
                        }

                        case 'activityTwoData': {
                            let dataExists = Object.keys(activity) !== 0
                            let tempDataStorage = {
                                label: dataExists ? activity.label : activityTwoDefaultLabel,
                                instruction: dataExists ? activity.instruction : activityTwoDefaultInstruction,
                                isHighlightingAllowed: dataExists ? activity.isHighlightingAllowed : true,
                            }
                            if (dataExists) {
                                tempDataStorage.key = activitySet['ActivityTwoId']
                            }
                            activityData['activityTwoData'] = tempDataStorage
                            break
                        }

                        case 'activityThreeData': {
                            let dataExists = Object.keys(activity) !== 0
                            let tempDataStorage = {
                                label: dataExists ? activity.label : activityThreeDefaultLabel,
                                instruction: dataExists ? activity.instruction : activityThreeDefaultInstruction,
                                model: dataExists ? activity.model : 'none',
                                isModelAllowed: dataExists ? activity.isModelAllowed : false
                            }
                            if (dataExists) {
                                tempDataStorage.key = activitySet['ActivityThreeId']
                            }
                            activityData['activityThreeData'] = tempDataStorage
                            break
                        }

                        case 'activityFourData': {
                            let dataExists = Object.keys(activity) !== 0
                            let tempDataStorage = {
                                label: dataExists ? activity.label : activityFourDefaultLabel,
                                instruction: dataExists ? activity.instruction : activityFourDefaultInstruction,
                            }
                            if (dataExists) {
                                tempDataStorage.key = activitySet['ActivityFourId']
                            }
                            activityData['activityFourData'] = tempDataStorage
                            break
                        }

                        case 'activityFiveData': {
                            let dataExists = Object.keys(activity) !== 0
                            let tempDataStorage = {
                                label: dataExists ? activity.label : activityFiveDefaultLabel,
                                instruction: dataExists ? activity.instruction : activityFiveDefaultInstruction,
                                clustering: dataExists ? activity.isClustering : false,
                            }
                            if (dataExists) {
                                tempDataStorage.key = activitySet['ActivityFiveId']
                            }
                            activityData['activityFiveData'] = tempDataStorage
                            break
                        }

                        case 'activitySixData': {
                            let dataExists = Object.keys(activity) !== 0
                            let tempDataStorage = {
                                label: dataExists ? activity.label : activitySixDefaultLabel,
                                instruction: dataExists ? activity.instruction : activitySixDefaultInstruction,
                            }
                            if (dataExists) {
                                tempDataStorage.key = activitySet['ActivitySixId']
                            }
                            activityData['activitySixData'] = tempDataStorage
                            break
                        }

                    }
                })

                setListOfActivities((prevValues) => ({
                    ...prevValues,
                    [activitySet.id]: {
                        activityTitle: activityTitle === "" ? "No Title Provided" : activityTitle,
                        activityOne: activityData['activityOneData'],
                        activityTwo: activityData['activityOneData'],
                        activityThree: activityData['activityOneData'],
                        activityFour: activityData['activityOneData'],
                        activityFive: activityData['activityOneData'],
                        activitySix: activityData['activityOneData'],
                        activityId: activitySet.id,
                        // isPublished: true
                    }
                }))

            })

        }
    })
}

export const InstructorActivitiesDataRetrieval = ({ setListOfActivities }) => {
    //returns a list of all instructors
    axios.get("https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/home/instructors").then((response) => {
        if (response.data) {
            Object.entries(response.data).forEach(([key, value]) => {
                ActivityOneDataRetrieval(value.id, setListOfActivities, true, false)
            })
        }
    })
}

export const StudentActivitiesDataRetrieval = ({ setListOfActivities }) => {
    //returns a list of all students
    axios.get("https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/home/students").then((response) => {
        if (response.data) {
            Object.entries(response.data).forEach(([key, value]) => {
                ActivityOneDataRetrieval(value.id, setListOfActivities, false, true)
            })
        }
    })
}

export const ActivityOneRetrievalByUserId = ({
    userId,
    setListOfActivities,
    forInstructor,
    forStudent,
}) => {
    axios.get("https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/home", { UserId: userId }).then((response) => {
        if (response.data) {
            Object.entries(response.data).forEach(([key, activity]) => {
                if (forInstructor && activity.Published !== false || forStudent) {
                    (async () => {
                        //returns data of activity one with corresponding activity one id. 
                        await axios.get(`https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/activityone/byId/${parseInt(activity.ActivityOneId)}`).then((response) => {
                            if (response.data) {
                                setListOfActivities((prevValues) => ({
                                    ...prevValues,
                                    [activity.id]: {
                                        ...activity,
                                        username: activity.username,
                                        activityTitle: response.data.transcript_source_id,
                                    }
                                }));
                            }
                        })
                    })()
                } else {
                    (async () => {
                        //returns data of activity one with corresponding activity one id. 
                        await axios.get(`https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/activityone/byId/${parseInt(activity.ActivityOneId)}`).then((response) => {
                            if (response.data) {
                                setListOfActivities((prevValues) => ({
                                    ...prevValues,
                                    [activity.id]: {
                                        ...activity,
                                        activityTitle: response.data.transcript_source_id,
                                    }
                                }));
                            }
                        })
                    })()
                }
            })
        }
    })
}
