import { Server }
from "socket.io";

let io;

/* =====================================================
   INIT SOCKET
===================================================== */

export const initSocket =
  (server) => {

    io =
      new Server(
        server,
        {

          cors: {

            origin: "*",

            methods: [
              "GET",
              "POST",
            ],
          },
        }
      );

    io.on(
      "connection",

      (socket) => {

        console.log(
          "SOCKET CONNECTED:",
          socket.id
        );

        socket.on(
          "disconnect",

          () => {

            console.log(
              "SOCKET DISCONNECTED:",
              socket.id
            );
          }
        );
      }
    );

    return io;
  };

/* =====================================================
   GET IO
===================================================== */

export const getIO =
  () => {

    if (!io) {

      throw new Error(
        "Socket.io belum diinisialisasi"
      );
    }

    return io;
  };