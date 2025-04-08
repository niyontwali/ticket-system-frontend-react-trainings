import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { useGetTicketsQuery } from "../redux/api/apiSlice";
import DataTable from "../components/Table";
import Button from "../components/Button";
import Select from "../components/Select";
import Badge from "../components/Badge";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import useAuth from "../hooks/useAuth";

const Tickets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const { isStaff } = useAuth();

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priority" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const { data: tickets = [], isLoading, isError } = useGetTicketsQuery();

  const filteredTickets = tickets?.data?.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const ticketColumns = [
    {
      key: 'id',
      header: 'ID',
      render: (ticket) => `#${ticket.id}`
    },
    {
      key: 'title',
      header: 'Title',
      render: (ticket) => (
        <>
          <span
            data-tooltip-id="ticket-title-tooltip"
            data-tooltip-content={ticket.title}
            className="truncate max-w-[100px] inline-block"
          >
            {ticket.title}
          </span>
          <Tooltip id="ticket-title-tooltip" place="top" delayShow={0} />
        </>
      )
    },
    {
      key: 'user',
      header: 'Reported By',
      cellClassName: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
      render: (ticket) => ticket.user.name
    },
    {
      key: 'assigned_user',
      header: 'Assigned To',
      cellClassName: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
      render: (ticket) => ticket.assigned_user.name
    },
    {
      key: 'status',
      header: 'Status',
      render: (ticket) => <Badge type="status" value={ticket.status} />
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (ticket) => <Badge type="priority" value={ticket.priority} />
    },
    {
      key: 'created_at',
      header: 'Created',
      cellClassName: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
      render: (ticket) => formatDate(ticket.created_at)
    },
    {
      key: 'comments',
      header: 'Comments',
      cellClassName: "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
      render: (ticket) => ticket.comments.length
    },
    {
      key: 'actions',
      header: 'Actions',
      style: { textAlign: 'right' },
      cellClassName: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium",
      render: (ticket) => (
        <div className="flex justify-center space-x-2">
          <Link
            to={`/tickets/${ticket.id}`}
            className="text-primary hover:text-primary-hover cursor-pointer"
          >
            View
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        {isStaff && <Button
          type="button"
          content="New Ticket"
          onClick={() => console.log("Create new ticket")}
        />}

      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tickets..."
              className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring focus-visible:ring-offset-1 focus-visible:ring-primary/20 placeholder:text-muted-foreground disabled:opacity-50 placeholder:pl-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              icon={Filter}
              className="min-w-[180px]"
            />

            <Select
              options={priorityOptions}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              icon={Filter}
              className="min-w-[180px]"
            />
          </div>
        </div>

        <DataTable
          data={filteredTickets}
          columns={ticketColumns}
          isLoading={isLoading}
          isError={isError}
          errorMessage="Error loading tickets!"
          emptyMessage="No tickets found."
        />
      </div>
    </div>
  );
};


export default Tickets;