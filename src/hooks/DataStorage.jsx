import axios from "axios";

// add case for new chain

export const ActivityDataStorage = async (activityId, activityLabel, bundledData) => {

    //activity exists
    if (activityId !== undefined) {
        //updates activity
        await axios.post(`https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/${activityLabel}/byId/${activityId}`, bundledData)
    } else {
        //creates a new entry of the activity
        await axios.post(`https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/${activityLabel}`, bundledData)
            .then((response) => {
                switch (activityLabel) {
                    case 'activityone': {
                        const ActivityOneId = response.data.id;
                        sessionStorage.setItem("ActivityOneId", ActivityOneId);
                        const ActivitiesID = response.data.ActivitiesId.id;
                        sessionStorage.setItem("ActivitiesId", ActivitiesID);
                        break
                    }
                    case 'activitytwo': {
                        const ActivityTwoId = response.data.id;
                        sessionStorage.setItem("ActivityTwoId", ActivityTwoId);
                        break
                    }
                    case 'activitythree': {
                        const ActivityThreeId = response.data.id;
                        sessionStorage.setItem("ActivityThreeId", ActivityThreeId);
                        break
                    }
                    case 'activityfour': {
                        const ActivityFourId = response.data.id;
                        sessionStorage.setItem("ActivityFourId", ActivityFourId);
                        break
                    }
                    case 'activityfive': {
                        const ActivityFiveId = response.data.id;
                        sessionStorage.setItem("ActivityFiveId", ActivityFiveId);
                        break
                    }
                    case 'activitysix': {
                        const ActivitySixId = response.data.id;
                        sessionStorage.setItem("ActivitySixId", ActivitySixId);
                        break
                    }
                    default: {
                        console.log("error")
                    }
                }
            });
    }

}

export const InstructorCustomActivitiesDataStorage = (activityId, activities, setActivityEvents) => {

    const activityLabels = ['One', 'Two', 'Three', 'Four', 'Five', 'Six']
    let activityEvents = []

    activityLabels.forEach((label, index) => {

        const activityKey = `activity${label}`;
        let postData = {
            label: document.getElementById(`activity-${label.toLowerCase()}-${activityId}-label-${activities[activityKey].key}`).innerHTML,
            instruction: document.getElementById(`activity-${label.toLowerCase()}-${activityId}-instruction-${activities[activityKey].key}`).innerHTML
        }
        switch (label) {
            case 'One': {
                postData.isEditableTranscript = activities[activityKey].isEditableTranscript
                break
            }
            case 'Two': {
                postData.isHighlightingAllowed = activities[activityKey].isHighlightingAllowed
                break
            }
            case 'Three': {
                postData.isModelAllowed = activities[activityKey].isModelAllowed
                postData.model = activities[activityKey].model
                break
            }
            case 'Five': {
                postData.clustering = activities[activityKey].clustering
                break
            }
        }

        if (activities[activityKey].key) {
            axios.post(`https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/activity${label.toLowerCase()}/home/${activities[activityKey].key}`,
                postData
            );
            activityEvents.push('Update')
        } else {
            postData.lastAuthored = 'instructor'
            ActivityDataStorage(undefined, 'activityone', postData)
            activityEvents.push('Create')
        }
    })

    setActivityEvents(activityEvents)

}

//figure out how to store main activity id and sub activity ids

