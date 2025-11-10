// src/pages/admin/AdminUsers.jsx
import { useEffect, useState } from "react";
import { fetchUsers } from "../../api/users";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };
    loadUsers();
  }, []);

  return (
    <div className="container">
      <h1>All Users</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} ({u.email}) - Role: {u.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminUsers;
