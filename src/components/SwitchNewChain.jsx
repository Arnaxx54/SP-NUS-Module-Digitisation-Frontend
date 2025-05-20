import { FormControlLabel, Switch, Tooltip } from '@mui/material';
import './Components.css'
import InfoIcon from '@mui/icons-material/Info';

const SwitchNewChain = ({ activityLabel, isNewChain, setIsNewChain, isActivityOne, isNewActivityInit }) => {
    return (
        <>
            {/*switch button to create a new chain and reinitialise future activities*/}
            <FormControlLabel className="switch-label"
                disabled={isNewActivityInit}
                control={
                    <Switch checked={isNewChain} onChange={() => {
                        if (!isNewChain) {
                            // eslint-disable-next-line no-restricted-globals
                            if (confirm(`Please note: Data related to the following ${6 - activityLabel} activities will be permanently erased.`)) {
                                setIsNewChain((prev) => !prev);
                            }
                        } else {
                            setIsNewChain((prev) => !prev);
                        }
                    }}
                    />
                }
                label={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {isActivityOne ? (`Edit Transcript`) : (`Re-initialise Activity ${activityLabel} and subsequent activites`)}
                        <Tooltip title={'Activate this switch to edit your transcript text. Any changes will be saved on submission. Caution: Doing submitting a changed transcript will reset all the subsequent activities.'}>
                            <InfoIcon style={{ marginLeft: 4 }} fontSize="small" />
                        </Tooltip>
                    </div>
                }
            />
        </>
    )
}

export default SwitchNewChain