import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Profile.css";
import admin from "../../assets/admin.png";
import { getProfile, updateProfile } from "../../api/profileApi";

function Profile() {

  const [isEditing, setIsEditing] = useState(false);

const [showPassword, setShowPassword] = useState(false);

const [profile, setProfile] = useState({
  employeeId: "",
  username: "",
  email: "",
  mobileNumber: "",
  role: "",
  image: admin,
});

useEffect(() => {
    fetchProfile();
}, []);

const fetchProfile = async () => {
    try {
        const response = await getProfile();

        setProfile({
            employeeId: response.data.employeeId,
            username: response.data.username,
            email: response.data.email,
            mobileNumber: response.data.mobileNumber,
            role: response.data.role,
            image: admin
        });

    } catch (error) {
        console.error(error);
    }
};

const [password, setPassword] = useState({
  current: "",
  new: "",
  confirm: "",
});


const handleSave = async () => {

    if (
        !profile.username ||
        !profile.email ||
        !profile.mobileNumber
    ) {
        alert("Please fill all required fields.");
        return;
    }

    try {

        await updateProfile(profile);

        alert("Profile Updated Successfully!");

        setIsEditing(false);

        fetchProfile();

    } catch (error) {

        console.error(error);

        alert("Failed to update profile.");
    }
};

const handleImage = (e) => {
  if (e.target.files[0]) {
    setProfile({
      ...profile,
      image: URL.createObjectURL(e.target.files[0]),
    });
  }
};

const handlePassword = () => {
  if (
    !password.current ||
    !password.new ||
    !password.confirm
  ) {
    alert("Fill all password fields");
    return;
  }

  if (password.new !== password.confirm) {
    alert("Passwords do not match");
    return;
  }

  alert("Password Changed Successfully!");

  setShowPassword(false);

  setPassword({
    current: "",
    new: "",
    confirm: "",
  });
};




  return (
    <div className="layout">
      <Sidebar activePage="Profile" />

      <div className="main-content">
        <Header title="My Profile" />

        <div className="page-content">
          <h1 className="page-title">Admin Profile</h1>

          <div className="profile-card">

            
                <div className="profile-left">
                  <img
                    src={profile.image}
                    alt="Admin"
                    className="profile-image"
                  />

                  {isEditing && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                    />
                  )}

                  <h2>Admin</h2>
                  <p>System Administrator</p>
                </div>

            <div className="profile-right">

              <div className="profile-row">
                <strong>Employee ID:</strong>
                <span>{profile.employeeId}</span>
              </div>

              <div className="profile-row">
                <strong>Name:</strong>
                  {isEditing ? (
                  <input
                  value={profile.username}
                  onChange={(e)=>
                  setProfile({
                  ...profile,
                  username:e.target.value
                  })
                  }
                  />
                  ) : (
                  <span>{profile.username}</span>
                  )}
              </div>

              <div className="profile-row">
                <strong>Email:</strong>
                <span>{profile.email}</span>
              </div>

              <div className="profile-row">
                <strong>Phone:</strong>
                <span>{profile.mobileNumber}</span>
              </div>

              <div className="profile-row">
                <strong>Department:</strong>
                <span>{profile.role}</span>
              </div>

              <div className="profile-row">
                <strong>Role:</strong>
                <span>Administrator</span>
              </div>

<div className="profile-buttons">

{!isEditing ? (

<button
className="add-btn"
onClick={() => setIsEditing(true)}
>
Edit Profile
</button>

) : (

<>
<button
className="add-btn"
onClick={handleSave}
>
Save
</button>

<button
className="delete-btn"
onClick={() => setIsEditing(false)}
>
Cancel
</button>
</>

)}

<button
className="action-btn edit"
onClick={() => setShowPassword(true)}
>
Change Password
</button>

</div>

            

          </div>
        </div>
            </div>
        </div>
    

      {showPassword && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h2>Change Password</h2>

            <input
              type="password"
              placeholder="Current Password"
              value={password.current}
              onChange={(e) =>
                setPassword({
                  ...password,
                  current: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="New Password"
              value={password.new}
              onChange={(e) =>
                setPassword({
                  ...password,
                  new: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={password.confirm}
              onChange={(e) =>
                setPassword({
                  ...password,
                  confirm: e.target.value,
                })
              }
            />

            <button
              className="add-btn"
              onClick={handlePassword}
            >
              Save
            </button>

            <button
              className="delete-btn"
              onClick={() => setShowPassword(false)}
            >
              Cancel
            </button>
          </div>
        </div>

      )}

    </div>
  );
}


export default Profile;

