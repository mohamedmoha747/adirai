import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { addressList as seedAddresses } from '../data/mockData.js';

const STORAGE_KEY = 'am_addresses';
const SELECTED_KEY = 'am_selected_address';

const AddressContext = createContext(null);

function normalizeAddress(raw) {
  if (!raw) return null;
  const pincodeFromLine2 = raw.line2?.match(/\d{6}/)?.[0] || '';
  const cityFromLine2 = raw.line2?.split('-')[0]?.trim() || '';
  return {
    id: raw.id,
    type: raw.type || 'Home',
    name: raw.name || '',
    phone: raw.phone || '',
    line1: raw.line1 || '',
    area: raw.area || '',
    city: raw.city || cityFromLine2 || 'Chennai',
    state: raw.state || 'Tamil Nadu',
    pincode: raw.pincode || pincodeFromLine2 || '',
    isDefault: Boolean(raw.isDefault),
  };
}

function loadAddresses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        return parsed.map(normalizeAddress);
      }
    }
  } catch {
    /* use seed */
  }
  return seedAddresses.map(normalizeAddress);
}

function loadSelectedId(addresses) {
  try {
    const id = localStorage.getItem(SELECTED_KEY);
    if (id && addresses.some((a) => a.id === id)) return id;
  } catch {
    /* fall through */
  }
  const def = addresses.find((a) => a.isDefault);
  return def?.id || addresses[0]?.id || null;
}

function saveAddresses(addresses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
}

function saveSelectedId(id) {
  if (id) localStorage.setItem(SELECTED_KEY, id);
  else localStorage.removeItem(SELECTED_KEY);
}

export function formatAddressSummary(address) {
  if (!address) return '';
  const parts = [address.line1, address.area, address.city, address.state, address.pincode].filter(Boolean);
  return parts.join(', ');
}

export function formatAddressShort(address) {
  if (!address) return '';
  return `${address.area ? `${address.area}, ` : ''}${address.city}${address.pincode ? ` - ${address.pincode}` : ''}`;
}

function newId() {
  return `a${Date.now().toString(36)}`;
}

export function AddressProvider({ children }) {
  const [addresses, setAddresses] = useState(loadAddresses);
  const [selectedId, setSelectedId] = useState(() => loadSelectedId(loadAddresses()));

  useEffect(() => {
    saveAddresses(addresses);
  }, [addresses]);

  useEffect(() => {
    saveSelectedId(selectedId);
  }, [selectedId]);

  useEffect(() => {
    if (selectedId && !addresses.some((a) => a.id === selectedId)) {
      const fallback = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedId(fallback?.id || null);
    }
  }, [addresses, selectedId]);

  const defaultAddress = useMemo(
    () => addresses.find((a) => a.isDefault) || addresses[0] || null,
    [addresses],
  );

  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedId) || defaultAddress,
    [addresses, selectedId, defaultAddress],
  );

  const addAddress = useCallback((data) => {
    const entry = normalizeAddress({ ...data, id: newId(), isDefault: false });
    let next = [...addresses, entry];
    if (addresses.length === 0 || data.makeDefault) {
      next = next.map((a) => ({ ...a, isDefault: a.id === entry.id }));
      setSelectedId(entry.id);
    }
    setAddresses(next);
    return entry;
  }, [addresses]);

  const updateAddress = useCallback((id, data) => {
    setAddresses((prev) =>
      prev.map((a) => (a.id === id ? normalizeAddress({ ...a, ...data, id }) : a)),
    );
  }, []);

  const deleteAddress = useCallback((id) => {
    setAddresses((prev) => {
      const remaining = prev.filter((a) => a.id !== id);
      if (!remaining.length) {
        setSelectedId(null);
        return [];
      }
      const deletedWasDefault = prev.find((a) => a.id === id)?.isDefault;
      if (deletedWasDefault) {
        const nextDefault = remaining[0];
        const updated = remaining.map((a, i) => ({
          ...a,
          isDefault: i === 0,
        }));
        setSelectedId(updated[0].id);
        return updated;
      }
      if (selectedId === id) {
        const fallback = remaining.find((a) => a.isDefault) || remaining[0];
        setSelectedId(fallback.id);
      }
      return remaining;
    });
  }, [selectedId]);

  const selectAddress = useCallback((id) => {
    if (addresses.some((a) => a.id === id)) {
      setSelectedId(id);
    }
  }, [addresses]);

  const setDefaultAddress = useCallback((id) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id })),
    );
    setSelectedId(id);
  }, []);

  const value = useMemo(
    () => ({
      addresses,
      selectedId,
      selectedAddress,
      defaultAddress,
      addAddress,
      updateAddress,
      deleteAddress,
      selectAddress,
      setDefaultAddress,
    }),
    [
      addresses,
      selectedId,
      selectedAddress,
      defaultAddress,
      addAddress,
      updateAddress,
      deleteAddress,
      selectAddress,
      setDefaultAddress,
    ],
  );

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

export function useAddress() {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error('useAddress must be used inside AddressProvider');
  return ctx;
}
