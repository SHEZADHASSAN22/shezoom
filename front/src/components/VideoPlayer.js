import React, {useContext} from 'react';
import { SocketContext  } from '../SocketContext';

const VideoPlayer = () => {
    const {name, setname, callAccepted, myVideo, userVideo, callEnded, stream, call} = useContext(SocketContext);

    return (
        <div className="video-player">
            {stream && (
                <div className="video">
                    <header>{name || 'Name'}</header>
                    <video playsInline muted ref={myVideo} autoPlay />
                </div>
            )}

            {callAccepted && !callEnded && (
                <div className="video">
                    <header>{call.name || 'Name'}</header>
                    <video playsInline ref={userVideo} autoPlay />
                </div>
            )}
        </div>
    )
}

export default VideoPlayer;
