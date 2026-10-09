import React, { useState, useEffect, useCallback } from "react";
import { FaSyncAlt, FaRocket, FaCheckCircle, FaTimes, FaShieldAlt } from "react-icons/fa";
import { APP_VERSION, BUILD_NUMBER } from "../config/version";
import "../styles/UpdateNotification.css";

function InAppUpdateManager() {
  const [showModal, setShowModal] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [successToast, setSuccessToast] = useState(null);
  const [upToDateToast, setUpToDateToast] = useState(false);

  // Check for updates against remote /version.json
  const checkForUpdates = useCallback(async (isManual = false) => {
    try {
      const response = await fetch(`/version.json?_t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache"
        }
      });

      if (!response.ok) {
        if (isManual) setUpToDateToast(true);
        return;
      }

      const remoteData = await response.json();
      const remoteBuild = Number(remoteData.build) || 0;
      const remoteVersion = String(remoteData.version || "").trim();

      // An update is considered available if remote build is higher or remote version differs from local
      const isNewerBuild = remoteBuild > BUILD_NUMBER;
      const isDifferentVersion = remoteVersion && remoteVersion !== APP_VERSION;

      // Also check if user dismissed this exact version previously in this session
      const dismissedVersion = sessionStorage.getItem("sankalp_dismissed_update");

      if (isNewerBuild || isDifferentVersion) {
        setUpdateData(remoteData);
        if (isManual || dismissedVersion !== remoteVersion) {
          setShowModal(true);
        }
      } else {
        if (isManual) {
          setUpToDateToast(true);
          setTimeout(() => setUpToDateToast(false), 3500);
        }
      }
    } catch (err) {
      console.warn("Update check failed:", err);
      if (isManual) {
        setUpToDateToast(true);
        setTimeout(() => setUpToDateToast(false), 3500);
      }
    }
  }, []);

  // Expose global updater function so any page/component can trigger manual check
  useEffect(() => {
    window.checkForAppUpdates = (isManual = true) => {
      checkForUpdates(isManual);
    };

    // Check if app just updated and show congratulatory pill
    const justUpdatedTo = sessionStorage.getItem("sankalp_updated_toast");
    if (justUpdatedTo) {
      sessionStorage.removeItem("sankalp_updated_toast");
      setSuccessToast(`🎉 App successfully updated to v${justUpdatedTo}!`);
      setTimeout(() => setSuccessToast(null), 4500);
    }

    // Initial check shortly after load
    const initialTimer = setTimeout(() => {
      checkForUpdates(false);
    }, 1500);

    // Periodic check every 10 minutes
    const interval = setInterval(() => {
      checkForUpdates(false);
    }, 10 * 60 * 1000);

    // Check when user switches back to the app
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkForUpdates(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      delete window.checkForAppUpdates;
    };
  }, [checkForUpdates]);

  const handleApplyUpdate = async () => {
    setIsUpdating(true);
    setProgressText("Clearing local caches & downloading updates...");

    try {
      // Clear CacheStorage
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      setProgressText("Synchronizing latest bundle...");
      await new Promise((res) => setTimeout(res, 800));

      const targetVersion = updateData?.version || APP_VERSION;
      sessionStorage.setItem("sankalp_updated_toast", targetVersion);
      localStorage.setItem("sankalp_client_version", targetVersion);

      setProgressText("Reloading app to activate new features...");
      await new Promise((res) => setTimeout(res, 400));

      // Force reload with cache-busting query parameter
      const cleanUrl = window.location.origin + window.location.pathname;
      window.location.href = `${cleanUrl}?app_update=${Date.now()}`;
    } catch (err) {
      console.error("Update reload error:", err);
      // Fallback reload
      window.location.reload(true);
    }
  };

  const handleDismiss = () => {
    if (updateData?.version) {
      sessionStorage.setItem("sankalp_dismissed_update", updateData.version);
    }
    setShowModal(false);
  };

  return (
    <>
      {/* Update Modal */}
      {showModal && (
        <div className="update-overlay" onClick={updateData?.forceUpdate ? undefined : handleDismiss}>
          <div className="update-modal" onClick={(e) => e.stopPropagation()}>
            <div className="update-header-banner">
              <span className="update-badge">
                <FaRocket /> Update Available
              </span>
              <h2 className="update-header-title">
                {updateData?.title || "New Update Available"}
              </h2>
              <p className="update-header-subtitle">
                {updateData?.description || "A newer, faster version of Sankalp IP HRMS is ready."}
              </p>
            </div>

            <div className="update-body">
              <div className="update-info-card">
                <div className="update-info-row">
                  <span className="update-info-label">Current Version:</span>
                  <span className="update-info-val">v{APP_VERSION} (Build {BUILD_NUMBER})</span>
                </div>
                <div className="update-info-row">
                  <span className="update-info-label">New Version:</span>
                  <span className="update-info-val" style={{ color: "#10b981" }}>
                    v{updateData?.version || "Latest"} (Build {updateData?.build || "Latest"})
                  </span>
                </div>
                {updateData?.releaseDate && (
                  <div className="update-info-row">
                    <span className="update-info-label">Release Date:</span>
                    <span className="update-info-val">{updateData.releaseDate}</span>
                  </div>
                )}
              </div>

              {updateData?.releaseNotes && updateData.releaseNotes.length > 0 && (
                <>
                  <div className="update-features-title">What's New in this update:</div>
                  <ul className="update-features-list">
                    {updateData.releaseNotes.map((note, idx) => (
                      <li key={idx} className="update-feature-item">
                        <span className="update-feature-bullet">✓</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {isUpdating ? (
                <div className="update-progress-container">
                  <div className="update-progress-bar-bg">
                    <div className="update-progress-bar-fill"></div>
                  </div>
                  <div className="update-status-text">{progressText}</div>
                </div>
              ) : (
                <div className="update-actions">
                  <button
                    type="button"
                    className="btn-update-now"
                    onClick={handleApplyUpdate}
                  >
                    <FaSyncAlt /> Update In-App Now
                  </button>
                  {!updateData?.forceUpdate && (
                    <button
                      type="button"
                      className="btn-update-later"
                      onClick={handleDismiss}
                    >
                      Later
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Up-to-date Toast (shown when user manually clicks Check for Updates and is current) */}
      {upToDateToast && (
        <div className="update-success-pill" style={{ background: "#065f46" }}>
          <FaCheckCircle style={{ color: "#34d399", fontSize: "18px" }} />
          <span>You're on the latest version (v{APP_VERSION}). Everything is up to date!</span>
        </div>
      )}

      {/* Post-update success toast */}
      {successToast && (
        <div className="update-success-pill">
          <FaCheckCircle style={{ color: "#10b981", fontSize: "18px" }} />
          <span>{successToast}</span>
        </div>
      )}
    </>
  );
}

export default InAppUpdateManager;
