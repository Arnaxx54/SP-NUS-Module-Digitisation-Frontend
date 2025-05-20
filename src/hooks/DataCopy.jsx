import { ActivityDataStorage } from "./DataStorage";
import axios from "axios";

const activityLabels = ['One', 'Two', 'Three', 'Four', 'Five', 'Six']

export const DataCopy = ({
    activityIds
}) => {
    activityLabels.forEach(async (label, index) => {
        const activityKey = `activity${label}Id`
        if (activityIds.activityKey) {
            const response = await axios.get(`https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/activity${label.toLowerCase}/byId/${activityIds.activityKey}`);

            if (Object.keys(response.data) !== 0) {
                delete response.data['id']
                delete response.data['createdAt']
                delete response.data['updatedAt']
            }

            const bundledData = {
                id: label === 'One' ? sessionStorage.getItem("UserId") : sessionStorage.getItem("ActivitiesId"),
                content: response.data
            }

            ActivityDataStorage(undefined, `activity${label.toLowerCase()}`, bundledData)

        }
    })
}