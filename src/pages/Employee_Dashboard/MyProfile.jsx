import React, { useEffect, useState } from "react";
import {
  getEmployeeProfile,
  updateEmployeeProfile,
} from "../../api/employeeProfileApi";
import Header from "../../components/Header";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";
import "../../styles/Profile.css";

function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);

const [profile, setProfile] = useState({
  employeeId: "",
  name: "",
  designation: "",
  email: "",
  phone: "",
  department: "",
  joining: "",
  dob: "",
  gender: "",
  blood: "",
  address: "",
  emergency: "",
  image: "",
});

useEffect(() => {
  loadProfile();
}, []);

const loadProfile = async () => {
  try {
    const response = await getEmployeeProfile("EMP001");

    console.log("Backend Response:", response.data);

    setProfile((prev) => ({
      ...prev,
      ...response.data,
    }));
  } catch (error) {
    console.error(error);
  }
};



const handleSave = async () => {
  try {

    console.log(profile);
console.log(profile.employeeId);
    await updateEmployeeProfile(profile.employeeId, profile);

    alert("Profile Updated Successfully");

    setIsEditing(false);

    loadProfile();
  } catch (error) {
    console.error(error);
    alert("Failed to update profile");
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

  return (
    <div className="layout">
      <EmployeeSidebar activePage="My Profile" />

      <div className="main-content">
        <Header
          title="My Profile"
          profilePath="/employee/profile"
          notificationPath="/employee/notifications"
        />

        <div className="page-content">
          <h1 className="page-title">My Profile</h1>

          <div className="profile-card">

            {/* Profile Header */}
            <div className="profile-header">
              <img
                src={profile.image}
                alt="Profile"
                className="profile-image"
              />

              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                />
              )}

              <div>
                {isEditing ? (
                <input
                  value={profile.name || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      name: e.target.value,
                    })
                  }
                />
                ) : (
                  <h2>{profile.name}</h2>
                )}

                <p>{profile.designation}</p>
                <p>Employee ID : {profile.employeeId}</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="profile-details">

              <div className="profile-row">
                <strong>Email :</strong>
                {isEditing ? (
                      <input
                        value={profile.email || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            email: e.target.value,
                          })
                        }
                      />
                ) : (
                  <span>{profile.email}</span>
                )}
              </div>

              <div className="profile-row">
                <strong>Phone :</strong>
                {isEditing ? (
                <input
                  value={profile.phone || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      phone: e.target.value,
                    })
                  }
                />
                ) : (
                  <span>{profile.phone}</span>
                )}
              </div>

              <div className="profile-row">
                <strong>Department :</strong>
                {isEditing ? (
                      <input
                        value={profile.department || ""}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            department: e.target.value,
                          })
                        }
                      />
                ) : (
                  <span>{profile.department}</span>
                )}
              </div>

              <div className="profile-row">
                <strong>Date of Joining :</strong>
                <span>{profile.joining}</span>
              </div>

              <div className="profile-row">
                <strong>Date of Birth :</strong>
                {isEditing ? (
                  <input
                    value={profile.dob || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        dob: e.target.value,
                      })
                    }
                  />
                ) : (
                  <span>{profile.dob}</span>
                )}
              </div>

              <div className="profile-row">
                <strong>Gender :</strong>
                {isEditing ? (
                  <select
                    value={profile.gender || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        gender: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <span>{profile.gender}</span>
                )}
              </div>

              <div className="profile-row">
                <strong>Blood Group :</strong>
                {isEditing ? (
                <input
                  value={profile.blood || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      blood: e.target.value,
                    })
                  }
                />
                ) : (
                  <span>{profile.blood}</span>
                )}
              </div>

              <div className="profile-row">
                <strong>Address :</strong>
                {isEditing ? (
                  <input
                    value={profile.address || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        address: e.target.value,
                      })
                    }
                  />
                ) : (
                  <span>{profile.address}</span>
                )}
              </div>

              <div className="profile-row">
                <strong>Emergency Contact :</strong>
                {isEditing ? (
                  <input
                    value={profile.emergency || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        emergency: e.target.value,
                      })
                    }
                  />
                ) : (
                  <span>{profile.emergency}</span>
                )}
              </div>

            </div>

            {/* Buttons */}
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
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;