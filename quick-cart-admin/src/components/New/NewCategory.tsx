/* eslint-disable @typescript-eslint/no-explicit-any */
import "./new.scss";
import "../../components/dataTable/dataTable.scss";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { categoryApiRequests } from "../../api/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const NewCategory = () => {
  const [file, setFile] = useState<File | null>(null);
  const [categoryData, setCategoryData] = useState({
    title: "",
    subTitle: "",
    file: null as File | null,
  }); 
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryData({
      ...categoryData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = e.target as HTMLInputElement;
    const selectedFile = inputElement.files ? inputElement.files[0] : null;
   

    setCategoryData({
      ...categoryData,
      file: selectedFile,
    });

    // Update the file state for displaying the selected image
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", categoryData.title);
    formData.append("subTitle", categoryData.subTitle);
    if (categoryData.file) {
      formData.append("file", categoryData.file);
    }

    try {
      await categoryApiRequests.createCategory(formData);
      toast.success("Category Added Successfully");

      // Reset the form by updating the state with initial values
      setCategoryData({
        title: "",
        subTitle: "",
        file: null,
      });
      // Clear the file state to remove the uploaded image
      setFile(null);
      // Clear the file input
      const inputElement = document.getElementById("fileInput") as HTMLInputElement;
      if (inputElement) {
        inputElement.value = "";
      }
    } catch (error: any) {
      console.error("Error adding category:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new">
      <div className="newContainer">
        <div className="top">
          <h1>Add a Category</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt="Category Preview"
            />
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label htmlFor="fileInput">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  name="image"
                  id="fileInput"
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>
              <div className="formInput">
                <div className="formRow">
                  <div className="formColumn">
                    <label>Title:</label>
                    <input
                      type="text"
                      name="title"
                      value={categoryData.title}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="formRow">
                  <div className="formColumn">
                    <label>Sub Title:</label>
                    <input
                      type="text"
                      name="subTitle"
                      value={categoryData.subTitle}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading}>{loading ? "Uploading..." : "Add Category"}</button>
              </div>
            </form>
            <div className="linkContainer">
              <div className="link">
                <Link to="/subcategories/add-subcategory" className="link">
                  Add Subcategory
                </Link>
                <Link to="/banners/add-banner" className="link">
                  Add Banner
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCategory;
