import axios from "axios"

export const ActivityDataDeletion = async ({ value }) => {

    const activityLabel = ['One', 'Two', 'Three', 'Four', 'Five', 'Six']

    //removes chain of activities in activities table
    await axios.post("https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/home/delete-activity",
        { activityId: value.activityId })

    activityLabel.forEach(async (label, index) => {
        const activityKey = `activity${label}`
        await axios.post(`https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/activity${label.toLowerCase()}/delete-activity`,
            { activityId: value[activityKey].key })

    })

}