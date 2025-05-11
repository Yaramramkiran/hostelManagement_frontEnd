import React, {
  createContext, useContext, useReducer, useEffect
} from "react";
import axios from "axios";
import { addToOfflineQueue } from "../utils/offlineQueue";
import { getOfflineQueue, clearOfflineQueue } from "../utils/offlineQueue";


const initialState = {
  hostels: [],
  hostel: null,
  loading: false,
  error: null,
  userCount: 0,
};

const HostelContext = createContext(initialState);

const hostelReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: true,
      };
    case "GET_HOSTELS":
      return {
        ...state,
        hostels: action.payload.data,
        userCount: action.payload.userCount,
        loading: false,
        error: null,
      };
    case "GET_HOSTEL":
      return {
        ...state,
        hostel: action.payload,
        loading: false,
        error: null,
      };
    case "ADD_HOSTEL":
      return {
        ...state,
        hostels: [...state.hostels, action.payload],
        loading: false,
        error: null,
      };
    case "UPDATE_HOSTEL":
      return {
        ...state,
        hostels: state.hostels.map((hostel) =>
          hostel.id === action.payload.id ? action.payload : hostel
        ),
        hostel: action.payload,
        loading: false,
        error: null,
      };
    case "DELETE_HOSTEL":
      return {
        ...state,
        hostels: state.hostels.filter((hostel) => hostel.id !== action.payload),
        loading: false,
        error: null,
      };
    case "HOSTEL_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const HostelProvider = ({ children }) => {
  const [state, dispatch] = useReducer(hostelReducer, initialState);
  console.log("Hostel State:", state);


  useEffect(() => {
    const syncOfflineActions = async () => {
      const queue = getOfflineQueue();
      for (const action of queue) {
        try {
          if (action.type === "ADD_HOSTEL") {
            await axios.post("/hostels", action.payload);
          } else if (action.type === "UPDATE_HOSTEL") {
            await axios.put(`/hostels/${action.payload.id}`, action.payload);
          } else if (action.type === "DELETE_HOSTEL") {
            await axios.delete(`/hostels/${action.payload}`);
          }
        } catch (err) {
          console.error("Failed to sync:", action, err);
        }
      }
      clearOfflineQueue();
      getHostels();
    };

    const handleOnline = () => {
      console.log("Back online! Syncing offline data...");
      syncOfflineActions();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);


  // Get all hostels
  const getHostels = async () => {
    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.get("/hostels");
      dispatch({
        type: "GET_HOSTELS",
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: "HOSTEL_ERROR",
        payload: error.response?.data?.message || "Error fetching hostels",
      });
    }
  };

  // Get single hostel
  const getHostel = async (id) => {
    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.get(`/hostels/${id}`);
      dispatch({
        type: "GET_HOSTEL",
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: "HOSTEL_ERROR",
        payload: error.response?.data?.message || "Error fetching hostel",
      });
    }
  };

  // Add hostel
  const addHostel = async (hostelData) => {
    if (!navigator.onLine) {
      addToOfflineQueue({ type: "ADD_HOSTEL", payload: hostelData });
      dispatch({ type: "ADD_HOSTEL", payload: hostelData });
      return hostelData;
    }

    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.post("/hostels", hostelData);
      dispatch({
        type: "ADD_HOSTEL",
        payload: res.data.data,
      });
      return res.data.data;
    } catch (error) {
      dispatch({
        type: "HOSTEL_ERROR",
        payload: error.response?.data?.message || "Error adding hostel",
      });
      return null;
    }
  };


  // Update hostel
  const updateHostel = async (id, hostelData) => {
    if (!navigator.onLine) {
      addToOfflineQueue({ type: "UPDATE_HOSTEL", payload: { id, ...hostelData } });

      dispatch({
        type: "UPDATE_HOSTEL",
        payload: { id, ...hostelData },
      });

      return { id, ...hostelData };
    }

    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.put(`/hostels/${id}`, hostelData);
      dispatch({
        type: "UPDATE_HOSTEL",
        payload: res.data.data,
      });
      return res.data.data;
    } catch (error) {
      dispatch({
        type: "HOSTEL_ERROR",
        payload: error.response?.data?.message || "Error updating hostel",
      });
      return null;
    }
  };



  // Delete hostel
  const deleteHostel = async (id) => {
    if (!navigator.onLine) {
      addToOfflineQueue({ type: "DELETE_HOSTEL", payload: id });
      dispatch({ type: "DELETE_HOSTEL", payload: id });
      return true;
    }

    try {
      dispatch({ type: "SET_LOADING" });
      await axios.delete(`/hostels/${id}`);
      dispatch({
        type: "DELETE_HOSTEL",
        payload: id,
      });
      return true;
    } catch (error) {
      dispatch({
        type: "HOSTEL_ERROR",
        payload: error.response?.data?.message || "Error deleting hostel",
      });
      return false;
    }
  };


  // Clear error
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <HostelContext.Provider
      value={{
        hostels: state.hostels,
        hostel: state.hostel,
        loading: state.loading,
        error: state.error,
        userCount: state.userCount,
        getHostels,
        getHostel,
        addHostel,
        updateHostel,
        deleteHostel,
        clearError,
      }}
    >
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => useContext(HostelContext);
