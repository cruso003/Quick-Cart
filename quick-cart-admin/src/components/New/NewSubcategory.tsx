/* eslint-disable @typescript-eslint/no-explicit-any */
import "./new.scss";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import { categoryApiRequests, subcategoryApiRequests } from "../../api/api";
import { toast } from "react-toastify";

const NewSubcategory = () => {
  const [file, setFile] = useState<File | null>(null); 
  const [subcategoryData, setSubcategoryData] = useState({
    title: "",
    category: "",
    image: null as File | null,
  });
  const [categories, setCategories] = useState<{ id: string; title: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApiRequests.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setSubcategoryData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "category") {
      setSelectedCategory(value);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = e.target as HTMLInputElement;
    const selectedFile = inputElement.files ? inputElement.files[0] : null;

    setSubcategoryData((prevState) => ({
      ...prevState,
      image: selectedFile,
    }));

    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", subcategoryData.title);
    formData.append("category", selectedCategory);
    if (subcategoryData.image) {
      formData.append("image", subcategoryData.image);
    }

    try {
      await subcategoryApiRequests.createSubcategory(formData);
      toast.success("Subcategory Added Successfully");

      // Reset the form and states
      setSubcategoryData({
        title: "",
        category: "",
        image: null,
      });
      setFile(null);
      const inputElement = document.getElementById("fileInput") as HTMLInputElement;
      if (inputElement) {
        inputElement.value = "";
      }
      setSelectedCategory("");
    } catch (error: any) {
      console.error("Error adding subcategory:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="new">
      <div className="newContainer">
        <div className="top">
          <h1>Add New Subcategory</h1>
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
                      value={subcategoryData.title}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="formRow">
                  <div className="formColumn">
                    <label>Category:</label>
                    <select
                      name="category"
                      value={selectedCategory}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit">Add Subcategory</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSubcategory;
