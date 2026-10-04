import React, { useState, useMemo } from 'react';
import { 
  Truck, 
  Search, 
  Filter, 
  PlusCircle, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight, 
  Eye, 
  FileText, 
  UserCheck, 
  Phone, 
  Building, 
  Calendar,
  AlertTriangle,
  QrCode
} from 'lucide-react';
import { LogisticsDelivery, DeliveryStatus, DeliveryPriority } from '../types';

interface LogisticsTrackerProps {
  deliveries: LogisticsDelivery[];
  onOpenNewDispatch: () => void;
  onViewDeliveryDetails: (delivery: LogisticsDelivery) => void;
  onQuickUpdateStatus: (delivery: LogisticsDelivery) => void;
}

export const LogisticsTracker: React.FC<LogisticsTrackerProps> = ({
  deliveries,
  onOpenNewDispatch,
  onViewDeliveryDetails,
  onQuickUpdateStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  // Counters
  const inTransitCount = deliveries.filter(d => d.status === 'In Transit').length;
  const dispatchedCount = deliveries.filter(d => d.status === 'Dispatched').length;
  const arrivedCount = deliveries.filter(d => d.status === 'Arrived at Facility').length;
  const deliveredCount = deliveries.filter(d => d.status === 'Delivered & Acknowledged').length;

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((item) => {
      const matchesSearch = 
        item.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.assignedMessenger.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.originOffice.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.destinationOffice.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || item.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [deliveries, searchQuery, statusFilter, priorityFilter]);

  const getPriorityBadge = (priority: DeliveryPriority) => {
    switch (priority) {
      case 'Confidential':
        return (
          <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-purple-700" />
            Confidential Case
          </span>
        );
      case 'Rush - COA / Legal':
        return (
          <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-rose-100 text-rose-900 border border-rose-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-700" />
            COA / Legal Rush
          </span>
        );
      case 'Urgent':
        return (
          <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-amber-100 text-amber-900 border border-amber-200">
            Urgent Transmittal
          </span>
        );
      case 'Routine':
      default:
        return (
          <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-slate-100 text-slate-700 border border-slate-200">
            Routine Dispatch
          </span>
        );
    }
  };

  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case 'In Transit':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1.5 animate-pulse">
            <Truck className="w-3.5 h-3.5 text-blue-700" />
            In Transit (En Route)
          </span>
        );
      case 'Arrived at Facility':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-700" />
            Arrived at Facility
          </span>
        );
      case 'Delivered & Acknowledged':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            Delivered &amp; Signed
          </span>
        );
      case 'Dispatched':
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            Dispatched (Outbound)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner - Clean Light Card */}
      <div className="bg-white text-slate-900 rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Module C: Messenger &amp; Document Logistics Tracker
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 rounded">
              Physical Document Security
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Track real-time transit status, courier handover checkpoints, and electronic receiving sign-offs for physical records transmitted across DSWD regional facilities.
          </p>
        </div>

        <button
          onClick={onOpenNewDispatch}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Dispatch Order</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Outbound Dispatched
          </span>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">
            {dispatchedCount}
          </div>
          <span className="text-[10px] text-slate-400">At regional sorting dock</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">
            Currently In Transit
          </span>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">
            {inTransitCount}
          </div>
          <span className="text-[10px] text-slate-400">Active messengers on road</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
            Arrived at Facility
          </span>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">
            {arrivedCount}
          </div>
          <span className="text-[10px] text-slate-400">Awaiting recipient sign-off</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
            Delivered &amp; Signed
          </span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">
            {deliveredCount}
          </div>
          <span className="text-[10px] text-slate-400">With digital receipt proof</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Tracking Number (e.g., DSWD-LOG-2026-0849), subject, messenger, or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1 px-1">
            <span>Showing</span>
            <strong className="text-slate-800">{filteredDeliveries.length}</strong>
            <span>of {deliveries.length} parcels</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Status:
            </span>
            {['All', 'Dispatched', 'In Transit', 'Arrived at Facility', 'Delivered & Acknowledged'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500 mr-1">Priority:</span>
            {['All', 'Routine', 'Urgent', 'Rush - COA / Legal', 'Confidential'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2 py-0.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  priorityFilter === p
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="space-y-3.5">
        {deliveries.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-xl p-12 sm:p-16 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <Truck className="w-7 h-7 text-blue-600" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Logistics Tracker is Ready for Dispatches
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                No active document dispatches logged yet. Create a new dispatch order to track physical documents, couriers, transit checkpoints, and recipient endorsements across DSWD centers.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onOpenNewDispatch}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create First Dispatch Order</span>
              </button>
            </div>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center shadow-xs">
            <Truck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-700 font-semibold text-sm">No logistics records found</p>
            <p className="text-slate-400 text-xs mt-1">No physical shipments match the selected filters or tracking ID.</p>
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('All'); setPriorityFilter('All'); }}
              className="mt-3 px-3 py-1.5 text-xs text-blue-700 hover:underline font-semibold cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredDeliveries.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 sm:p-5 shadow-xs transition-all space-y-3"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-slate-500" />
                    {item.trackingNumber}
                  </span>
                  {getPriorityBadge(item.priority)}
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Dispatched {new Date(item.dispatchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div>
                  {getStatusBadge(item.status)}
                </div>
              </div>

              {/* Subject & Route */}
              <div className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {item.subject}
                </h3>

                {/* Origin -> Destination Banner */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Origin:</span>
                      <span className="font-semibold text-slate-800">{item.originOffice}</span>
                      <div className="text-[11px] text-slate-500">Sender: {item.senderName}</div>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center justify-center px-4 text-slate-400">
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </div>

                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0"></div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Destination:</span>
                      <span className="font-semibold text-slate-800">{item.destinationOffice}</span>
                      <div className="text-[11px] text-slate-500">Attn: {item.recipientDesignation}</div>
                    </div>
                  </div>
                </div>

                {/* Assigned Messenger & Checkpoint Note */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="flex items-center gap-2 text-slate-600">
                    <UserCheck className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>
                      Assigned Messenger: <strong className="text-slate-800">{item.assignedMessenger}</strong> ({item.vehicleType})
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {item.messengerContact}
                    </span>
                  </div>

                  {item.checkpoints.length > 0 && (
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span className="truncate">
                        Latest: <strong>{item.checkpoints[item.checkpoints.length - 1].location}</strong> ({item.checkpoints[item.checkpoints.length - 1].statusNote})
                      </span>
                    </div>
                  )}
                </div>

                {/* Delivered sign-off info if completed */}
                {item.status === 'Delivered & Acknowledged' && (
                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-lg p-2.5 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>
                        Received by: <strong>{item.receivedByName}</strong> at {item.actualDeliveredAt ? new Date(item.actualDeliveredAt).toLocaleTimeString() : 'Delivered'}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-300">
                      Receipt No: {item.acknowledgmentReceiptNo}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onQuickUpdateStatus(item)}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-blue-700" />
                  <span>Update Transit Status</span>
                </button>
                <button
                  onClick={() => onViewDeliveryDetails(item)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Timeline &amp; Receipt</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
