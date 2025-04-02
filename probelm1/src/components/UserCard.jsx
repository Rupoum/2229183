const UserCard = ({ user, rank }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex items-center p-4 mb-4">
      <div className="flex items-center justify-center bg-blue-100 rounded-full w-10 h-10 mr-4 font-bold text-blue-600">
        {rank}
      </div>
      <img
        src={user.imageUrl || "/placeholder.svg"}
        alt={user.name}
        className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-blue-500"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{user.name}</h3>
        <p className="text-gray-500">User ID: {user.id}</p>
      </div>
      <div className="bg-blue-500 text-white rounded-full px-4 py-2 font-bold">{user.postCount} Posts</div>
    </div>
  )
}

export default UserCard

