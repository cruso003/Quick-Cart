/* eslint-disable @typescript-eslint/no-explicit-any */
import "./dataTable.scss";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { productApiRequests } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";


const productColumns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "img", headerName: "Image", width: 100, renderCell: (params) => {
    return <img src={params.row.img} alt='' style={{ width: 50, height: 50, borderRadius: "50%" }} />;
  }},
  {
    field: "name",
    headerName: "Product",
    width: 200,
    type: "string"
  },
  {
    field: "description",
    headerName: "Description",
    width: 230,
    type: "string"
  },
  {
    field: "price",
    headerName: "Price",
    width: 100,
    type: "string"
  },
  {
    field: "total_sale",
    headerName: "Total Sale",
    width: 200,
    type: "string"
  },
  ];

  const Products: React.FC = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
  
    const fetchProducts = async () => {
      try {
        const response = await productApiRequests.getProducts();
        
        // Filter products based on the user's store ID
        const filteredProducts = response.data.filter((product: any) => 
          product.storeId === user.storeId
        );
  
        // Transform the fetched data to match the productRows format
        const transformedData = filteredProducts.map((product: any) => ({
          id: product.id,
          name: product.name,
          img: product.images ? product.images[0] : "",
          description: product.description,
          total_sale: product.totalSale,
          price: product.discount_price ? product.discount_price : product.price,
        }));
  
        setProducts(transformedData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    useEffect(() => {
      fetchProducts();
    }, [user.storeId]);

  const handleDelete = async (id: any) => {
    try {
      // Make an API request to delete the category with the given id
      await productApiRequests.deleteProduct(id);
      toast.success("Product deleted Successfully");

      // Fetch the updated categories after deletion
      fetchProducts();
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
              to={`/events/${params.row.id}`}
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
        Add New Product
        <Link to="/products/add-product" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="dataGrid"
        rows={products}
        columns={productColumns.concat(actionColumn)}
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

export default Products;
