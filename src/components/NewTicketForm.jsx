import { useState } from "react";
import { useGetUsersQuery, useCreateTicketMutation } from "../redux/api/apiSlice";
import Button from "../components/Button";
import Select from "../components/Select";
import Input from "../components/Input";
import useAuth from "../hooks/useAuth";
import { Clock, User } from "lucide-react";
import toast from "react-hot-toast";

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const NewTicketForm = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const { data: users = [] } = useGetUsersQuery();
  const [createTicket, { isLoading }] = useCreateTicketMutation();

  // Filter for admin users only
  const adminUsers = users?.data?.filter(user => user.role === "admin");

  const validateForm = () => {
    const errors = {};
    if (!title.trim()) errors.title = "Title is required";
    if (!description.trim()) errors.description = "Description is required";
    if (!assignedTo) errors.assignedTo = "Please select a staff";
    if (!priority) errors.priority = "Priority is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    if (!validateForm()) return;

    try {
      // Create ticket
      const res = await createTicket({
        title,
        description,
        user_id: user.id,
        assigned_to: parseInt(assignedTo),
        priority
      }).unwrap();

      if (!res.ok) {
        toast.error(res.message);
      } else {
        onSuccess?.();
        onClose?.();
        toast.success(res.message);
      }
    } catch (err) {
      setGeneralError(err?.data?.message || "Failed to create ticket. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {generalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {generalError}
        </div>
      )}

      <Input
        id="title"
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Brief summary of the issue"
        error={formErrors.title}
        required
      />

      <div className="grid gap-2">
        <label htmlFor="description" className="text-sm font-medium leading-none text-foreground">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={`w-full rounded-md border ${formErrors.description ? "border-danger focus-visible:ring-danger/20" : "border-input focus-visible:ring-primary/20"} 
            px-3 py-2 text-sm text-foreground
            ring-offset-background focus-visible:outline-none focus-visible:ring 
            focus-visible:ring-offset-1
            placeholder:text-muted-foreground disabled:opacity-50`}
          placeholder="Detailed description of the issue"
          required
        />
        {formErrors.description && <p className="text-xs text-danger">{formErrors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label htmlFor="priority" className="text-sm font-medium leading-none text-foreground">
            Priority
          </label>
          <Select
            id="priority"
            options={priorityOptions}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={`w-full ${formErrors.priority ? "border-danger" : ""}`}
            icon={Clock}
          />
          {formErrors.priority && <p className="text-xs text-danger">{formErrors.priority}</p>}
        </div>

        <div className="grid gap-2">
          <label htmlFor="assignedTo" className="text-sm font-medium leading-none text-foreground">
            Assign To
          </label>
          <Select
            id="assignedTo"
            options={[
              { value: "", label: "Select staff member" },
              ...(adminUsers?.map(user => ({ value: user.id.toString(), label: user.name })) || [])
            ]}
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className={`w-full ${formErrors.assignedTo ? "border-danger" : ""}`}
            icon={User}
          />
          {formErrors.assignedTo && <p className="text-xs text-danger">{formErrors.assignedTo}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          content="Cancel"
          onClick={onClose}
          variant="outline"
          disabled={isLoading}
        />
        <Button
          isLoading={isLoading}
          type="submit"
          content="Create Ticket"
          loadingText="Creating..."
          disabled={isLoading}
        />
      </div>
    </form>
  );
};

export default NewTicketForm;