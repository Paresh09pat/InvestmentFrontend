// Dummy data for development and testing
export const dummyUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "investor",
    status: "active",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "investor",
    status: "pending",
    createdAt: "2024-01-20"
  }
];

export const dummyInvestments = [
  {
    id: 1,
    userId: 1,
    amount: 10000,
    type: "stocks",
    status: "active",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    userId: 2,
    amount: 5000,
    type: "bonds",
    status: "pending",
    createdAt: "2024-01-20"
  }
];

export const dummyNotifications = [
  {
    id: 1,
    userId: 1,
    title: "Investment Update",
    message: "Your investment has been processed successfully",
    type: "success",
    read: false,
    createdAt: "2024-01-25"
  }
];