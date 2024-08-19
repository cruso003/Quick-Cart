/* eslint-disable @typescript-eslint/no-explicit-any */
import "./dataTable.scss";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ordersApiRequests } from "../../api/api";


const orderColumns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "product",
    headerName: "Product",
    width: 220,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {(params.row.product || []).map((product: any, index: any) => (
            <div key={index}>
              <img className="cellImg" src={product.img} alt="avatar" />
              {product.name}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    field: "customer",
    headerName: "Customer",
    width: 150,
  },
  {
    field: "date",
    headerName: "Date",
    width: 100,
  },
  {
    field: "amount",
    headerName: "Amount",
    width: 100,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.amount}`}>
          ${params.row.amount}
        </div>
      );
    },
  },
  {
    field: "paymentMethod",
    headerName: "Payment Method",
    width: 180,
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];


const Orders: React.FC = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
      try {
        const response = await ordersApiRequests.getOrders();
        
        const transformedData = response.data.map((order: any) => ({
          id: order.id,
          product: order.products.map((product: any) => ({
            name: product.product.brand,
            img: product.product.images[0],
            quantity: product.quantity,
            price: product.product.price,
          })),
          customer: order.user.name,
          date: new Date(order.orderDate).toLocaleDateString(),
          amount: order.totalAmount,
          paymentMethod: order.paymentMethod,
          status: order.status,
        }));
  
        setOrders(transformedData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
  
    useEffect(() => {
      fetchOrders();
    }, []);
  
    const handleDelete = async (id: any) => {
      try {
        // Make an API request to delete the order with the given id
        await ordersApiRequests.cancelOrder(id);
        toast.success("Order cancel Successfully");
  
        // Fetch the updated order after deletion
        fetchOrders();
      } catch (error: any) {
        console.error(`Error deleting product with id ${id}:`, error);
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
              to={`/orders/${params.row.id}`}
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
        Add New Order
        <Link to="/orders/add-order" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="dataGrid"
        rows={orders}
        columns={orderColumns.concat(actionColumn)}
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

export default Orders;