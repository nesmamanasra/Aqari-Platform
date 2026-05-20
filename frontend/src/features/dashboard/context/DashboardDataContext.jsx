import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "../../../lib/supabase";

const DashboardDataContext = createContext(null);

const propertiesSelect = `
  id,
  title,
  image,
  video_url,
  property_type,
  operation_type,
  city,
  description,
  price,
  currency,
  status,
  created_at,
  owner_id,
  owners(full_name)
`;

export function DashboardDataProvider({ children }) {
  const [properties, setProperties] = useState([]);
  const [owners, setOwners] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const refreshProperties = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select(propertiesSelect)
        .order("created_at", { ascending: false });
      if (error) return console.error("Error refreshing properties:", error);
      setProperties(data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const refreshOwners = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("owners")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return console.error("Error refreshing owners:", error);
      setOwners(data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const refreshLeads = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.warn("Leads table is not ready yet:", error.message);
        setLeads([]);
        return;
      }
      setLeads(data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      if (!initialized) setLoading(true);

      const [propertiesRes, ownersRes, leadsRes] = await Promise.all([
        supabase.from("properties").select(propertiesSelect).order("created_at", { ascending: false }),
        supabase.from("owners").select("*").order("created_at", { ascending: false }),
        supabase.from("leads").select("*").order("created_at", { ascending: false }),
      ]);

      if (propertiesRes.error) {
        console.error("Error fetching properties:", propertiesRes.error);
        setProperties([]);
      } else {
        setProperties(propertiesRes.data || []);
      }

      if (ownersRes.error) {
        console.error("Error fetching owners:", ownersRes.error);
        setOwners([]);
      } else {
        setOwners(ownersRes.data || []);
      }

      if (leadsRes.error) {
        console.warn("Leads table is not ready yet:", leadsRes.error.message);
        setLeads([]);
      } else {
        setLeads(leadsRes.data || []);
      }

      setInitialized(true);
    } catch (error) {
      console.error("Dashboard fetch failed:", error);
      setProperties([]);
      setOwners([]);
      setLeads([]);
      setInitialized(true);
    } finally {
      setLoading(false);
    }
  }, [initialized]);

  useEffect(() => {
    if (!initialized) fetchDashboardData();
  }, [initialized, fetchDashboardData]);

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshProperties(), refreshOwners(), refreshLeads()]);
  }, [refreshProperties, refreshOwners, refreshLeads]);

  const value = useMemo(
    () => ({
      properties,
      owners,
      leads,
      loading,
      initialized,
      setProperties,
      setOwners,
      setLeads,
      refreshProperties,
      refreshOwners,
      refreshLeads,
      refreshAll,
    }),
    [
      properties,
      owners,
      leads,
      loading,
      initialized,
      refreshProperties,
      refreshOwners,
      refreshLeads,
      refreshAll,
    ]
  );

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext);
  if (!context) throw new Error("useDashboardData must be used inside DashboardDataProvider");
  return context;
}
