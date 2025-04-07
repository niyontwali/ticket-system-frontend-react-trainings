import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTicketQuery, useCreateCommentMutation, useUpdateTicketMutation, useGetTicketsQuery } from '../redux/api/apiSlice';
import { Loader2, MessageSquare, Send, ChevronDown, ArrowLeft, Save, User, Mail, Calendar, Clock, AlertCircle, Copy, Star } from 'lucide-react';
import AdminLayout from "../layouts/AdminLayout";
import Select from '../components/Select';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import { Tooltip } from 'react-tooltip';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [isEditing, setIsEditing] = useState(false);


  // RTK Query hooks
  const {
    data: ticket,
    isLoading: isTicketLoading,
    isError: isTicketError,
    refetch: refetchTicket
  } = useGetTicketQuery(id);
  const {
    refetch: refetchTickets
  } = useGetTicketsQuery();

  const [addComment, { isLoading: isAddingComment }] = useCreateCommentMutation();
  const [updateTicket, { isLoading: isUpdatingTicket }] = useUpdateTicketMutation();

  // Set initial status and priority when ticket data loads
  useEffect(() => {
    if (ticket?.data) {
      setStatus(ticket?.data?.status);
      setPriority(ticket?.data?.priority);
    }
  }, [ticket]);

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    toast.success(message || 'Copied to clipboard!');
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      const res = await addComment({
        ticket_id: id,
        message: comment
      }).unwrap();

      if (!res.ok) {
        toast.error(res.message);
      } else {
        setComment('');
        refetchTicket();
        toast.success(res.message);
      }
    } catch (error) {
      toast.error(error.data.message || 'Failed to add comment');
    }
  };

  const handleSaveChanges = async () => {
    try {
      const data = { status, priority };

      const res = await updateTicket({
        id, data
      }).unwrap();

      if (!res.ok) {
        toast.error(res.message);
      } else {
        await refetchTicket();
        await refetchTickets();
        setIsEditing(false);
        toast.success(res.message);
      }
    } catch (error) {
      toast.error(error.data.message || 'Failed to update ticket');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isTicketLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center space-x-2 items-center pt-[30vh]">
          <Loader2 className="animate-spin" />
          <span>Loading details...</span>
        </div>
      </AdminLayout>
    );
  }

  if (isTicketError || !ticket) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <p className="text-danger">Failed to load ticket details.</p>

          <Button
            type='button'
            content="Back to Tickets"
            variant='link'
            size='lg'
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate('/tickets')}
          />
        </div>
      </AdminLayout>
    );
  }

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  return (
    <AdminLayout>
      <div className="flex-1">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* Left Column - Ticket Details */}
          <div className="flex-1 bg-card rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row items-center mb-6">

              <div className=" flex items-center">
                <Button
                  type='button'
                  variant='secondary'
                  size='sm'
                  icon={<ArrowLeft />}
                  iconPosition='left'
                  onClick={() => navigate('/tickets')}

                />
                <h1
                  data-tooltip-id="ticket-title-tooltip"
                  data-tooltip-content={ticket?.data?.title}
                  className="text-2xl font-bold text-foreground pl-4 truncate max-w-xs"
                >
                  {ticket?.data?.title}
                </h1>
                <Tooltip id="ticket-title-tooltip" place="bottom" delayShow={0} />
                <span className="ml-2 text-[0.9rem] font-normal text-muted-foreground">
                  #{ticket?.data?.id}
                </span>
              </div>
              <div className="flex gap-2 ml-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(ticket?.data?.status)}`}>
                  {statusOptions.find(s => s.value === ticket?.data?.status)?.label || ticket?.data?.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadgeClass(ticket?.data?.priority)}`}>
                  {priorityOptions.find(p => p.value === ticket?.data?.priority)?.label || ticket?.data?.priority}
                </span>
              </div>
            </div>

            {/* Ticket Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-[0.9rem] font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Created by
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{ticket?.data?.user?.name || 'Unknown'}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <p className="text-[0.9rem] text-muted-foreground">{ticket?.data?.user?.email || 'No email'}</p>
                    {ticket?.data?.user?.email && (
                      <button
                        onClick={() => copyToClipboard(ticket?.data?.user.email, 'Email copied!')}
                        className="text-muted-foreground hover:text-primary transition-colors ml-1"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-[0.9rem] font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Assigned to
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{ticket?.data?.assigned_user?.name || 'Unassigned'}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <p className="text-[0.9rem] text-muted-foreground">{ticket?.data?.assigned_user?.email || 'No email'}</p>
                    {ticket?.data?.assigned_user?.email && (
                      <button
                        onClick={() => copyToClipboard(ticket?.data?.assigned_user.email, 'Email copied!')}
                        className="text-muted-foreground hover:text-primary transition-colors ml-1"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-[0.9rem] font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Created at
                  </h3>
                  <p className="font-medium">{new Date(ticket?.data?.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-[0.9rem] font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Last updated
                  </h3>
                  <p className="font-medium">{new Date(ticket?.data?.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Description
                </h2>
              </div>
              <div className="bg-muted/10 p-4 rounded-lg">
                <p className="whitespace-pre-line inline">{ticket?.data?.description}</p>
                <button
                  onClick={() => copyToClipboard(ticket?.data?.description, 'Description copied!')}
                  className=" text-muted-foreground hover:text-primary transition-colors p-1"
                  aria-label="Copy description"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments ({ticket?.data?.comments?.length || 0})
                </h2>
              </div>

              {/* Comment List */}
              <div className="space-y-4 mb-6">
                {ticket?.data?.comments?.length > 0 ? (
                  ticket?.data?.comments.map((comment) => (
                    <div key={comment.id} className="bg-muted/10 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {comment.user?.name || 'Unknown'}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-[0.9rem] text-muted-foreground">
                            {new Date(comment.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <p className="whitespace-pre-line text-[0.9rem] pl-6 pr-2 inline">{comment.message}</p>
                      <button
                        onClick={() => copyToClipboard(comment.message, 'Comment copied!')}
                        className=" text-muted-foreground hover:text-primary transition-colors p-1"
                        aria-label="Copy comment"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="bg-muted/10 p-4 rounded-lg text-center text-muted-foreground">
                    No comments yet
                  </div>
                )}
              </div>

              {/* Add Comment Form */}
              <div>
                <label htmlFor="comment" className="block text-[0.9rem] font-medium text-muted-foreground mb-2">
                  Add a comment
                </label>
                <textarea
                  id="comment"
                  rows={3}
                  className="w-full border border-input rounded-lg p-3 1 text-[0.9rem] mb-2 font-poppins ring-offset-background focus-visible:outline-none focus-visible:ring focus-visible:ring-primary/20 
           focus-visible:ring-offset-1"
                  placeholder="Type your comment here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={isAddingComment}
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleAddComment}
                    disabled={!comment.trim() || isAddingComment}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover disabled:bg-muted disabled:text-muted-foreground transition-colors flex items-center gap-2 font-medium"
                  >
                    {isAddingComment ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Post Comment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Ticket Actions */}
          <div className="w-full lg:w-80 bg-card rounded-lg shadow-sm p-6 h-fit sticky top-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Ticket Settings</h2>
              {isEditing ? (
                <button
                  onClick={handleSaveChanges}
                  disabled={isUpdatingTicket}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground text-[0.9rem] rounded-md hover:bg-primary-hover disabled:bg-muted disabled:text-muted-foreground transition-colors font-medium"
                >
                  {isUpdatingTicket ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isUpdatingTicket ? 'Saving...' : 'Save'}
                </button>
              ) : (
                <Button
                  type='button'
                  content="Edit"
                  variant='link'
                  size='default'
                  onClick={() => setIsEditing(true)}
                />
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[0.9rem] font-medium text-muted-foreground mb-2">
                  Status
                </label>
                {isEditing ? (
                  <Select
                    options={statusOptions}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={isUpdatingTicket}
                    icon={Clock}
                  />
                ) : (
                  <div className={`px-4 py-2 rounded-lg ${getStatusBadgeClass(ticket?.data?.status)} font-medium`}>
                    {statusOptions.find(s => s.value === ticket?.data?.status)?.label || ticket?.data?.status}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[0.9rem] font-medium text-muted-foreground mb-2">
                  Priority
                </label>
                {isEditing ? (
                  <Select
                    options={priorityOptions}
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    disabled={isUpdatingTicket}
                    icon={Star}
                  />
                ) : (
                  <div className={`px-4 py-2 rounded-lg ${getPriorityBadgeClass(ticket?.data?.priority)} font-medium`}>
                    {priorityOptions.find(p => p.value === ticket?.data?.priority)?.label || ticket?.data?.priority}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TicketDetails;