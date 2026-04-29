"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export function useCalendarSocket(onRefresh: () => void) {

  useEffect(() => {

    socket.emit("join_calendar");

    socket.on("calendar_refresh", () => {

      console.log("📅 Calendar refresh event received");

      onRefresh();

    });

    return () => {
      socket.off("calendar_refresh");
    };

  }, [onRefresh]);

}