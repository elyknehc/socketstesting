import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// Initialize the socket connection outside of the component
const socket = io("http://localhost:4000");

function App() {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [room, setRoom] = useState("");
	const [roomInput, setRoomInput] = useState("");

	// Function to generate a random room ID
	const generateRoomId = () => {
		return Math.random().toString(36).substring(2, 9);
	};

	// Function to handle room creation
	const handleRoomCreate = () => {
		const roomId = generateRoomId();
		setRoom(roomId);
		joinRoom(roomId);
	};

	// Function to join a room
	const joinRoom = (roomId) => {
		setRoom(roomId);
		navigator.clipboard.writeText(roomId); // Copy room ID to clipboard
		socket.emit("join room", roomId);
	};

	// Function to handle joining an existing room
	const handleJoinRoom = () => {
		joinRoom(roomInput);
	};

	// useEffect to handle socket events
	useEffect(() => {
		// Listen for incoming messages
		socket.on("chat message", (msg) => {
			setMessages((messages) => [...messages, msg]);
		});

		// Cleanup function to remove the event listener
		return () => {
			socket.off("chat message");
		};
	}, []); // Empty dependency array means this runs once on mount

	// Function to handle message submission
	const handleSubmit = (e) => {
		e.preventDefault();
		if (message && room) {
			// Send message along with room information
			socket.emit("chat message", { msg: message, room });
			setMessage("");
		}
	};

	// JSX for the component
	console.log("hello");
	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center mb-4">
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					onClick={handleRoomCreate}
				>
					Create New Room
				</button>
				<div className="flex gap-2">
					<input
						className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						placeholder="Enter Room ID"
						value={roomInput}
						onChange={(e) => setRoomInput(e.target.value)}
					/>
					<button
						className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
						onClick={handleJoinRoom}
					>
						Join Room
					</button>
				</div>
			</div>
			<div>
				<p className="mb-2">
					Current Room: <span className="font-semibold">{room}</span>
				</p>
				<ul id="messages" className="list-disc pl-5 mb-4">
					{messages.map((msg, index) => (
						<li key={index} className="mb-1">
							{msg}
						</li>
					))}
				</ul>
				<form
					id="form"
					action=""
					onSubmit={handleSubmit}
					className="flex gap-2"
				>
					<input
						className="flex-grow shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="input"
						autoComplete="off"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					<button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
						Send
					</button>
				</form>
			</div>
		</div>
	);
}

export default App;
