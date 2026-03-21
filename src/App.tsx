import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { CRMList } from './pages/CRMList';
import { ClientProfile } from './pages/ClientProfile';
import { DashboardHome } from './pages/DashboardHome';
import { MyTasks } from './pages/MyTasks';
import { Notifications } from './pages/Notifications';
import { BRDDrafting } from './pages/BRDDrafting';
import { BRDViewer } from './pages/BRDViewer';
import { ArchitectureQueue } from './pages/ArchitectureQueue';
import { FRDBuilder } from './pages/FRDBuilder';
import { MeetingNotes } from './pages/MeetingNotes';
import { PaymentHistory } from './pages/PaymentHistory';
import { Invoices } from './pages/Invoices';
import { Login } from './pages/Login';
import { ProtectedLayout } from './components/layout/ProtectedRoute';
import { AddClient } from './pages/AddClient';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/tasks" element={<MyTasks />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/crm" element={<CRMList />} />
        <Route path="/clients/new" element={<AddClient />} />
        <Route path="/clients/:id" element={<ClientProfile />} />
        <Route path="/brd" element={<BRDDrafting />} />
        <Route path="/brd/:id" element={<BRDViewer />} />
        <Route path="/arch-queue" element={<ArchitectureQueue />} />
        <Route path="/arch-queue/:id/frd" element={<FRDBuilder />} />
        <Route path="/meetings" element={<MeetingNotes />} />
        <Route path="/payments" element={<PaymentHistory />} />
        <Route path="/invoices" element={<Invoices />} />
      </Route>
    </Routes>
  );
}

export default App;
