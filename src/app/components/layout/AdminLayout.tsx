import React from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { PlaygroundFloatingButton } from "../ui/PlaygroundFloatingButton";

export function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5F5]">
      <Sidebar mode="admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export function CustomerLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5F5]">
      <Sidebar mode="customer" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
      <PlaygroundFloatingButton />
    </div>
  );
}