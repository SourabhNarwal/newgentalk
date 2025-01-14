import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";


//const API_KEY =import.meta.env.VITE_TURN_SERVER_API_KEY;
//let iceServers = [];
let iceServers = [
  {
    urls: "stun:stun.relay.metered.ca:80",
  },
  {
    urls: "turn:in.relay.metered.ca:80",
    username: "8dd47c40a65b5961bbbe22fc",
    credential: "V8MET6vR39eZyhkY",
  },
  {
    urls: "turn:in.relay.metered.ca:80?transport=tcp",
    username: "8dd47c40a65b5961bbbe22fc",
    credential: "V8MET6vR39eZyhkY",
  },
  {
    urls: "turn:in.relay.metered.ca:443",
    username: "8dd47c40a65b5961bbbe22fc",
    credential: "V8MET6vR39eZyhkY",
  },
  {
    urls: "turns:in.relay.metered.ca:443?transport=tcp",
    username: "8dd47c40a65b5961bbbe22fc",
    credential: "V8MET6vR39eZyhkY",
  },
]
iceServers[0].urls = "stun:stun.l.google.com:19302";
const maxcalltime = 5;
const SERVER_URL = 'wss://6062-117-203-246-41.ngrok-free.app';

// (async () => {
//   const response = await axios.get(`https://newgentalk.metered.live/api/v1/turn/credentials?apiKey=${API_KEY}`);
//   iceServers = response.data;
//   iceServers[0].urls = "stun:stun.l.google.com:19302";
//   // console.log(iceServers);
// })();

const Chatroom = () => {

  const navigate = useNavigate();
  const handleLogout = () => {
    console.log("Logout Clicked");
    navigate('/');
  }

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("Initializing...");
  const [localPeerId, setLocalPeerId] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socket = useRef(null);
  const peerConnection = useRef(null);
  const roomId = useRef(null);
  const callTimerRef = useRef(null);
  const warningTimerRef = useRef(null);

  useEffect(() => {
    // Request user media on load
    getMedia();
    socket.current = new WebSocket(SERVER_URL);

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'peer-ready':
          setStatus("Connecting...");
          roomId.current = data.peerId;
          startConnection(data.isInitiator);
          break;

        case 'offer':
          handleOffer(data.payload);
          break;

        case 'answer':
          handleAnswer(data.payload);
          break;

        case 'ice-candidate':
          handleIceCandidate(data.payload);
          break;
        case 'peer-disconnected':
          handlePeerDisconnected();
          break;
        default:
          console.log(`Unknown message type: ${data.type}`);
      }
    };



    return () => {
      socket.current.close();
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      if (localVideoRef.current) {
        localVideoRef.current.getTracks().forEach((track) => track.stop());
      }
    };


  }, []);

  // const constraints = {
  //   video: {
  //     width: { max: 640 },   // Max width for 480p
  //     height: { max: 480 },  // Max height for 480p
  //     frameRate: { max: 15 }, // Lower frame rate to save bandwidth
  //     // bitrate: { max: 500000 } // Approx. 500 kbps for 480p
  //   },
  //   audio: {
  //     sampleRate: 16000,       // Lower audio sample rate
  //     channelCount: 1,         // Mono audio
  //     //bitrate: 32000,          // Audio bitrate (32 kbps)
  //     echoCancellation: true,  // Enable echo cancellation
  //     noiseSuppression: true,   // Reduce background noise
  //     autogainControl: true,    // Adjust mic levels automatically
  //   }
  // };
  const constraints = {
    video: true,
    audio: true,
  };

  const getMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Stream obtained from getUserMedia:", stream);
      const tracks = stream.getTracks();
      console.log("All tracks:", tracks);
      tracks.forEach((track) => {
        console.log("Track kind:", track.kind);
      });
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();

      console.log("Video Tracks:", videoTracks);
      console.log("Audio Tracks:", audioTracks);

      if (videoTracks.length === 0) {
        console.warn("No video tracks found.");
      }
      if (audioTracks.length === 0) {
        console.warn("No audio tracks found.");
      }
      localVideoRef.current = stream;
      if(localVideoRef.current){
        console.log("localVideoRef.current:",localVideoRef.current);
      }
      setLocalStream(stream);

      setStatus("Ready to connect");
    } catch (err) {
      console.error('Error accessing media devices.', err);
      setStatus("Permission denied. Cannot proceed without access.");
    }
  };
  const startConnection = async (isInitiator) => {

    peerConnection.current = new RTCPeerConnection({
      iceServers,
      //bundlePolicy: "max-bundle",

    });

    if (localVideoRef.current) {
      console.log('localStream:', localVideoRef.current);
      localVideoRef.current.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, localVideoRef.current);
      });
    } else {
      console.error("Local stream is not initialized.");
      console.log('localStream:', localStream);
    }

    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      remoteVideoRef.current.srcObject = event.streams[0];
      startCallTimers();
      monitorConnection();
      optimizeBandwidth();
    };

    peerConnection.current.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.current.send(
          JSON.stringify({
            type: 'ice-candidate',
            payload: candidate,
          })
        );
      }
    };

    if (isInitiator) {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.current.send(
        JSON.stringify({
          type: 'offer',
          payload: offer,
        })
      );
    }
  };
  const handleOffer = async (offer) => {
    await peerConnection.current.setRemoteDescription(offer);
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    socket.current.send(
      JSON.stringify({
        type: 'answer',
        payload: answer,
      })
    );
  };

  const handleAnswer = async (answer) => {
    await peerConnection.current.setRemoteDescription(answer);
  };

  const handleIceCandidate = async (candidate) => {
    try {
      await peerConnection.current.addIceCandidate(candidate);
    } catch (err) {
      console.error('Error adding received ICE candidate', err);
    }
  };
  const handlePeerDisconnected = () => {
    setStatus("Peer disconnected.");
    stopConnection();
  };
  const connectToRoom = () => {
    socket.current.send(
      JSON.stringify({
        type: 'join',
      })
    );
    setIsConnected(true);
    setStatus("Searching for a peer...");
  };

  const disconnect = () => {
    socket.current.send(
      JSON.stringify({
        type: 'leave',
      })
    );
    setIsConnected(false);
    if (peerConnection.current) {
      peerConnection.current.close();
    }
  };
  const resetConnection = (message) => {
    setStatus(message);
    stopConnection();
  };
  const monitorConnection = () => {
    const pc = peerConnection.current;
    if (pc) {
      pc.oniceconnectionstatechange = () => {
        console.log("ICE Connection State:", pc.iceConnectionState);
        if (pc.iceConnectionState === "disconnected" || pc.iceConnectionState === "failed") {
          resetConnection("Connection lost.");
          //searchForPeer();
        }
      };
    }
  };

  const optimizeBandwidth = () => {
    const pc = peerConnection.current;
    if (pc) {
      const senders = pc.getSenders();
      const transceivers = pc.getTransceivers(); // Cache transceivers for efficiency

      senders.forEach((sender) => {
        const params = sender.getParameters();
        if (!params.encodings) params.encodings = [{}];

        if (sender.track.kind === "video") {
          params.encodings[0].maxBitrate = 500000; // Limit video bitrate
          params.encodings[0].maxFramerate = 15; // Limit video frame rate
          params.encodings[0].scalabilityMode = "L3T3"; // Enable scalability for VP9

          transceivers.forEach((transceiver) => {
            if (transceiver.sender === sender) {
              const videoCodecs = RTCRtpSender.getCapabilities("video").codecs || [];
              const preferredVideoCodecs = videoCodecs.filter((codec) =>
                codec.mimeType === "video/VP9" || codec.mimeType === "video/VP8"
              );

              if (preferredVideoCodecs.length > 0) {
                try {
                  transceiver.setCodecPreferences(preferredVideoCodecs);
                } catch (error) {
                  console.error("Error setting video codec preferences:", error);
                }
              } else {
                console.warn("No valid video codecs found for preferences.");
              }
            }
          });
        } else if (sender.track.kind === "audio") {
          params.encodings[0].maxBitrate = 32000; // Limit audio bitrate

          transceivers.forEach((transceiver) => {
            if (transceiver.sender === sender) {
              const audioCodecs = RTCRtpSender.getCapabilities("audio").codecs || [];
              const preferredAudioCodecs = audioCodecs.filter((codec) =>
                codec.mimeType === "audio/opus"
              );

              if (preferredAudioCodecs.length > 0) {
                try {
                  transceiver.setCodecPreferences(preferredAudioCodecs);
                } catch (error) {
                  console.error("Error setting audio codec preferences:", error);
                }
              } else {
                console.warn("No valid audio codecs found for preferences.");
              }
            }
          });
        }

        sender.setParameters(params).catch((error) => {
          console.error("Error optimizing bandwidth:", error);
        });
      });
    }
  };

  const startCallTimers = () => {
    // Notify user at 24 minutes
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
    }, (maxcalltime - 1) * 60 * 1000); // 24 minutes

    // Disconnect call at 25 minutes
    callTimerRef.current = setTimeout(() => {
      stopConnection();
      setStatus('Call automatically disconnected after 25 minutes.');
    }, (maxcalltime) * 60 * 1000); // 25 minutes
  };

  const stopConnection = () => {

    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    if (callTimerRef.current) {
      clearTimeout(callTimerRef.current);
    }
    setShowWarning(false);
    setRemoteStream(null);

    disconnect();
  };
  const handleStopbtn = () => {
    setStatus("YOU Stopped all connections and searches.");
    stopConnection();
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-yellow-200  to-pink-300">
      {/* Header */}
      <header className="flex items-center justify-between p-4 justify-evenly bg-white bg-opacity-90 shadow-md">
        <h1 className="text-3xl font-extrabold text-purple-700">newGentalk...</h1>
        <h2>local peerid:{localPeerId}</h2>
        <button
          onClick={() => handleLogout()}
          className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-purple-700 rounded-lg hover:from-purple-700 hover:to-pink-500 focus:outline-none focus:ring focus:ring-pink-300"
        >
          Logout
        </button>
      </header>

      {/* Video Section */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        {showWarning && (
          <div className="mb-4 text-red-600 font-bold">
            Call will disconnect in 1 minute. Wrap up your conversation!
          </div>
        )}

        <h2>local peerid:{localPeerId}</h2>
        <div className=" mt-6 flex space-x-4">
          <button
            onClick={connectToRoom}
            disabled={isConnected}
            className={`px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 
            rounded-lg hover:from-blue-500 hover:to-green-500 focus:outline-none focus:ring focus:ring-purple-300"
            transition-opacity duration-300 ease-in-out ${isConnected ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`
            }>
            Next
          </button>
          <button
            onClick={handleStopbtn}
            className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-lg hover:from-red-500 hover:to-orange-500 focus:outline-none focus:ring focus:ring-violet-300"
          >
            Stop
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:w-full">

          {/* Remote User Video */}
          <div className="relative bg-black border-4 border-pink-400 rounded-lg aspect-video">
            <p className="absolute bottom-2 left-2 text-sm text-pink-400 font-bold z-10">
              Stranger
            </p>
            <p className="absolute bottom-2 right-2  text-white font-bold text-lg z-20">{status}</p>
            {/* Replace with actual video stream */}
            <video
              ref={(video) => {
                if (video && remoteStream) {
                  video.srcObject = remoteStream;
                  // Wait for the metadata to load before attempting to play
                  video.onloadedmetadata = () => {
                    video.play().catch((error) => {
                      console.error("Error playing remote video:", error);
                    });
                  };
                }
              }}
              playsInline
              className="bg-black w-full h-full border-0 rounded-lg aspect-video transform scale-x-[-1]"
            ></video>

          </div>
          {/* Local User Video */}
          <div className="relative bg-black border-4 border-purple-300 rounded-lg aspect-video">
            <p className="absolute  bottom-2 left-2 text-sm text-purple-300 font-bold z-10">
              You
            </p>

            {/* Replace with actual video stream */}
            <video
              ref={(video) => {
                if (video && localStream) {
                  video.srcObject = localStream;
                  // Wait for the metadata to load before attempting to play
                  video.onloadedmetadata = () => {
                    video.play().catch((error) => {
                      console.error("Error playing local video:", error);
                    });
                  };
                }
              }}
              muted playsInline
              className="bg-black w-full h-full border-0 rounded-lg aspect-video transform scale-x-[-1]"
            ></video>
          </div>

        </div>

        {/* Buttons Section */}
        {/* <div className="mt-6 flex space-x-4">
          <button
            onClick={searchForPeer}
            disabled={isSearching}
            className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 
            rounded-lg hover:from-blue-500 hover:to-green-500 focus:outline-none focus:ring focus:ring-purple-300"
          >
            Next
          </button>
          <button
            onClick={stopConnection}
            className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-lg hover:from-red-500 hover:to-orange-500 focus:outline-none focus:ring focus:ring-violet-300"
          >
            Stop
          </button>
        </div> */}
      </main>
    </div>
  )
}

export default Chatroom;