import React,  {createContext, useState, useRef, useEffect } from 'react';
import {io} from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io('http://localhost:5000');

const ContextProvider = ({children}) => {
    const [stream, setstream] = useState(null);
    const [me, setMe] = useState("");
    const [call, setCall] = useState({});

    const [callAccepted, setcallAccepted] = useState(false);
    const [callEnded, setcallEnded] = useState(false);

    const [name, setname] = useState('')

    //useref is like usestate excpet that changing it wont cause a rerender
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    
    // use effect - run the code inside after wtv in the array changes
    // empty array means use effect only on initial render
    useEffect(() => {
        //navigator object to get access to video cam, returns 
        navigator.mediaDevices.getUserMedia({ video: true, audio: true})
            .then((currentStream) => {
                setstream(currentStream);

                myVideo.current.srcObject = currentStream;
            })

        socket.on('me', (id) => setMe(id));

        socket.on('calluser', ({from, name: callerName, signal}) => {
            setCall({ isReceivedCall: true, from, name: callerName, signal});
        })

    }, []) 

    const answerCall = () => {
        setcallAccepted(true);

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream
        });

        peer.on('signal', (data) => {
            socket.emit('anwsercall', {
                signal: data,
                to: call.from
            })
        })

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        })

        peer.signal(call.signal);

        connectionRef.current = peer;
    }

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream
        });

        peer.on('signal', (data) => {
            socket.emit('calluser', {
                userToCall : id,
                signalData: data,
                from: me,
                name
            })
        })

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        })

        socket.on('callaccepted', (signal) => {
            setcallAccepted(true);

            peer.signal(signal);
        })

        connectionRef.current = peer;
    }

    const leaveCall = () => {
        setcallEnded(true);

        connectionRef.current.destroy();

        window.location.reload();
    } 

    return (
        <SocketContext.Provider value={
            {
                call,
                callAccepted,
                myVideo,
                userVideo,
                stream,
                name,
                setname,
                callEnded,
                me,
                callUser,
                leaveCall,
                answerCall
            }
        }>
            {children}
        </SocketContext.Provider>
    )
}

export {ContextProvider, SocketContext};