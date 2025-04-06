import { useData } from "../context/DataContext";
import UserCard from "../components/UserCard";
import { Users } from "lucide-react";

const TopUsers = () => {
  const { topUsers, loading } = useData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Users size={24} className="text-blue-600 mr-2" />
        <h1 className="text-2xl font-bold">Top Users</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Users with the Most Posts
        </h2>
        <p className="text-gray-600 mb-6">
          These are the top 5 most active users on the platform based on the
          number of posts they've created.
        </p>

        <div className="space-y-4">
          {topUsers.map((user, index) => (
            <UserCard key={user.id} user={user} rank={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopUsers;
