/* eslint-disable @typescript-eslint/no-explicit-any */
import "./banner.scss";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { bannerApiRequests, productApiRequests } from "../../api/api";

// Define types for product and banner data
interface Product {
  id: string;
  name: string;
}

const NewBanner = () => {
  const [file, setFile] = useState<File | null>(null);
  const [bannerData, setBannerData] = useState({
    name: "",
    linkedProducts: [] as string[],
    image: null as File | null,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the list of products when the component mounts
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productApiRequests.getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = e.target;
    const selectedFile = inputElement.files ? inputElement.files[0] : null;

    setBannerData((prevState) => ({
      ...prevState,
      image: selectedFile,
    }));

    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", bannerData.name);
    if (bannerData.image) {
      formData.append("image", bannerData.image);
    }

    // Append each selected product ID to the form data
    bannerData.linkedProducts.forEach((productId) => {
      formData.append("linkedProducts", productId);
    });

    try {
      await bannerApiRequests.uploadBanner(formData);
      toast.success("Banner Added Successfully");

      // Reset the form by updating the state with initial values
      setBannerData({
        name: "",
        linkedProducts: [],
        image: null,
      });
      setFile(null);

      // Clear the file input
      const inputElement = document.getElementById("fileInput") as HTMLInputElement;
      if (inputElement) {
        inputElement.value = "";
      }
    } catch (error: any) {
      console.error("Error adding banner:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="banner">
      <div className="bannerContainer">
        <div className="top">
          <h1>Add New Banner</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt="Banner Preview"
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
                  id="fileInput"
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>
              <div className="formInput">
                <div className="formRow">
                  <div className="formColumn">
                    <label>Name:</label>
                    <input
                      type="text"
                      value={bannerData.name}
                      onChange={(e) =>
                        setBannerData((prevState) => ({
                          ...prevState,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="formRow">
                  <div className="formColumn">
                    <label>Link to Products:</label>
                    <select
                      className="select"
                      multiple
                      value={bannerData.linkedProducts}
                      onChange={(e) => {
                        const selectedProducts = Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        );
                        setBannerData((prevState) => ({
                          ...prevState,
                          linkedProducts: selectedProducts,
                        }));
                      }}
                    >
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit">
                  {loading ? "Uploading..." : "Add Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBanner;
