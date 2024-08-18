/* eslint-disable @typescript-eslint/no-explicit-any */
import "./dataTable.scss";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { userApiRequest } from "../../api/api";


const userColumns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "user",
      headerName: "User",
      width: 230,
      renderCell: (params) => {
        return <div className="cellWithStatus">{params.row.name}</div>;
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 230,
    },
  
    {
      field: "role",
      headerName: "Role",
      width: 100,
    },
    {
      field: "business",
      headerName: "Business Name",
      width: 180,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus ${params.row.business}`}>
            {params.row.business}
          </div>
        );
      },
    },
    {
      field: "number",
      headerName: "Phone Number",
      width: 180,
    },
  ];

const Users: React.FC = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await userApiRequest.getUsers();
      // Transform the fetched data to match the productRows format
      const transformedData = response.data.data.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        business: user.businessName,
        number: user.phoneNumber,
      }));
      setUsers(transformedData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: any) => {
    try {
      // Make an API request to delete the category with the given id
      await userApiRequest.deleteUser(id);
      toast.success("User deleted Successfully");

      // Fetch the updated users after deletion
      fetchUsers();
    } catch (error: any) {
      console.error(`Error deleting user with id ${id}:`, error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };


  const actionColumn: GridColDef[] = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="action">
            <Link
              to={`/users/${params.row.id}`}
            >
              <img src="/view.svg" alt="" />
            </Link>
            <div className="delete" onClick={() => handleDelete(params.row.id)}>
            <img src="/delete.svg" alt="" />
          </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="dataTable">
      <div className="datatableTitle">
        Add New User
        <Link to="/users/add-user" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="dataGrid"
        rows={users}
        columns={userColumns.concat(actionColumn)}
        initialState={{
            pagination: {
              paginationModel: {
                pageSize: 9,
              },
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          pageSizeOptions={[9]}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
          rowHeight={100}
      />
    </div>
  );
};

export default Users;
