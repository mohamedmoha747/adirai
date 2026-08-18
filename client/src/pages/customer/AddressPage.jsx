import { Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addressList } from '../../data/mockData.js';
import { AddressCard, AppHeader, PrimaryButton, Footer } from '../../components/UiLibrary.jsx';

export function AddressPage() {
  const navigate = useNavigate();

  return (
    <div className="am-content">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 border-b border-soft-200 bg-white md:hidden">
        <AppHeader
          title="My Addresses"
          onBack={() => navigate('/profile')}
          rightSlot={
            <button className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand-700 shadow-sm">
              <Plus size={18} />
            </button>
          }
        />
      </div>

      {/* Desktop Header */}
      <div className="hidden border-b border-soft-200 bg-white md:block">
        <div className="am-container py-6">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
          >
            <ArrowLeft size={18} />
            Back to Profile
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-ink">My Addresses</h1>
            <button
              type="button"
              className="btn btn-primary px-4 py-2 text-sm"
              onClick={() => {}}
            >
              <Plus size={18} />
              Add Address
            </button>
          </div>
        </div>
      </div>

      <div className="pb-24 md:pb-6">
        <div className="am-container py-6 md:py-8">
          {/* Desktop Grid Layout */}
          <div className="hidden grid gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
            {addressList.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                selected={address.isDefault}
                onSelect={() => {}}
                onEdit={() => {}}
              />
            ))}
          </div>

          {/* Mobile Stack Layout */}
          <div className="space-y-3 px-3 pb-5 md:hidden">
            {addressList.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                selected={address.isDefault}
                onSelect={() => {}}
                onEdit={() => {}}
              />
            ))}
            <div className="pt-2">
              <PrimaryButton>Add new address</PrimaryButton>
            </div>
          </div>

          {/* Desktop Add Button */}
          <div className="hidden md:mt-8 md:block">
            <PrimaryButton className="max-w-md" onClick={() => {}}>
              Add new address
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav spacing */}
      <div className="h-20 md:hidden" />

      {/* Footer */}
      <Footer />
    </div>
  );
}
