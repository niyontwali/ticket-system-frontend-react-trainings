import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTicketQuery, useCreateCommentMutation, useUpdateTicketMutation, useGetTicketsQuery } from '../redux/api/apiSlice';
import { Loader2, MessageSquare, Send, ArrowLeft, Save, User, Mail, Calendar, Clock, AlertCircle, Copy, Star } from 'lucide-react';
import Select from '../components/Select';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import { Tooltip } from 'react-tooltip';
import useAuth from '../hooks/useAuth';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { isAdmin, isStaff } = useAuth();


  // RTK Query hooks
  const {
    data: ticket,
    isLoading: isTicketLoading,
    isError: isTicketError,
    refetch: refetchTicket
  } = useGetTicketQuery(id);

  const { refetch: refetchTickets } = useGetTicketsQuery();
  const [addComment, { isLoading: isAddingComment }] = useCreateCommentMutation();
  const [updateTicket, { isLoading: isUpdatingTicket }] = useUpdateTicketMutation();

  // Set initial status and priority when ticket data loads
  useEffect(() => {
    if (ticket?.data) {
      setStatus(ticket.data.status);
      setPriority(ticket.data.priority);
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
      const res = await updateTicket({ id, data }).unwrap();

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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin mr-2" />
        <span>Loading details...</span>
      </div>
    );
  }

  if (isTicketError || !ticket) {
    return (
      <div className="text-center py-6">
        <p className="text-danger mb-4">Failed to load ticket details.</p>
        <Button
          type='button'
          content="Back to Tickets"
          variant='link'
          size='lg'
          icon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate('/tickets')}
        />
      </div>
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
    <div className="container mx-auto py-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Column - Ticket Details */}
        <div className="flex-1 bg-card rounded-lg shadow-sm p-4 lg:p-5">
          {/* Header with back button and title */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
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
              className="text-xl md:text-2xl font-bold text-foreground truncate max-w-[180px] sm:max-w-xl"
            >
              {ticket?.data?.title}
            </h1>
            <Tooltip id="ticket-title-tooltip" place="bottom" delayShow={0} />
            <span className="text-sm font-normal text-muted-foreground">
              #{ticket?.data?.id}
            </span>
            <div className="flex gap-2 ml-auto mt-2 sm:mt-0">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(ticket?.data?.status)}`}>
                {statusOptions.find(s => s.value === ticket?.data?.status)?.label || ticket?.data?.status}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeClass(ticket?.data?.priority)}`}>
                {priorityOptions.find(p => p.value === ticket?.data?.priority)?.label || ticket?.data?.priority}
              </span>
            </div>
          </div>

          {/* Improved Ticket Metadata */}
          <div className="bg-muted/5 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">Ticket Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              {/* Created By */}
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created by</h3>
                  <p className="font-medium">{ticket?.data?.user?.name || 'Unknown'}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-muted-foreground">{ticket?.data?.user?.email || 'No email'}</p>
                    {ticket?.data?.user?.email && (
                      <button
                        onClick={() => copyToClipboard(ticket?.data?.user.email, 'Email copied!')}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Assigned To */}
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Assigned to</h3>
                  <p className="font-medium">{ticket?.data?.assigned_user?.name || 'Unassigned'}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-muted-foreground">{ticket?.data?.assigned_user?.email || 'No email'}</p>
                    {ticket?.data?.assigned_user?.email && (
                      <button
                        onClick={() => copyToClipboard(ticket?.data?.assigned_user.email, 'Email copied!')}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Created At */}
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created at</h3>
                  <p className="font-medium">{new Date(ticket?.data?.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Last Updated */}
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last updated</h3>
                  <p className="font-medium">{new Date(ticket?.data?.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-primary" />
              Description
            </h2>
            <div className="bg-muted/10 p-4 rounded-lg relative group">
              <p className="whitespace-pre-line pr-6">{ticket?.data?.description}</p>
              <button
                onClick={() => copyToClipboard(ticket?.data?.description, 'Description copied!')}
                className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors opacity-70 hover:opacity-100"
                aria-label="Copy description"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              Comments ({ticket?.data?.comments?.length || 0})
            </h2>

            {/* Comment List */}
            <div className="space-y-3 mb-4">
              {ticket?.data?.comments?.length > 0 ? (
                ticket?.data?.comments.map((comment) => (
                  <div key={comment.id} className="bg-muted/10 p-3 rounded-lg relative">
                    <div className="flex flex-wrap justify-between items-start mb-2 pb-1 border-b border-muted/20">
                      <div className="font-medium flex items-center gap-1">
                        <User className="h-4 w-4 text-primary" />
                        {comment.user?.name || 'Unknown'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleString()}
                      </div>
                    </div>
                    <p className="whitespace-pre-line text-sm pl-5 pr-6">{comment.message}</p>
                    <button
                      onClick={() => copyToClipboard(comment.message, 'Comment copied!')}
                      className="absolute bottom-3 right-3 text-muted-foreground hover:text-primary transition-colors opacity-70 hover:opacity-100"
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
            <div className="bg-muted/5 p-4 rounded-lg">
              <label htmlFor="comment" className=" text-sm font-medium mb-2 flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-primary" />
                Add a comment
              </label>
              <textarea
                id="comment"
                rows={3}
                className="w-full border border-input rounded-lg p-3 text-sm mb-3 font-poppins ring-offset-background focus-visible:outline-none focus-visible:ring focus-visible:ring-primary/20 focus-visible:ring-offset-1"
                placeholder="Type your comment here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isAddingComment}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAddComment}
                  disabled={!comment.trim() || isAddingComment}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover disabled:bg-muted disabled:text-muted-foreground transition-colors flex items-center gap-2 font-medium text-sm"
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
        <div className="w-full lg:w-72 bg-card rounded-lg shadow-sm p-4 h-fit sticky top-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">Ticket Edit</h2>
            {isEditing ? (
              <button
                onClick={handleSaveChanges}
                disabled={isUpdatingTicket}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary-hover disabled:bg-muted disabled:text-muted-foreground transition-colors font-medium"
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

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Clock className="h-4 w-4 text-primary" />
                Status
              </label>
              {isEditing && isAdmin ? (
                <Select
                  options={statusOptions}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={isUpdatingTicket}
                  icon={Clock}
                />
              ) : (
                <div className={`px-3 py-2 rounded-lg ${getStatusBadgeClass(ticket?.data?.status)} font-medium text-center`}>
                  {statusOptions.find(s => s.value === ticket?.data?.status)?.label || ticket?.data?.status}
                </div>
              )}
            </div>

            <div>
              <label className=" text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Star className="h-4 w-4 text-primary" />
                Priority
              </label>
              {isEditing && isStaff ? (
                <Select
                  options={priorityOptions}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  disabled={isUpdatingTicket}
                  icon={Star}
                />
              ) : (
                <div className={`px-3 py-2 rounded-lg ${getPriorityBadgeClass(ticket?.data?.priority)} font-medium text-center`}>
                  {priorityOptions.find(p => p.value === ticket?.data?.priority)?.label || ticket?.data?.priority}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;