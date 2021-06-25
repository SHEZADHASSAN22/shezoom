import React, {useContext, useState} from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SocketContext } from '../SocketContext';

const Options = ({children}) => {
    const {me, callAccepted, name, setname, callEnded, leaveCall, callUser } = useContext(SocketContext);
    const [idToCall, setidToCall] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
    }
    
    return (
        <div className="options">
            <div className="account-info">
                <form onSubmit={handleSubmit}>
                    <input placeHolder="Enter Name" label="Name" value={name} onChange={(e) => {setname(e.target.value)}}/>
                    {!callAccepted && !callEnded && (
                    <CopyToClipboard text={me}>
                        <button type="button">
                        Copy Your ID
                        </button>
                    </CopyToClipboard>
                    )}
                </form>
                
            </div>
            <div className="make-a-call">
                <div>
                    {callAccepted && !callEnded ? (
                        <button onClick={leaveCall}>Hang Up</button>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <input label="ID to Call" value={idToCall} onChange={(e) => setidToCall(e.target.value)} />
                            <button type="button" onClick={() => callUser(idToCall)}>Call</button>
                        </form>
                    )}
                </div>
            </div>
            {children}
        </div>
    )
}

export default Options
