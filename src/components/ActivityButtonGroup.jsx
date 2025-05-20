import React from 'react';
import { Button } from '@mui/material';
import './Components.css'
import dashboardNavigation from '../utils/Navigation.jsx'
import ActivityDeleteButton from './ActivityDeleteButton.jsx';

const ActivityButtonGroup = ({ activity, customStudent }) => {

    const activityLabels = ['one', 'two', 'three', 'four', 'five', 'six'];

    return (
        <div className="activity-buttons">
            {activityLabels.map((label, i) => (
                <Button
                    key={i}
                    disableRipple
                    onClick={() => dashboardNavigation(activity.activityIds[i], label, activity)}
                    disabled={!activity.activityIds[i]}
                    className={`activity-button ${activity.activityIds[i] ? 'active' : 'disabled'}`}
                >
                    {label}
                </Button>
            ))}
            {customStudent && <ActivityDeleteButton />}
        </div>
    )
}

export default ActivityButtonGroup