import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Text,
  Badge,
  Heading,
  Spinner,
  EmptyState,
  Button,
} from "@innovaccer/design-system";
import "./CaseList.css";
import { AccentAppearance } from "@innovaccer/design-system/dist/core/common.type";

interface Case {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

type BadgeAppearance = "info" | "warning" | "success" | "alert" | "subtle";

interface CellRendererProps {
  data: Case;
}

const CaseList: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async (page?: number, limit?: number): Promise<void> => {
    const params = {
      page: currentPage || 1,
      limit: limit || 2,
    };
    try {
      setLoading(true);
      setError(null);
      console.log(document.cookie, "document.cookie");
      const response = await axios.get("http://localhost:4000/api/cases", {
        withCredentials: true, // This tells axios to send cookies
        params: params,
      });
      if (response.data.success) {
        setCases([...cases, ...response.data.data]);
        setCurrentPage(currentPage + 1);
        setTotalCount(response.data.totalCount);
      }
    } catch (err) {
      console.error("Error fetching cases:", err);
      setError("Failed to fetch cases. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (caseId: string): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this case?")) {
      try {
        await axios.delete(`http://localhost:4000/api/cases/${caseId}`, {
          withCredentials: true,
        });
        // Refresh the list
        fetchCases();
      } catch (err) {
        console.error("Error deleting case:", err);
        alert("Failed to delete case");
      }
    }
  };

  const getStatusAppearance = (
    status: string
  ): AccentAppearance | undefined => {
    switch (status) {
      case "Open":
        return "primary";
      case "In Progress":
        return "secondary";
      case "Closed":
        return "success";
      default:
        return undefined;
    }
  };

  const getPriorityAppearance = (
    priority: string
  ): AccentAppearance | undefined => {
    switch (priority) {
      case "High":
        return "primary";
      case "Medium":
        return "secondary";
      case "Low":
        return "success";
      default:
        return undefined;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const schema = [
    {
      name: "title",
      displayName: "Title",
      width: "25%",
      cellRenderer: (props: CellRendererProps) => {
        const { data } = props;
        return (
          <div className="d-flex flex-column">
            <Text weight="medium">{data.title}</Text>
            <Text size="small" appearance="subtle">
              {data.description}
            </Text>
          </div>
        );
      },
    },
    {
      name: "status",
      displayName: "Status",
      width: "12%",
      cellRenderer: (props: CellRendererProps) => {
        const { data } = props;
        return (
          <Badge appearance={getStatusAppearance(data.status)}>
            {data.status}
          </Badge>
        );
      },
    },
    {
      name: "priority",
      displayName: "Priority",
      width: "12%",
      cellRenderer: (props: CellRendererProps) => {
        const { data } = props;
        return (
          <Badge appearance={getPriorityAppearance(data.priority)}>
            {data.priority}
          </Badge>
        );
      },
    },
    {
      name: "createdAt",
      displayName: "Created At",
      width: "18%",
      cellRenderer: (props: CellRendererProps) => {
        const { data } = props;
        return <Text size="small">{formatDate(data.createdAt)}</Text>;
      },
    },
    {
      name: "actions",
      displayName: "Actions",
      width: "10%",
      cellRenderer: (props: CellRendererProps) => {
        const { data } = props;
        return (
          <Button
            appearance="alert"
            size="tiny"
            onClick={() => handleDelete(data._id)}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="case-list-container">
        <Heading size="m">Cases</Heading>
        <div className="spinner-container">
          <Spinner size="large" appearance="primary" />
          <Text>Loading cases...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="case-list-container">
        <Heading size="m">Cases</Heading>
        <div className="error-container">
          <EmptyState title="Error" description={error} size="small">
            <Button appearance="primary" onClick={() => fetchCases()}>
              Retry
            </Button>
          </EmptyState>
        </div>
      </div>
    );
  }

  return (
    <div className="case-list-container">
      <div className="case-list-header">
        <Heading size="m">{`Cases (${cases.length.toString()})`}</Heading>
        <Button appearance="basic" icon="refresh" onClick={() => fetchCases()}>
          Refresh
        </Button>
        <Button
          appearance="basic"
          icon="refresh"
          disabled={cases.length >= totalCount}
          onClick={() => fetchCases(currentPage + 1)}
        >
          Load More
        </Button>
      </div>

      {cases.length === 0 ? (
        <EmptyState
          title="No Cases Found"
          description="Create your first case using the form on the left."
          size="small"
        />
      ) : (
        <Table
          data={cases}
          schema={schema as any}
          withHeader={true}
          headerOptions={{
            withSearch: true,
          }}
          withPagination={true}
          pageSize={10}
        />
      )}
    </div>
  );
};

export default CaseList;
