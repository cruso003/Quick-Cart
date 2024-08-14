/* eslint-disable @typescript-eslint/no-explicit-any */
import "./dataTable.scss";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { categoryApiRequests } from "../../api/api";

const categoryColumns: GridColDef[] = [
  { 
    field: "id", 
    headerName: "ID", 
    width: 70, 
    headerAlign: 'center', 
    align: 'center'
  },
  { 
    field: "img", 
    headerName: "Image", 
    width: 100, 
    headerAlign: 'center', 
    align: 'center',
    renderCell: (params) => (
      <img 
        src={params.row.img} 
        alt='' 
        style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover", marginTop: 20 }} 
      />
    ) 
  },
  {
    field: "category",
    headerName: "Category",
    width: 200,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => (
      <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
        {params.row.category}
      </div>
    ),
  },
  {
    field: "subcategories",
    headerName: "Subcategories",
    width: 300,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => (
      <div style={{ height: "150px", overflowY: "auto", textAlign: 'center' }}>
        {params.row.subcategories.map((subCategory: any, index: any) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <img
              src={subCategory.imageUrl}
              alt={`Subcategory ${index + 1}`}
              style={{ width: 40, height: 40, borderRadius: "50%", marginRight: '10px', objectFit: "cover" }}
            />
            <span>{subCategory.title}</span>
          </div>
        ))}
      </div>
    ),
  },
];

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await categoryApiRequests.getCategories();
         
      const transformedData = response.data.map((category: any) => {
        const subcategoryData = category.subcategories.map((subcategory: any) => ({
          title: subcategory.title,
          imageUrl: subcategory.imageUrl,
        }));

        return {
          id: category.id,
          category: category.title,
          img: category.imageUrl || "",
          subcategories: subcategoryData,
        };
      });

      setCategories(transformedData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await categoryApiRequests.deleteCategory(id);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error: any) {
      console.error(`Error deleting category with id ${id}:`, error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const actionColumn: GridColDef[] = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="action" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Link to={`/categories/${params.row.id}`}>
            <img src="/view.svg" alt="View" style={{ cursor: 'pointer' }} />
          </Link>
          <div className="delete" onClick={() => handleDelete(params.row.id)} style={{ cursor: 'pointer' }}>
            <img src="/delete.svg" alt="Delete" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="dataTable">
      <div className="datatableTitle">
        Add New Category
        <Link to="/categories/add-category" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="dataGrid"
        rows={categories}
        columns={categoryColumns.concat(actionColumn)}
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

export default Categories;
