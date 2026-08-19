import { useState } from 'react';
import { MapPin, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddressCard, AppHeader, PrimaryButton } from '../../components/UiLibrary.jsx';
import { AddressFormModal, ConfirmDialog } from '../../components/customer/AddressFormModal.jsx';
import { useAddress } from '../../context/AddressContext.jsx';

export function AddressPage() {
  const navigate = useNavigate();
  const {
    addresses,
    selectedId,
    addAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
    setDefaultAddress,
  } = useAddress();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const editingAddress = editingId ? addresses.find((a) => a.id === editingId) : null;

  function openAdd() {
    setFormMode('add');
    setEditingId(null);
    setFormOpen(true);
  }

  function openEdit(id) {
    setFormMode('edit');
    setEditingId(id);
    setFormOpen(true);
  }

  function handleSave(data) {
    if (formMode === 'edit' && editingId) {
      updateAddress(editingId, data);
    } else {
      addAddress(data);
    }
  }

  function confirmDelete() {
    if (deleteTarget) deleteAddress(deleteTarget);
    setDeleteTarget(null);
  }

  const cardProps = (address) => ({
    address,
    selected: address.id === selectedId,
    onSelect: () => selectAddress(address.id),
    onEdit: () => openEdit(address.id),
    onDelete: () => setDeleteTarget(address.id),
    onSetDefault: () => setDefaultAddress(address.id),
  });

  return (
    <div className="am-content">
      <div className="sticky top-0 z-30 border-b border-soft-200 bg-white md:hidden">
        <AppHeader
          title="My Addresses"
          onBack={() => navigate('/customer/profile')}
          rightSlot={
            <button type="button" className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand-700 shadow-sm" onClick={openAdd}>
              <Plus size={18} />
            </button>
          }
        />
      </div>

      <div className="hidden border-b border-soft-200 bg-white md:block">
        <div className="am-container py-6">
          <button type="button" onClick={() => navigate('/customer/profile')} className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800">
            <ArrowLeft size={18} />
            Back to Profile
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-ink">My Addresses</h1>
            <button type="button" className="btn btn-primary px-4 py-2 text-sm" onClick={openAdd}>
              <Plus size={18} />
              Add Address
            </button>
          </div>
        </div>
      </div>

      <div className="pb-24 md:pb-6">
        <div className="am-container py-6 md:py-8">
          {addresses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-soft-200 bg-white px-6 py-16 text-center">
              <MapPin className="mx-auto text-brand-400" size={48} />
              <h2 className="mt-4 text-lg font-extrabold text-ink">No saved addresses</h2>
              <p className="mt-2 text-sm text-soft-600">Add a delivery address to checkout faster.</p>
              <button type="button" className="btn btn-primary mt-6 px-8" onClick={openAdd}>
                Add New Address
              </button>
            </div>
          ) : (
            <>
              <div className="hidden grid gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
                {addresses.map((address) => (
                  <AddressCard key={address.id} {...cardProps(address)} />
                ))}
              </div>

              <div className="space-y-3 px-3 pb-5 md:hidden">
                {addresses.map((address) => (
                  <AddressCard key={address.id} {...cardProps(address)} />
                ))}
                <div className="pt-2">
                  <PrimaryButton onClick={openAdd}>Add new address</PrimaryButton>
                </div>
              </div>

              <div className="hidden md:mt-8 md:block">
                <PrimaryButton className="max-w-md" onClick={openAdd}>
                  Add new address
                </PrimaryButton>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="h-20 md:hidden" />

      <AddressFormModal
        open={formOpen}
        mode={formMode}
        initial={editingAddress}
        onSave={handleSave}
        onClose={() => {
          setFormOpen(false);
          setEditingId(null);
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete address?"
        message="This address will be removed from your saved addresses. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
