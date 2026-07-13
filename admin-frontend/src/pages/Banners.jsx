import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import API from "../api/api";
import "../styles/theme.css";
import ImageCropper from "../components/ImageCropper";

const Banners = () => {
  const [banners, setBanners] = useState([]);
const [desktopPosition, setDesktopPosition] =
  useState("center");
  // ================= CREATE FORM =================
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [desktopImageFile, setDesktopImageFile] =
    useState(null);

  const [mobileImageFile, setMobileImageFile] =
    useState(null);

  const [desktopPreview, setDesktopPreview] =
    useState(null);

  const [mobilePreview, setMobilePreview] =
    useState(null);

  const [cropImage, setCropImage] = useState(null);

  const [cropType, setCropType] =
    useState("desktop");

  // ================= EDIT =================
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] =
    useState(false);

  const [loading, setLoading] = useState(false);

  // ================= LOAD BANNERS =================
  const loadBanners = async () => {
    try {
      const res = await API.get("/banners");
      setBanners(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  // ================= IMAGE SELECT =================
  const handleImageSelect = (e, type) => {
    const file = e.target.files[0];

    if (!file) return;

    setCropType(type);

    const reader = new FileReader();

    reader.onload = () =>
      setCropImage(reader.result);

    reader.readAsDataURL(file);

    e.target.value = "";
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);

      formData.append(
        "description",
        description
      );

      formData.append(
  "desktopPosition",
  desktopPosition
);

      if (desktopImageFile) {
        formData.append(
          "desktopImage",
          desktopImageFile
        );
      }

      if (mobileImageFile) {
        formData.append(
          "mobileImage",
          mobileImageFile
        );
      }

      if (editId) {
        await API.put(
          `/banners/${editId}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      } else {
        await API.post(
          "/banners",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      }

      resetForm();
      loadBanners();

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (banner) => {
    setTitle(banner.title || "");

    setDescription(
      banner.description || ""
    );

    setDesktopPreview(
      banner.desktopImage || null
    );

setDesktopPosition(
  banner.desktopPosition || "center"
);

    setMobilePreview(
      banner.mobileImage || null
    );

    setDesktopImageFile(null);

    setMobileImageFile(null);

    setEditId(banner._id);

    setShowModal(true);
  };

  // ================= DELETE =================
  const deleteBanner = async (id) => {
    try {
      await API.delete(`/banners/${id}`);
      loadBanners();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= RESET =================
  const resetForm = () => {
    setTitle("");
    setDescription("");

    setDesktopImageFile(null);
    setMobileImageFile(null);

    setDesktopPreview(null);
    setMobilePreview(null);
    setDesktopPosition("center");

    setCropImage(null);

    setEditId(null);

    setShowModal(false);
  };

  return (
    <>
      {/* ================= CROPPER ================= */}
      {cropImage && (
        <ImageCropper
          image={cropImage}
          defaultAspect={16 / 9}
          onClose={() => setCropImage(null)}
          onCropDone={(croppedFile) => {

            if (cropType === "desktop") {

              setDesktopImageFile(
                croppedFile
              );

              setDesktopPreview(
                URL.createObjectURL(
                  croppedFile
                )
              );

            } else {

              setMobileImageFile(
                croppedFile
              );

              setMobilePreview(
                URL.createObjectURL(
                  croppedFile
                )
              );
            }

            setCropImage(null);
          }}
        />
      )}

      <PageLayout title="Banners">

        {/* ================= ADD BANNER ================= */}
        <div
          className="card"
          style={{ marginBottom: 20 }}
        >
          <h3>Add Banner</h3>


            <div className="banner-form">

              <input
                className="input"
                placeholder="Banner Title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />

              <input
                className="input"
                placeholder="Banner Description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

              {/* DESKTOP */}
              <div className="banner-upload-box">
             

                <label>
                  Desktop Banner (16:9)
                </label>

                <label>Desktop Focus</label>

<select
  className="input"
  value={desktopPosition}
  onChange={(e) =>
    setDesktopPosition(e.target.value)
  }
>
  <option value="left">Left</option>
  <option value="center">Center</option>
  <option value="right">Right</option>
</select>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageSelect(
                      e,
                      "desktop"
                    )
                  }
                />

                {desktopPreview && (
                  <>
                    <div className="banner-preview desktop">
                      <img
                        src={desktopPreview}
                        alt=""
                      />
                    </div>

                    <button
                      className="danger-btn"
                      style={{
                        marginTop: 8,
                        display: "block",
                      }}
                      onClick={() => {
                        setDesktopPreview(null);
                        setDesktopImageFile(null);
                      }}
                    >
                      Remove Desktop Image
                    </button>
                  </>
                )}

              </div>

              {/* MOBILE */}
              <div className="banner-upload-box">

                <label>
                  Mobile Banner (9:16)
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageSelect(
                      e,
                      "mobile"
                    )
                  }
                />

                {mobilePreview && (
                  <>
                    <div className="banner-preview mobile">
                      <img
                        src={mobilePreview}
                        alt=""
                      />
                    </div>

                    <button
                      className="danger-btn"
                      style={{
                        marginTop: 8,
                        display: "block",
                      }}
                      onClick={() => {
                        setMobilePreview(null);
                        setMobileImageFile(null);
                      }}
                    >
                      Remove Mobile Image
                    </button>
                  </>
                )}

              </div>

            </div>

            <button
              className="btn add-btn"
              onClick={handleSubmit}
              disabled={loading}
              style={{ marginTop: 12 }}
            >
              {loading
                ? "Processing..."
                : "Add Banner"}
            </button>
          </div>

          {/* ================= TABLE ================= */}
          <div className="card">

            <h3>All Banners</h3>

            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {banners.map((b) => (
                  <tr key={b._id}>

                    <td>
                      <div
                        style={{
                          width: 160,
                          aspectRatio: "16/9",
                          overflow: "hidden",
                          borderRadius: 6,
                          background: "#111",
                        }}
                      >
                        <img
                          src={
                            b.desktopImage
                          }
                          alt={b.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit:
                              "cover",
                          }}
                        />
                      </div>
                    </td>

                    <td>{b.title}</td>

                    <td>
                      {b.description}
                    </td>

                    <td>
                      {b.isActive
                        ? "Active"
                        : "Disabled"}
                    </td>

                    <td>
                      <button
                        className="btn-small"
                        onClick={() =>
                          handleEdit(b)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="danger-btn"
                        onClick={() =>
                          deleteBanner(
                            b._id
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= EDIT MODAL ================= */}
          {showModal && (
            <div className="modal-overlay">

              <div className="modal">

                <h3>Edit Banner</h3>

                <div className="banner-form">

                  <input
                    className="input"
                    placeholder="Banner Title"
                    value={title}
                    onChange={(e) =>
                      setTitle(
                        e.target.value
                      )
                    }
                  />

                  <input
                    className="input"
                    placeholder="Banner Description"
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                  />

                  {/* DESKTOP */}
                  <label
                    style={{
                      color: "#aaa",
                      fontSize: 13,
                      marginBottom: 6,
                      display: "block",
                    }}
                  >
                    Desktop Banner
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageSelect(
                        e,
                        "desktop"
                      )
                    }
                  />

                  {desktopPreview && (
                    <img
                      src={
                        desktopPreview
                      }
                      alt=""
                      style={{
                        width: "100%",
                        maxWidth: 400,
                        marginTop: 10,
                        borderRadius: 8,
                      }}
                    />
                  )}

                  <br />
                  <br />

                  {/* MOBILE */}
                  <label
                    style={{
                      color: "#aaa",
                      fontSize: 13,
                      marginBottom: 6,
                      display: "block",
                    }}
                  >
                    Mobile Banner
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageSelect(
                        e,
                        "mobile"
                      )
                    }
                  />

                  {mobilePreview && (
                    <img
                      src={
                        mobilePreview
                      }
                      alt=""
                      style={{
                        width: 180,
                        marginTop: 10,
                        borderRadius: 8,
                      }}
                    />
                  )}

                </div>

                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    gap: 10,
                  }}
                >
                  <button
                    className="btn"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading
                      ? "Updating..."
                      : "Update Banner"}
                  </button>

                  <button
                    className="danger-btn"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                </div>

              </div>
            </div>
          )}

      </PageLayout>
    </>
  );
};

export default Banners;