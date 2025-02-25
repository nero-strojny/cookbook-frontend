import { isMobileOnly } from "react-device-detect";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { useUser } from "../context/UserContext";
import { Button } from "../shared/Button";
import { LoadingFormButton } from "../shared/LoadingFormButton";
import { PageHeader } from "../shared/PageHeader";
import { usePutPassword } from "../hooks/useSetPassword";

export const Profile = () => {
  const {clearToken, user} = useUser();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const passwordMutation = usePutPassword()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
      await passwordMutation.mutateAsync({userName: user || '', currentPassword, newPassword})
    }
  };
  return (
    <div className={`p-4 ${isMobileOnly ? 'my-14' : 'mt-10 ml-42'}` }>
      <PageHeader title="Profile">
        <Button onClick={()=>clearToken()} className="ml-auto">
          <div className="flex items-center gap-2">
            <FiLogOut size={20} />
            {"Logout"}
          </div>
        </Button>
      </PageHeader>
      <div className="flex justify-center items-center">
      <div className="bg-white px-8 py-4 mt-4 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="newPassword"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <LoadingFormButton text='Change password' isLoading={passwordMutation.isPending && !passwordMutation.isError} />
        </form>
      </div>
    </div>
    </div>
  )
}
