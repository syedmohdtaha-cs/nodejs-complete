import React, { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import {
  Input,
  Textarea,
  Dropdown,
  Button,
  Heading,
  Text,
  Toast,
} from "@innovaccer/design-system";
import "./CaseForm.css";

interface CaseFormProps {
  onCaseCreated?: () => void;
}

interface FormData {
  title: string;
  description: string;
  status: string;
  priority: string;
}

interface DropdownOption {
  label: string;
  value: string;
}

type ToastAppearance = "success" | "alert" | "info" | "warning";

const CaseForm: React.FC<CaseFormProps> = ({ onCaseCreated }) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    status: "Open",
    priority: "Medium",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastAppearance, setToastAppearance] =
    useState<ToastAppearance>("success");

  const statusOptions: DropdownOption[] = [
    { label: "Open", value: "Open" },
    { label: "In Progress", value: "In Progress" },
    { label: "Closed", value: "Closed" },
  ];

  const priorityOptions: DropdownOption[] = [
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
  ];

  const handleInputChange = (name: keyof FormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      showToastMessage("Please enter a title", "alert");
      return;
    }

    if (!formData.description.trim()) {
      showToastMessage("Please enter a description", "alert");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:4000/api/cases",
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        showToastMessage("Case created successfully!", "success");
        // Reset form
        setFormData({
          title: "",
          description: "",
          status: "Open",
          priority: "Medium",
        });
        // Notify parent component
        if (onCaseCreated) {
          onCaseCreated();
        }
      }
    } catch (err) {
      console.error("Error creating case:", err);
      showToastMessage("Failed to create case. Please try again.", "alert");
    } finally {
      setLoading(false);
    }
  };

  const showToastMessage = (
    message: string,
    appearance: ToastAppearance
  ): void => {
    setToastMessage(message);
    setToastAppearance(appearance);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="case-form-container">
      <Heading size="m">Create New Case</Heading>
      <Text appearance="subtle" size="small" className="form-subtitle">
        Fill in the details to create a new case
      </Text>

      <form onSubmit={handleSubmit} className="case-form">
        <div className="form-field">
          <Input
            name="title"
            placeholder="Enter case title"
            value={formData.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange("title", e.target.value)
            }
            required
            label="Title"
            className="form-input"
          />
        </div>

        <div className="form-field">
          <Textarea
            name="description"
            placeholder="Enter case description"
            value={formData.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              handleInputChange("description", e.target.value)
            }
            required
            rows={4}
            label="Description"
            className="form-input"
          />
        </div>

        <div className="form-field">
          <Text weight="medium" size="small" className="field-label">
            Status
          </Text>
          <Dropdown
            options={statusOptions}
            onChange={(selected: string) =>
              handleInputChange("status", selected)
            }
            placeholder="Select status"
            className="form-dropdown"
          />
        </div>

        <div className="form-field">
          <Text weight="medium" size="small" className="field-label">
            Priority
          </Text>
          <Dropdown
            options={priorityOptions}
            onChange={(selected: string) =>
              handleInputChange("priority", selected)
            }
            placeholder="Select priority"
            className="form-dropdown"
          />
        </div>

        <div className="form-actions">
          <Button
            appearance="primary"
            expanded={true}
            loading={loading}
            type="submit"
          >
            Create Case
          </Button>
        </div>
      </form>

      {showToast && (
        <div className="toast-container">
          <Toast
            appearance={toastAppearance}
            title={toastMessage}
            onClose={() => setShowToast(false)}
          />
        </div>
      )}
    </div>
  );
};

export default CaseForm;
