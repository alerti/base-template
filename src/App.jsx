import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';

const VideoCallApp = () => {
  const [inCall, setInCall] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(true);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  const handleJoinCall = () => {
    if (roomCode && username) {
      setInCall(true);
    }
  };
  
  const handleLeaveCall = () => {
    setInCall(false);
    setRoomCode('');
    setUsername('');
    stopMediaTracks();
  };
  
  const handleSendMessage = () => {
    if (chatInput.trim()) {
      const newMessage = {
        user: username,
        content: chatInput.trim(),
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setChatInput('');
    }
  };
  
  const toggleAudio = () => {
    const newAudioEnabled = !audioEnabled;
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = newAudioEnabled;
      });
    }
    setAudioEnabled(newAudioEnabled);
  };
  
  const toggleVideo = () => {
    const newVideoEnabled = !videoEnabled;
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = newVideoEnabled;
      });
    }
    setVideoEnabled(newVideoEnabled);
  };
  
  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };
  
  useEffect(() => {
    if (inCall) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        })
        .catch((err) => {
          console.error('Error accessing media devices.', err);
        });
    }
    // Cleanup on component unmount
    return () => {
      stopMediaTracks();
    };
  }, [inCall]);
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {!inCall ? (
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <h1 className="text-2xl font-bold text-center">Join a Meeting</h1>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Your Name</Label>
                  <Input
                    id="username"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="room">Meeting Code</Label>
                  <Input
                    id="room"
                    placeholder="Enter meeting code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                  />
                </div>
                <Button className="w-full h-12 text-lg" onClick={handleJoinCall}>
                  Join
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col flex-1 relative">
          {/* Video Area */}
          <div className="flex-1 bg-black relative">
            {/* Video Element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            ></video>
            {/* User's Name Overlay */}
            <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              <p className="text-lg">{username}</p>
            </div>
            {/* Control Buttons */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <Toggle
                pressed={audioEnabled}
                onPressedChange={toggleAudio}
                className="text-white w-12 h-12 flex items-center justify-center bg-gray-800 bg-opacity-75 rounded-full"
              >
                {audioEnabled ? '🔊' : '🔇'}
              </Toggle>
              <Toggle
                pressed={videoEnabled}
                onPressedChange={toggleVideo}
                className="text-white w-12 h-12 flex items-center justify-center bg-gray-800 bg-opacity-75 rounded-full"
              >
                {videoEnabled ? '🎥' : '📷'}
              </Toggle>
              <Button
                variant="destructive"
                className="text-white w-12 h-12 flex items-center justify-center bg-red-600 bg-opacity-75 rounded-full"
                onClick={handleLeaveCall}
              >
                ❌
              </Button>
            </div>
            {/* Side Panel Toggle Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                onClick={() => setShowChat(!showChat)}
                className="bg-gray-800 bg-opacity-75 text-white px-4 py-2 rounded-full"
              >
                {showChat ? 'Hide Chat' : 'Show Chat'}
              </Button>
            </div>
          </div>
          {/* Chat Panel */}
          {showChat && (
            <div className="absolute inset-0 bg-white bg-opacity-95 md:w-1/3 md:static flex flex-col">
              <Tabs defaultValue="chat" className="flex flex-col flex-1">
                <TabsList className="flex">
                  <TabsTrigger value="chat" className="flex-1">
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="people" className="flex-1">
                    People
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="chat" className="flex flex-col flex-1">
                  <div className="flex-1 p-2 overflow-y-auto">
                    {messages.length > 0 ? (
                      messages.map((msg, idx) => (
                        <div key={idx} className="mb-2">
                          <div className="flex items-center">
                            <Avatar className="mr-2 h-6 w-6">
                              <span className="sr-only">{msg.user}</span>
                            </Avatar>
                            <span className="font-semibold">{msg.user}</span>
                            <span className="ml-2 text-xs text-gray-500">
                              {msg.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="ml-8">{msg.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 mt-4">
                        No messages yet.
                      </p>
                    )}
                  </div>
                  <div className="p-2 border-t">
                    <Textarea
                      placeholder="Type a message"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="resize-none h-16"
                    />
                    <Button
                      className="mt-2 w-full h-12 text-lg"
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim()}
                    >
                      Send
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="people" className="flex flex-col flex-1">
                  <div className="flex-1 p-2 overflow-y-auto">
                    <div className="flex items-center mb-2">
                      <Avatar className="mr-2 h-6 w-6">
                        <span className="sr-only">{username}</span>
                      </Avatar>
                      <span className="font-semibold">{username} (You)</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              {/* Hide Chat Button */}
              <Button
                onClick={() => setShowChat(false)}
                className="m-2 self-end bg-gray-800 text-white px-4 py-2 rounded-full"
              >
                Hide Chat
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoCallApp;
