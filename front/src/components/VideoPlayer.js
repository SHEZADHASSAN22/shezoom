import React, { useContext } from "react";
import { SocketContext } from "../SocketContext";

const VideoPlayer = () => {
  const {
    name,
    setname,
    callAccepted,
    myVideo,
    userVideo,
    callEnded,
    stream,
    call,
  } = useContext(SocketContext);

  return (
    <div className="video-player">
      {stream && (
        <div className="video">
          <video playsInline muted ref={myVideo} autoPlay />
        </div>
      )}

      {callAccepted && !callEnded && (
        <div className="video">
          <video playsInline ref={userVideo} autoPlay />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
