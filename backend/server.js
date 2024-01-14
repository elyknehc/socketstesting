const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

io.on("connection", (socket) => {
	console.log("New client connected");

	socket.on("join room", (room) => {
		socket.join(room);
	});

	socket.on("chat message", ({ msg, room }) => {
		io.to(room).emit("chat message", msg);
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Listening on port ${port}`));
