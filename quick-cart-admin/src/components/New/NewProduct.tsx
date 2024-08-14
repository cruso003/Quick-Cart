/* eslint-disable @typescript-eslint/no-explicit-any */
import "./product.scss";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { Key, useEffect, useState } from "react";
import { categoryApiRequests, productApiRequests } from "../../api/api";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const NewProduct = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    discount_price: "",
    stock: "",
    sellerId: "",
    variations: [] as any[],
    condition: "",
    brand: "",
    images: [] as string[],
  });

  const fetchCategories = async () => {
    try {
      const response = await categoryApiRequests.getCategories();

      if (Array.isArray(response.data)) {
        const transformedData = response.data.map((category: any) => {
          const subcategoryData = Array.isArray(category.subcategories)
            ? category.subcategories.map((subcategory: any) => ({
                id: subcategory.id,
                title: subcategory.title,
                imageUrl: subcategory.imageUrl,
              }))
            : [];
          return {
            id: category.id,
            category: category.title,
            subcategories: subcategoryData,
          };
        });

        setCategories(transformedData);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        sellerId: user.storeId,
      }));
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles(newFiles);
    setFormData({
      ...formData,
      images: newFiles.map((file) => URL.createObjectURL(file)),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "category") {
      const selectedCategory = categories.find(
        (category: any) => category.category === value
      );

      if (selectedCategory) {
        setSubcategories(selectedCategory.subcategories || []);

        setFormData({
          ...formData,
          category: selectedCategory.id,
          subcategory: "",
        });
      }
    } else if (name === "subcategory") {
      const selectedSubcategory = subcategories.find(
        (subcategory: any) => subcategory.title === value
      );

      setFormData({
        ...formData,
        subcategory: selectedSubcategory ? selectedSubcategory.id : "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleVariationChange = (
    index: number,
    key: "name" | "options",
    value: string | string[]
  ) => {
    const newVariations = [...formData.variations];
    if (key === "options") {
      newVariations[index][key] = Array.isArray(value)
        ? value
        : value.split(", ");
    } else {
      newVariations[index][key] = value as string;
    }
    setFormData({
      ...formData,
      variations: newVariations,
    });
  };

  const addVariation = () => {
    setFormData({
      ...formData,
      variations: [...formData.variations, { name: "", options: [] }],
    });
  };

  const removeVariation = (index: number) => {
    const newVariations = [...formData.variations];
    newVariations.splice(index, 1);
    setFormData({
      ...formData,
      variations: newVariations,
    });
  };

  const addOption = (variationIndex: number) => {
    const newVariations = [...formData.variations];
    newVariations[variationIndex].options.push("");
    setFormData({
      ...formData,
      variations: newVariations,
    });
  };

  const removeOption = (variationIndex: number, optionIndex: number) => {
    const newVariations = [...formData.variations];
    newVariations[variationIndex].options.splice(optionIndex, 1);
    setFormData({
      ...formData,
      variations: newVariations,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = new FormData();

      // Append the files (images)
      files.forEach((file) => {
        productData.append("images", file);
      });

      // Append other form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "variations") {
          // Convert variations array to JSON string
          productData.append(key, JSON.stringify(value));
        } else {
          productData.append(key, value as string);
        }
      });

      // Send the FormData to the API
      await productApiRequests.createProduct(productData);

      // Reset form after submission
      setFiles([]);
      setFormData({
        name: "",
        description: "",
        category: "",
        subcategory: "",
        price: "",
        discount_price: "",
        stock: "",
        sellerId: "",
        variations: [],
        condition: "",
        brand: "",
        images: [],
      });

      // Handle success
      toast.success("Product Added Successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product">
      <div className="productContainer">
        <div className="top">
          <h1>Add a Product</h1>
        </div>
        <div className="bottom">
          <div className="left">
            {files.map((file, index) => (
              <img key={index} src={URL.createObjectURL(file)} alt="Add file" />
            ))}
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label htmlFor="files">
                  Images: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="files"
                  name="images"
                  onChange={handleFileChange}
                  multiple
                  style={{ display: "none" }}
                />
              </div>
              <div className="formInput">
                <div className="formRow">
                  <div className="formColumn">
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="formColumn">
                    <label htmlFor="description">Description:</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="formRow">
                  <div className="formColumn">
                    <label>Category:</label>
                    <select
                      name="category"
                      value={
                        categories.find(
                          (category) => category.id === formData.category
                        )?.category || ""
                      }
                      onChange={handleChange}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category: any) => (
                        <option key={category.id} value={category.category}>
                          {category.category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="formColumn">
                    <label>Subcategory:</label>
                    <select
                      name="subcategory"
                      value={
                        subcategories.find(
                          (subcategory) =>
                            subcategory.id === formData.subcategory
                        )?.title || ""
                      }
                      onChange={handleChange}
                    >
                      <option value="">Select Subcategory</option>
                      {subcategories.map((subcategory: any, index: Key) => (
                        <option key={index} value={subcategory.title}>
                          {subcategory.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="formRow">
                  <div className="formColumn">
                    <label htmlFor="price">Price:</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="formColumn">
                    <label htmlFor="discount_price">Discount Price:</label>
                    <input
                      type="number"
                      name="discount_price"
                      value={formData.discount_price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_price: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="formRow">
                  <div className="formColumn">
                    <label htmlFor="stock">Stock:</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stock: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="formColumn">
                    <label htmlFor="condition">Condition:</label>
                    <input
                      type="text"
                      name="condition"
                      value={formData.condition}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          condition: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="formRow">
                  <div className="formColumn">
                    <label htmlFor="brand">Brand:</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="formRow">
                  <div className="formColumn">
                    <label>Variations:</label>
                    {formData.variations.map((variation, index) => (
                      <div key={index}>
                        <input
                          type="text"
                          placeholder="Variation Name"
                          value={variation.name}
                          onChange={(e) =>
                            handleVariationChange(index, "name", e.target.value)
                          }
                        />
                        <div>
                          {variation.options.map((option: any, optionIndex: any) => (
                            <div key={optionIndex}>
                              <input
                                type="text"
                                placeholder="Option"
                                value={option}
                                onChange={(e) =>
                                  handleVariationChange(
                                    index,
                                    "options",
                                    variation.options.map((opt: any, i: Key | null | undefined) =>
                                      i === optionIndex ? e.target.value : opt
                                    )
                                  )
                                }
                              />
                              <button
                                type="button"
                                onClick={() => removeOption(index, optionIndex)}
                              >
                                Remove Option
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addOption(index)}
                          >
                            Add Option
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVariation(index)}
                        >
                          Remove Variation
                        </button>
                      </div>
                    ))}

                    <button type="button" onClick={addVariation}>
                      Add Variation
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}>
                  {loading ? "Adding Product..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProduct
