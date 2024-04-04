import React from 'react';
import { Typography, Button, Tooltip } from "@mui/material";
import Draggable from 'react-draggable';
import './Activity5.css';

const DisplayComponents = ({ clustData, handleDrag, removeLabel, handleCreateCopy, handleDeleteCopy, alternateView }) => {

    if (Object.keys(clustData).length !== 0) {
        return Object.entries(clustData.content).map(([key, data]) => {
            if (data.type === "label") {
                const style = {
                    position: 'absolute',
                    left: `${data.x}px`,
                    top: `${data.y}px`,
                };
                return (
                    <Draggable
                        defaultPosition={{ x: data.x, y: data.y }}
                        key={data.id}
                        onDrag={(e, dragData) => handleDrag(e, dragData, key)}
                        bounds="parent"
                    >
                        <div data-height-id={data.id} className='draggableResponseLabel' style={style}>
                            <Typography
                                // prevents creation of a new line when pressing the 'enter' button
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") { e.preventDefault(); }
                                }}
                                style={{ backgroundColor: data.color }} id={data.id} className='draggable-response-label-child' contentEditable={!data.removed} suppressContentEditableWarning={true} variant="h6"
                                onBlur={() => {
                                    let text = document.getElementById(data.id).innerHTML;
                                    text === "" || text === `<br>`
                                        ? removeLabel(key)
                                        : console.log(text);
                                }}
                            >
                                {data.clusterLabelA5 ? data.clusterLabelA5 : data.clusterLabelA4}
                            </Typography>
                        </div>
                    </Draggable>
                );
            } else if (data.response_id) {
                return Object.entries(data.response_text).map(([key2, data2]) => {
                    if (data2.clusterData) {
                        const responseBackgroundColor = alternateView ? data2.clusterData.AIColor : data2.clusterData.color ? data2.clusterData.color : "lightgrey";
                        const style = {
                            position: 'absolute',
                            left: `${data2.clusterData.x}px`,
                            top: `${data2.clusterData.y}px`,
                            backgroundColor: responseBackgroundColor,
                        };
                        return (
                            <Draggable
                                defaultPosition={{ x: data2.clusterData.x, y: data2.clusterData.y }}
                                key={data2.clusterData.id}
                                onDrag={(e, d) => handleDrag(e, d, key, key2)}
                                bounds="parent"
                            >
                                <div data-height-id={data2.clusterData.id} className={`draggableResponse`} style={style}>
                                    <div style={{ display: "flex" }}>
                                        <Button variant="outlined" onClick={() => handleCreateCopy(key, key2)} className='create-copy-button'>+</Button>
                                        {data2.clusterData.type === "text-copy" && <Button variant="outlined" onClick={() => handleDeleteCopy(key, key2)} className='create-delete-button'>-</Button>}
                                    </div>
                                    <Tooltip title={data.response_text[key2].text}>
                                        <Typography id={data2.clusterData.id} fontSize={13}>
                                            {data.response_text[key2].text}
                                        </Typography>
                                    </Tooltip>
                                </div>
                            </Draggable>
                        );
                    }
                });
            }
        });
    }
    return null;

}

export default DisplayComponents