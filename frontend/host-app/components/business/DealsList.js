"use client";
import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { format } from "date-fns";

const GET_DEALS_BY_BUSINESS = gql`
  query GetDealsByBusinessId($businessId: ID!) {
    getDealsByBusinessId(businessId: $businessId) {
      id
      title
      description
      startDate
      endDate
      discount
      active
      createdAt
    }
  }
`;

const GET_ACTIVE_DEALS = gql`
  query GetActiveDeals {
    getActiveDeals {
      id
      title
      description
      startDate
      endDate
      discount
      active
      createdAt
      business {
        id
        name
      }
    }
  }
`;

/**
 * A component to display a list of deals for a business or all active deals
 *
 * @param {Object} props
 * @param {string} [props.businessId] - Optional business ID to filter deals
 * @param {boolean} [props.activeOnly=false] - Whether to show only active deals
 * @param {boolean} [props.showBusiness=false] - Whether to show business name (for active deals)
 * @param {number} [props.limit] - Optional limit on number of deals to display
 * @returns {JSX.Element}
 */
export default function DealsList({
  businessId,
  activeOnly = false,
  showBusiness = false,
  limit,
}) {
  const [sortBy, setSortBy] = useState("startDate");

  // Determine which query to use
  const queryToUse = businessId
    ? {
        query: GET_DEALS_BY_BUSINESS,
        variables: { businessId },
      }
    : {
        query: GET_ACTIVE_DEALS,
      };

  const { loading, error, data } = useQuery(queryToUse.query, {
    variables: queryToUse.variables || {},
  });

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded"
        role="alert"
      >
        <p>Error loading deals: {error.message}</p>
      </div>
    );
  }

  // Get the appropriate deals list
  let deals = businessId
    ? data?.getDealsByBusinessId || []
    : data?.getActiveDeals || [];

  // Filter active deals if required
  if (activeOnly) {
    const now = new Date();
    deals = deals.filter(
      (deal) =>
        deal.active &&
        new Date(deal.startDate) <= now &&
        new Date(deal.endDate) >= now
    );
  }

  // Sort deals
  deals = [...deals].sort((a, b) => {
    if (sortBy === "startDate") {
      return new Date(a.startDate) - new Date(b.startDate);
    } else if (sortBy === "endDate") {
      return new Date(a.endDate) - new Date(b.endDate);
    } else if (sortBy === "discount") {
      return (b.discount || 0) - (a.discount || 0);
    }
    return 0;
  });

  // Apply limit if specified
  if (limit && limit > 0) {
    deals = deals.slice(0, limit);
  }

  // Handle no deals case
  if (deals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No deals available at this time.</p>
      </div>
    );
  }

  // Using inline styles as fallback for Tailwind
  const styles = {
    container: {
      width: "100%",
    },
    sortControls: {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "1rem",
    },
    sortLabel: {
      marginRight: "0.5rem",
      fontSize: "0.875rem",
      color: "#6B7280",
    },
    sortSelect: {
      padding: "0.25rem 0.5rem",
      borderRadius: "0.25rem",
      border: "1px solid #D1D5DB",
      fontSize: "0.875rem",
    },
    dealsList: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "1rem",
    },
    dealCard: {
      backgroundColor: "#EBF5FF",
      borderRadius: "0.5rem",
      overflow: "hidden",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    },
    dealHeader: {
      borderBottom: "1px solid #BFDBFE",
      padding: "1rem",
    },
    dealTitle: {
      fontWeight: "bold",
      fontSize: "1.125rem",
      marginBottom: "0.5rem",
      color: "#1E40AF",
    },
    businessName: {
      fontSize: "0.875rem",
      color: "#4B5563",
    },
    dealContent: {
      padding: "1rem",
    },
    dealDescription: {
      marginBottom: "1rem",
      color: "#4B5563",
    },
    dealMeta: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      fontSize: "0.875rem",
      color: "#6B7280",
    },
    dealDiscount: {
      display: "inline-block",
      backgroundColor: "#FEF3C7",
      color: "#92400E",
      fontWeight: "bold",
      padding: "0.25rem 0.5rem",
      borderRadius: "0.25rem",
      marginTop: "0.5rem",
    },
    dealDate: {
      display: "flex",
      justifyContent: "space-between",
    },
    dealDateLabel: {
      color: "#6B7280",
    },
    dealDateValue: {
      color: "#111827",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.sortControls}>
        <label style={styles.sortLabel} htmlFor="sort-deals">
          Sort by:
        </label>
        <select
          id="sort-deals"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={styles.sortSelect}
        >
          <option value="startDate">Start Date</option>
          <option value="endDate">End Date</option>
          <option value="discount">Discount</option>
        </select>
      </div>

      <div style={styles.dealsList}>
        {deals.map((deal) => (
          <div key={deal.id} style={styles.dealCard}>
            <div style={styles.dealHeader}>
              <h3 style={styles.dealTitle}>{deal.title}</h3>
              {showBusiness && deal.business && (
                <div style={styles.businessName}>{deal.business.name}</div>
              )}
            </div>
            <div style={styles.dealContent}>
              <p style={styles.dealDescription}>{deal.description}</p>

              <div style={styles.dealMeta}>
                <div style={styles.dealDate}>
                  <span style={styles.dealDateLabel}>Starts:</span>
                  <span style={styles.dealDateValue}>
                    {formatDate(deal.startDate)}
                  </span>
                </div>
                <div style={styles.dealDate}>
                  <span style={styles.dealDateLabel}>Ends:</span>
                  <span style={styles.dealDateValue}>
                    {formatDate(deal.endDate)}
                  </span>
                </div>

                {deal.discount && (
                  <div style={styles.dealDiscount}>{deal.discount}% OFF</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
