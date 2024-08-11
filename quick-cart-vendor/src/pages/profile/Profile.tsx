import React, { useState } from "react";
import "./profile.scss";
import { userApiRequest } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const Profile: React.FC = () => {
  const { user, updateUser, setUserAvatar } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState(user?.address || "");
  const [city, setCity] = useState(user?.city || "");
  const [state, setState] = useState(user?.state || "");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUploadAvatar = async () => {
    if (avatar) {
      const formData = new FormData();
      formData.append("file", avatar);
      formData.append("upload_preset", "Eventify");
      formData.append("cloud_name", "dl43pywkr");

      try {
        setLoading(true);
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dl43pywkr/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) {
          throw new Error("Failed to upload image to Cloudinary");
        }

        const data = await res.json();
        setUserAvatar(data.secure_url);
        setLoading(false);
      } catch (error) {
        console.error("Error uploading avatar:", error);
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    const updatedUser = { name, phoneNumber, address, city, state, businessName, avatar: user.avatar, password };
    try {
      setLoading(true);
     await userApiRequest.updateUserByEmail(user.email, updatedUser);
      toast.success("Vendor info Updated")
      updateUser(updatedUser);
      setLoading(false);
    } catch (error) {
      console.error("Error updating user:", error);
      setLoading(false);
    }
  };
  

  return (
    <div className="profile">
      <img src={user?.avatar || "/noavatar.png"} alt="avatar" className="avatar" />
      <div className="profile-form">
        <div className="input-group">
          <label>
            Full Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Email:
            <input type="email" value={user.email} disabled />
          </label>
        </div>
        <div className="input-group">
          <label>
            Phone Number:
            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </label>
          <label>
            Address:
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>
        </div>
        <div className="input-group">
          <label>
            City:
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
          <label>
            State:
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} />
          </label>
          </div>
          <div className="input-group">
            <label>
              Password:
              <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </label>
          
          <label>
            Business Name:
            <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
          </label>
        </div>
        <div className="input-group">
          <label>
            Upload Avatar:
            <input type="file" onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)} />
          </label>
          <button onClick={handleUploadAvatar} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
        <button onClick={handleSave}>{loading ? "Saving..." : "Save Changes"}</button>
      </div>
    </div>
  );
};

export default Profile;