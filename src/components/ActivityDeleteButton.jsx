import { Button, CircularProgress, Dialog, DialogActions, DialogTitle, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import './Components.css'
import { useState } from 'react';

const ActivityDeleteButton = (activity, activityId) => {

    const [loadingIdDelete, setLoadingIdDelete] = useState(null)
    const [open, setOpen] = useState(false)
    const [deleteItem, setDeleteItem] = useState(null);

    // //handles deletion of templates
    // const handleDelete = async (value) => {

    //     setLoadingIdDelete(value.id)

    //     try {

    //         //removes chain of activities in activities table
    //         await axios.post("https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/home/delete-activity", { activityId: value.id })

    //         //deletes activity one id
    //         await axios.post("https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/activityone/delete-activity", { activityId: value.ActivityOneId })

    //         //deletes activity two id
    //         if (value.ActivityTwoId) {
    //             await axios.post("https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/activitytwo/delete-activity", { activityId: value.ActivityTwoId })
    //         }

    //         //deletes activity three id
    //         if (value.ActivityThreeId) {
    //             await axios.post("https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/activitythree/delete-activity", { activityId: value.ActivityThreeId })
    //         }

    //         //deletes activity four id
    //         if (value.ActivityFourId) {
    //             await axios.post("https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/activityfour/delete-activity", { activityId: value.ActivityFourId })
    //         }

    //         //deletes activity five id
    //         if (value.ActivityFiveId) {
    //             await axios.post("https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/activityfive/delete-activity", { activityId: value.ActivityFiveId })
    //         }

    //         //deletes activity six id
    //         if (value.ActivitySixId) {
    //             await axios.post("https://sp-nus-module-digitisation-74b6b485ab94.herokuapp.com/activitysix/delete-activity", { activityId: value.ActivitySixId })
    //         }

    //         setLoadingIdDelete(null);

    //         setYourActivitiesData(prevActivities => {
    //             const updatedActivities = { ...prevActivities };
    //             delete updatedActivities[value.id];
    //             return updatedActivities;
    //         });

    //     } catch (error) {

    //         console.error('Failed to update template:', error);
    //         setLoadingIdDelete(null);

    //     }

    // }

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
                    <Button onClick={() => setOpen(false)} >
                        Cancel
                    </Button>
                    {/* <Button onClick={() => {
                        if (deleteItem) handleDelete(deleteItem);
                        setOpen(false);
                        setDeleteItem(null);
                    }} autoFocus>
                        Proceed
                    </Button> */}
                    <Button>
                        Proceed
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };


    if (loadingIdDelete === activityId) {
        return (
            <CircularProgress size={37} className='delete-template-loading' />
        )
     } else {
        return (
            <>
                <Button disableRipple onClick={() => { setOpen(true); setDeleteItem(activity); }} className='activity-button-delete'>
                    <ClearIcon />
                </Button>
                {confirmDeleteDialog()}
            </>
        )
    }

}

export default ActivityDeleteButton