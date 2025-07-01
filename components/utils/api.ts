import axios from 'axios';

const BASE_URL = 'http://crmclient.trinitysoftwares.in/crmAppApi/login.php';

export const getUserDetails = async (userId: string | number) => {
  try {
    const response = await axios.post(BASE_URL, {
      type: 'getUserDetails',
      id: userId,
    });

    if (response.data.success) {
      return {
        success: true,
        user: response.data.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'User not found',
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Something went wrong',
    };
  }
};
 

export const getStateDetails = async () => {
  try {
    const response = await fetch("http://crmclient.trinitysoftwares.in/crmAppApi/leads.php?type=getStateDetails", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    return result;  
  } catch (error) {
    console.error("Failed to fetch state details:", error);
    return { status: "error", message: "Network error" };
  }
};


export const getLeadSources = async () => {
  try {
    const response = await fetch("http://crmclient.trinitysoftwares.in/crmAppApi/leads.php?type=getLeadSources", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    return result;  
  } catch (error) {
    console.error("Failed to fetch state details:", error);
    return { status: "error", message: "Network error" };
  }
};

export const getLeadAgents = async () => {
  try {
    const response = await fetch("http://crmclient.trinitysoftwares.in/crmAppApi/leads.php?type=getLeadAgents", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    return result;  
  } catch (error) {
    console.error("Failed to fetch state details:", error);
    return { status: "error", message: "Network error" };
  }
};


export const getAllUserDetails = async () => {
  try {
    const response = await fetch("http://crmclient.trinitysoftwares.in/crmAppApi/login.php?type=getAllUsers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    return result;  
  } catch (error) {
    console.error("Failed to fetch state details:", error);
    return { status: "error", message: "Network error" };
  }
};


export const getProdServiceDetails = async () => {
  try {
    const response = await fetch("http://crmclient.trinitysoftwares.in/crmAppApi/opportunity1.php?type=getAllProdService", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    return result;  
  } catch (error) {
    console.error("Failed to fetch state details:", error);
    return { status: "error", message: "Network error" };
  }
};


export const getAllEmployeeDetails = async () => {
  try {
    const response = await fetch("http://crmclient.trinitysoftwares.in/crmAppApi/opportunity1.php?type=getAllEmployee", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    return result;  
  } catch (error) {
    console.error("Failed to fetch state details:", error);
    return { status: "error", message: "Network error" };
  }
}

// services/api.ts
export const createOpportunity = async (data: any, loginid: string) => {
  try {
    const response = await fetch(
      `http://crmclient.trinitysoftwares.in/crmAppApi/opportunity1.php?type=createOpportunity&loginid=${loginid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const text = await response.text(); // get raw text

    console.log("response status", response.status);
    console.log("response text", text); // helpful debug

    if (!response.ok) {
      return {
        status: "error",
        message: `Server error ${response.status}`,
      };
    }

    // Only parse JSON if there's something to parse
    return text ? JSON.parse(text) : { status: "error", message: "Empty response" };
  } catch (error) {
    console.error("Error creating opportunity:", error);
    return { status: "error", message: "Network error" };
  }
};

