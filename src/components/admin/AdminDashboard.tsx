"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./AdminDashboard.module.css";
import ConfirmActionDialog from "../ui/confirm-action-dialog";

type SectionKey =
  | "dashboard"
  | "media"
  | "events"
  | "pricing"
  | "gallery"
  | "settings";

type MediaItem = {
  id: string;
  url: string;
  storageKey: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  folderId?: string | null;
  module: string;
  createdAt: string;
  isActive: boolean;
  tagIds: string[];
};

type Folder = {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
};

type Tag = { id: string; name: string; slug: string };

type EventItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverMediaId: string;
  imageMediaIds: string[];
  displayOrder: number;
  isActive: boolean;
};

type PricingItem = {
  id: string;
  code: string;
  title: string;
  price: number;
  currency: string;
  tagline?: string | null;
  imageMediaId: string;
  bullets: string[];
  displayOrder: number;
  isActive: boolean;
};

type GalleryCategory = {
  id: string;
  code: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
};

type GalleryItem = {
  id: string;
  categoryId: string;
  mediaFileId: string;
  title?: string | null;
  altText?: string | null;
  displayOrder: number;
  isActive: boolean;
};

type SiteSetting = {
  id: string;
  key: string;
  jsonValue: string;
  updatedAt: string;
};

type MediaStats = {
  totalFiles: number;
  totalSizeBytes: number;
  totalSizeReadable: string;
};

type ConfirmDialogState = {
  title: string;
  description: string;
  confirmLabel: string;
  action: () => Promise<void>;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const EMPTY_EVENT = {
  id: "",
  title: "",
  slug: "",
  description: "",
  coverMediaId: "",
  imageMediaIds: [] as string[],
  displayOrder: 1,
  isActive: true,
};

const EMPTY_PRICING = {
  id: "",
  code: "",
  title: "",
  price: 0,
  currency: "VND",
  tagline: "",
  imageMediaId: "",
  bulletsText: "",
  displayOrder: 1,
  isActive: true,
};

const EMPTY_CATEGORY = {
  id: "",
  code: "",
  name: "",
  displayOrder: 1,
  isActive: true,
};

const EMPTY_ITEM = {
  id: "",
  categoryId: "",
  mediaFileId: "",
  title: "",
  altText: "",
  displayOrder: 1,
  isActive: true,
};

export default function AdminDashboard() {
  const [token, setToken] = useState<string>("");
  const [section, setSection] = useState<SectionKey>("dashboard");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Admin@123");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState<MediaStats | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [pricing, setPricing] = useState<PricingItem[]>([]);
  const [galleryCategories, setGalleryCategories] = useState<GalleryCategory[]>(
    [],
  );
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);

  const [mediaFolderFilter, setMediaFolderFilter] = useState("");
  const [mediaTagFilter, setMediaTagFilter] = useState("");
  const [mediaKeyword, setMediaKeyword] = useState("");
  const [mediaModule, setMediaModule] = useState("general");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFolderId, setUploadFolderId] = useState("");
  const [uploadTagIds, setUploadTagIds] = useState<string[]>([]);
  const [folderName, setFolderName] = useState("");
  const [folderSlug, setFolderSlug] = useState("");
  const [tagName, setTagName] = useState("");
  const [tagSlug, setTagSlug] = useState("");

  const [eventForm, setEventForm] = useState(EMPTY_EVENT);
  const [pricingForm, setPricingForm] = useState(EMPTY_PRICING);
  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY);
  const [galleryItemForm, setGalleryItemForm] = useState(EMPTY_ITEM);
  const [selectedSettingKey, setSelectedSettingKey] = useState("");
  const [settingJson, setSettingJson] = useState("{}");
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(
    null,
  );
  const [confirmLoading, setConfirmLoading] = useState(false);

  function requestConfirmAction(config: ConfirmDialogState) {
    setConfirmDialog(config);
  }

  function handleConfirmOpenChange(open: boolean) {
    if (confirmLoading) {
      return;
    }

    if (!open) {
      setConfirmDialog(null);
    }
  }

  async function handleConfirmAction() {
    if (!confirmDialog) {
      return;
    }

    setConfirmLoading(true);
    try {
      await confirmDialog.action();
      setConfirmDialog(null);
    } finally {
      setConfirmLoading(false);
    }
  }

  useEffect(() => {
    const storedToken =
      window.localStorage.getItem("meodecor-admin-token") || "";
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    void loadAdminData();
  }, [token]);

  const filteredMedia = useMemo(() => {
    return mediaItems.filter((item) => {
      if (mediaFolderFilter && item.folderId !== mediaFolderFilter) {
        return false;
      }
      if (mediaTagFilter && !item.tagIds.includes(mediaTagFilter)) {
        return false;
      }
      if (mediaKeyword) {
        const keyword = mediaKeyword.toLowerCase();
        return (
          item.originalName.toLowerCase().includes(keyword) ||
          item.storageKey.toLowerCase().includes(keyword)
        );
      }
      return true;
    });
  }, [mediaItems, mediaFolderFilter, mediaTagFilter, mediaKeyword]);

  async function api<T>(
    path: string,
    init?: RequestInit,
    requireAuth = true,
  ): Promise<T> {
    const headers = new Headers(init?.headers || {});
    if (!(init?.body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (requireAuth && token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Request failed: ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  async function loadAdminData() {
    setLoading(true);
    setError("");

    try {
      const [
        statsData,
        mediaData,
        foldersData,
        tagsData,
        eventsData,
        pricingData,
        categoriesData,
        galleryItemsData,
        settingsData,
      ] = await Promise.all([
        api<MediaStats>("/api/admin/media/stats"),
        api<{ items: MediaItem[] }>(`/api/admin/media?page=1&pageSize=100`),
        api<Folder[]>("/api/admin/media/folders"),
        api<Tag[]>("/api/admin/media/tags"),
        api<EventItem[]>("/api/admin/events"),
        api<PricingItem[]>("/api/admin/pricing"),
        api<GalleryCategory[]>("/api/admin/gallery/categories"),
        api<GalleryItem[]>("/api/admin/gallery/items"),
        api<SiteSetting[]>("/api/admin/site-settings"),
      ]);

      setStats(statsData);
      setMediaItems(mediaData.items || []);
      setFolders(foldersData || []);
      setTags(tagsData || []);
      setEvents(eventsData || []);
      setPricing(pricingData || []);
      setGalleryCategories(categoriesData || []);
      setGalleryItems(galleryItemsData || []);
      setSiteSettings(settingsData || []);

      if (!selectedSettingKey && settingsData.length > 0) {
        setSelectedSettingKey(settingsData[0].key);
        setSettingJson(formatJson(settingsData[0].jsonValue));
      }
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await api<{ accessToken: string }>(
        "/api/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ username, password }),
        },
        false,
      );
      window.localStorage.setItem("meodecor-admin-token", result.accessToken);
      setToken(result.accessToken);
      setMessage("Đăng nhập thành công.");
    } catch (loginError) {
      setError(getErrorMessage(loginError));
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    window.localStorage.removeItem("meodecor-admin-token");
    setToken("");
    setMessage("Đã đăng xuất.");
  }

  async function uploadMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!uploadFile) {
      setError("Chọn file trước khi upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("module", mediaModule);
    if (uploadFolderId) {
      formData.append("folderId", uploadFolderId);
    }
    if (uploadTagIds.length > 0) {
      formData.append("tagIds", uploadTagIds.join(","));
    }

    try {
      await api("/api/admin/media/upload", { method: "POST", body: formData });
      setMessage("Upload file thành công.");
      setUploadFile(null);
      await loadAdminData();
    } catch (uploadError) {
      setError(getErrorMessage(uploadError));
    }
  }

  async function createFolder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await api("/api/admin/media/folders", {
        method: "POST",
        body: JSON.stringify({
          name: folderName,
          slug: folderSlug,
          parentId: null,
        }),
      });
      setFolderName("");
      setFolderSlug("");
      setMessage("Tạo folder thành công.");
      await loadAdminData();
    } catch (folderError) {
      setError(getErrorMessage(folderError));
    }
  }

  async function createTag(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await api("/api/admin/media/tags", {
        method: "POST",
        body: JSON.stringify({ name: tagName, slug: tagSlug }),
      });
      setTagName("");
      setTagSlug("");
      setMessage("Tạo tag thành công.");
      await loadAdminData();
    } catch (tagError) {
      setError(getErrorMessage(tagError));
    }
  }

  async function deleteMedia(id: string) {
    requestConfirmAction({
      title: "Xóa mềm file này?",
      description:
        "File sẽ bị ẩn khỏi thư viện media và các bộ chọn hiện tại sau khi xác nhận.",
      confirmLabel: "Xóa file",
      action: async () => {
        try {
          await api(`/api/admin/media/${id}`, { method: "DELETE" });
          setMessage("Đã xóa mềm file.");
          await loadAdminData();
        } catch (deleteError) {
          setError(getErrorMessage(deleteError));
        }
      },
    });
  }

  async function saveEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      title: eventForm.title,
      slug: eventForm.slug || null,
      description: eventForm.description,
      coverMediaId: eventForm.coverMediaId,
      imageMediaIds: eventForm.imageMediaIds,
      displayOrder: Number(eventForm.displayOrder),
      isActive: eventForm.isActive,
    };

    try {
      if (eventForm.id) {
        await api(`/api/admin/events/${eventForm.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setMessage("Đã cập nhật sự kiện.");
      } else {
        await api(`/api/admin/events`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Đã tạo sự kiện mới.");
      }
      setEventForm(EMPTY_EVENT);
      await loadAdminData();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    }
  }

  async function deleteEvent(id: string) {
    requestConfirmAction({
      title: "Xóa sự kiện này?",
      description:
        "Sự kiện sẽ bị gỡ khỏi danh sách hiển thị sau khi bạn xác nhận thao tác này.",
      confirmLabel: "Xóa sự kiện",
      action: async () => {
        try {
          await api(`/api/admin/events/${id}`, { method: "DELETE" });
          setMessage("Đã xóa sự kiện.");
          await loadAdminData();
        } catch (deleteError) {
          setError(getErrorMessage(deleteError));
        }
      },
    });
  }

  async function savePricing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      code: pricingForm.code,
      title: pricingForm.title,
      price: Number(pricingForm.price),
      currency: pricingForm.currency,
      tagline: pricingForm.tagline || null,
      imageMediaId: pricingForm.imageMediaId,
      bullets: pricingForm.bulletsText
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
      displayOrder: Number(pricingForm.displayOrder),
      isActive: pricingForm.isActive,
    };

    try {
      if (pricingForm.id) {
        await api(`/api/admin/pricing/${pricingForm.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setMessage("Đã cập nhật gói giá.");
      } else {
        await api(`/api/admin/pricing`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Đã tạo gói giá mới.");
      }
      setPricingForm(EMPTY_PRICING);
      await loadAdminData();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    }
  }

  async function deletePricing(id: string) {
    requestConfirmAction({
      title: "Xóa gói giá này?",
      description:
        "Gói giá sẽ bị gỡ khỏi bảng giá và không còn hiển thị cho khách truy cập.",
      confirmLabel: "Xóa gói giá",
      action: async () => {
        try {
          await api(`/api/admin/pricing/${id}`, { method: "DELETE" });
          setMessage("Đã xóa gói giá.");
          await loadAdminData();
        } catch (deleteError) {
          setError(getErrorMessage(deleteError));
        }
      },
    });
  }

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      code: categoryForm.code,
      name: categoryForm.name,
      displayOrder: Number(categoryForm.displayOrder),
      isActive: categoryForm.isActive,
    };

    try {
      if (categoryForm.id) {
        await api(`/api/admin/gallery/categories/${categoryForm.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setMessage("Đã cập nhật danh mục gallery.");
      } else {
        await api(`/api/admin/gallery/categories`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Đã tạo danh mục gallery.");
      }
      setCategoryForm(EMPTY_CATEGORY);
      await loadAdminData();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    }
  }

  async function saveGalleryItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      categoryId: galleryItemForm.categoryId,
      mediaFileId: galleryItemForm.mediaFileId,
      title: galleryItemForm.title || null,
      altText: galleryItemForm.altText || null,
      displayOrder: Number(galleryItemForm.displayOrder),
      isActive: galleryItemForm.isActive,
    };

    try {
      if (galleryItemForm.id) {
        await api(`/api/admin/gallery/items/${galleryItemForm.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setMessage("Đã cập nhật item gallery.");
      } else {
        await api(`/api/admin/gallery/items`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Đã tạo item gallery.");
      }
      setGalleryItemForm(EMPTY_ITEM);
      await loadAdminData();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    }
  }

  async function deleteGalleryItem(id: string) {
    requestConfirmAction({
      title: "Xóa item gallery này?",
      description:
        "Ảnh này sẽ bị gỡ khỏi gallery category hiện tại sau khi bạn xác nhận.",
      confirmLabel: "Xóa item",
      action: async () => {
        try {
          await api(`/api/admin/gallery/items/${id}`, { method: "DELETE" });
          setMessage("Đã xóa item gallery.");
          await loadAdminData();
        } catch (deleteError) {
          setError(getErrorMessage(deleteError));
        }
      },
    });
  }

  async function saveSetting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const parsed = JSON.parse(settingJson);
      await api(`/api/admin/site-settings/${selectedSettingKey}`, {
        method: "PUT",
        body: JSON.stringify({ value: parsed }),
      });
      setMessage(`Đã lưu site setting: ${selectedSettingKey}`);
      await loadAdminData();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    }
  }

  function renderMessage() {
    if (error) {
      return <div className={`${styles.message} ${styles.error}`}>{error}</div>;
    }
    if (message) {
      return <div className={styles.message}>{message}</div>;
    }
    return null;
  }

  if (!token) {
    return (
      <div className={styles.page}>
        <div className={styles.loginCard}>
          <h1 className={styles.title}>Admin MeoDecor</h1>
          <p className={styles.subtitle}>
            Đăng nhập để quản trị nội dung, media và site settings.
          </p>
          <form className={styles.formGrid} onSubmit={handleLogin}>
            <input
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button
              className={`${styles.button} ${styles.full}`}
              disabled={loading}
              type="submit"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
          return (
            <>
              <div className={styles.page}>
                <div className={styles.loginCard}>
                  <h1 className={styles.title}>Admin MeoDecor</h1>
                  <p className={styles.subtitle}>
                    Đăng nhập để quản trị nội dung, media và site settings.
                  </p>
                  <form className={styles.formGrid} onSubmit={handleLogin}>
                    <input
                      className={styles.input}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                    />
                    <input
                      className={styles.input}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                    />
                    <button
                      className={`${styles.button} ${styles.full}`}
                      disabled={loading}
                      type="submit"
                    >
                      {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                  </form>
                  {renderMessage()}
                </div>
              </div>
              <ConfirmActionDialog
                open={Boolean(confirmDialog)}
                onOpenChange={handleConfirmOpenChange}
                title={confirmDialog?.title ?? "Xác nhận thao tác"}
                description={confirmDialog?.description ?? ""}
                confirmLabel={confirmDialog?.confirmLabel ?? "Xóa"}
                loading={confirmLoading}
                onConfirm={handleConfirmAction}
              />
            </>
          );
            {[
              ["dashboard", "Tổng quan"],
              ["media", "Media Library"],
          <>
            <div className={styles.page}>
              <div className={styles.shell}>
                <div className={styles.header}>
              ["settings", "Site Settings"],
            ].map(([key, label]) => (
              <button
                key={key}
                className={`${styles.navButton} ${section === key ? styles.navButtonActive : ""}`}
                onClick={() => setSection(key as SectionKey)}
                type="button"
              >
                {label}
              </button>
            ))}

            <div
              className={styles.panel}
              style={{ padding: 0, marginTop: 18, boxShadow: "none" }}
            >
              <div className={styles.sectionTitle}>Bộ lọc media</div>
              <div className={styles.formGrid}>
                <select
                  className={styles.select}
                  value={mediaFolderFilter}
                  onChange={(e) => setMediaFolderFilter(e.target.value)}
                >
                  <option value="">Tất cả folder</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
                <select
                  className={styles.select}
                  value={mediaTagFilter}
                  onChange={(e) => setMediaTagFilter(e.target.value)}
                >
                  <option value="">Tất cả tag</option>
                  {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
                <input
                  className={`${styles.input} ${styles.full}`}
                  value={mediaKeyword}
                  onChange={(e) => setMediaKeyword(e.target.value)}
                  placeholder="Tìm theo tên file hoặc storage key"
                />
              </div>
              <p className={styles.helper}>
                Bộ lọc này áp dụng cho cả media library và các bộ chọn file
                trong events, pricing, gallery.
              </p>
            </div>
          </aside>

          <main className={styles.content}>
            {section === "dashboard" && (
              <>
                <div className={styles.grid3}>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Tổng file</div>
                    <div className={styles.statValue}>
                      {stats?.totalFiles ?? 0}
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Tổng dung lượng</div>
                    <div className={styles.statValue}>
                      {stats?.totalSizeReadable ?? "0 B"}
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Số cấu hình site</div>
                    <div className={styles.statValue}>
                      {siteSettings.length}
                    </div>
                  </div>
                </div>
                <div className={styles.grid3}>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Sự kiện</div>
                    <div className={styles.statValue}>{events.length}</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Gói giá</div>
                    <div className={styles.statValue}>{pricing.length}</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Gallery items</div>
                    <div className={styles.statValue}>
                      {galleryItems.length}
                    </div>
                  </div>
                </div>
              </>
            )}

            {section === "media" && (
              <>
                <section className={styles.panel}>
                  <div className={styles.sectionTitle}>Upload file</div>
                  <form className={styles.formGrid} onSubmit={uploadMedia}>
                    <input
                      className={styles.file}
                      type="file"
                      onChange={(e) =>
                        setUploadFile(e.target.files?.[0] ?? null)
                      }
                    />
                    <input
                      className={styles.input}
                      value={mediaModule}
                      onChange={(e) => setMediaModule(e.target.value)}
                      placeholder="Module, ví dụ: gallery"
                    />
                    <select
                      className={styles.select}
                      value={uploadFolderId}
                      onChange={(e) => setUploadFolderId(e.target.value)}
                    >
                      <option value="">Chọn folder</option>
                      {folders.map((folder) => (
                        <option key={folder.id} value={folder.id}>
                          {folder.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className={styles.select}
                      multiple
                      value={uploadTagIds}
                      onChange={(e) =>
                        setUploadTagIds(
                          Array.from(e.target.selectedOptions).map(
                            (x) => x.value,
                          ),
                        )
                      }
                    >
                      {tags.map((tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    </select>
                    <button
                      className={`${styles.button} ${styles.full}`}
                      type="submit"
                    >
                      Upload
                    </button>
                  </form>
                </section>

                <div className={styles.grid2}>
                  <section className={styles.panel}>
                    <div className={styles.sectionTitle}>Tạo folder</div>
                    <form className={styles.formGrid} onSubmit={createFolder}>
                      <input
                        className={styles.input}
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        placeholder="Tên folder"
                      />
                      <input
                        className={styles.input}
                        value={folderSlug}
                        onChange={(e) => setFolderSlug(e.target.value)}
                        placeholder="Slug folder"
                      />
                      <button
                        className={`${styles.buttonSecondary} ${styles.full}`}
                        type="submit"
                      >
                        Lưu folder
                      </button>
                    </form>
                  </section>
                  <section className={styles.panel}>
                    <div className={styles.sectionTitle}>Tạo tag</div>
                    <form className={styles.formGrid} onSubmit={createTag}>
                      <input
                        className={styles.input}
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                        placeholder="Tên tag"
                      />
                      <input
                        className={styles.input}
                        value={tagSlug}
                        onChange={(e) => setTagSlug(e.target.value)}
                        placeholder="Slug tag"
                      />
                      <button
                        className={`${styles.buttonSecondary} ${styles.full}`}
                        type="submit"
                      >
                        Lưu tag
                      </button>
                    </form>
                  </section>
                </div>

                <section className={styles.panel}>
                  <div className={styles.sectionTitle}>Media library</div>
                  <div className={styles.mediaGrid}>
                    {filteredMedia.map((item) => (
                      <article key={item.id} className={styles.mediaCard}>
                        <img
                          className={styles.mediaThumb}
                          src={item.url}
                          alt={item.originalName}
                        />
                        <div>
                          <strong>{item.originalName}</strong>
                        </div>
                        <div className={styles.helper}>{item.module}</div>
                        <div className={styles.helper}>
                          {Math.round(item.sizeBytes / 1024)} KB
                        </div>
                        <div className={styles.row} style={{ marginTop: 10 }}>
                          <button
                            className={styles.buttonDanger}
                            type="button"
                            onClick={() => void deleteMedia(item.id)}
                          >
                            Xóa mềm
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </>
            )}

            {section === "events" && (
              <>
                <section className={styles.panel}>
                  <div className={styles.sectionTitle}>Form sự kiện</div>
                  <form className={styles.formGrid} onSubmit={saveEvent}>
                    <input
                      className={styles.input}
                      value={eventForm.title}
                      onChange={(e) =>
                        setEventForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Tiêu đề"
                    />
                    <input
                      className={styles.input}
                      value={eventForm.slug}
                      onChange={(e) =>
                        setEventForm((prev) => ({
                          ...prev,
                          slug: e.target.value,
                        }))
                      }
                      placeholder="Slug"
                    />
                    <textarea
                      className={`${styles.textarea} ${styles.full}`}
                      value={eventForm.description}
                      onChange={(e) =>
                        setEventForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Mô tả"
                    />
                    <select
                      className={styles.select}
                      value={eventForm.coverMediaId}
                      onChange={(e) =>
                        setEventForm((prev) => ({
                          ...prev,
                          coverMediaId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Chọn ảnh cover</option>
                      {filteredMedia.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.originalName}
                        </option>
                      ))}
                    </select>
                    <input
                      className={styles.input}
                      type="number"
                      value={eventForm.displayOrder}
                      onChange={(e) =>
                        setEventForm((prev) => ({
                          ...prev,
                          displayOrder: Number(e.target.value),
                        }))
                      }
                      placeholder="Thứ tự"
                    />
                    <label className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={eventForm.isActive}
                        onChange={(e) =>
                          setEventForm((prev) => ({
                            ...prev,
                            isActive: e.target.checked,
                          }))
                        }
                      />
                      Kích hoạt
                    </label>
                    <div className={`${styles.full}`}>
                      <div className={styles.helper}>
                        Chọn ảnh chi tiết theo bộ lọc folder/tag hiện tại
                      </div>
                      <div className={styles.checkboxList}>
                        {filteredMedia.map((item) => (
                          <label key={item.id} className={styles.checkboxItem}>
                            <input
                              type="checkbox"
                              checked={eventForm.imageMediaIds.includes(
                                item.id,
                              )}
                              onChange={(e) =>
                                setEventForm((prev) => ({
                                  ...prev,
                                  imageMediaIds: e.target.checked
                                    ? [...prev.imageMediaIds, item.id]
                                    : prev.imageMediaIds.filter(
                                        (x) => x !== item.id,
                                      ),
                                }))
                              }
                            />
                            <span>{item.originalName}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className={`${styles.row} ${styles.full}`}>
                      <button className={styles.button} type="submit">
                        {eventForm.id ? "Cập nhật sự kiện" : "Tạo sự kiện"}
                      </button>
                      <button
                        className={styles.buttonSecondary}
                        type="button"
                        onClick={() => setEventForm(EMPTY_EVENT)}
                      >
                        Reset form
                      </button>
                    </div>
                  </form>
                </section>
                <section className={styles.panel}>
                  <div className={styles.sectionTitle}>Danh sách sự kiện</div>
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Tiêu đề</th>
                          <th>Slug</th>
                          <th>Thứ tự</th>
                          <th>Trạng thái</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((item) => (
                          <tr key={item.id}>
                            <td>{item.title}</td>
                            <td>{item.slug}</td>
                            <td>{item.displayOrder}</td>
                            <td>
                              <span className={styles.badge}>
                                {item.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td>
                              <div className={styles.row}>
                                <button
                                  className={styles.buttonSecondary}
                                  type="button"
                                  onClick={() => setEventForm(item)}
                                >
                                  Sửa
                                </button>
                                <button
                                  className={styles.buttonDanger}
                                  type="button"
                                  onClick={() => void deleteEvent(item.id)}
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}

            {section === "pricing" && (
              <>
                <section className={styles.panel}>
                  <div className={styles.sectionTitle}>Form bảng giá</div>
                  <form className={styles.formGrid} onSubmit={savePricing}>
                    <input
                      className={styles.input}
                      value={pricingForm.code}
                      onChange={(e) =>
                        setPricingForm((prev) => ({
                          ...prev,
                          code: e.target.value,
                        }))
                      }
                      placeholder="Code"
                    />
                    <input
                      className={styles.input}
                      value={pricingForm.title}
                      onChange={(e) =>
                        setPricingForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Tiêu đề gói"
                    />
                    <input
                      className={styles.input}
                      type="number"
                      value={pricingForm.price}
                      onChange={(e) =>
                        setPricingForm((prev) => ({
                          ...prev,
                          price: Number(e.target.value),
                        }))
                      }
                      placeholder="Giá"
                    />
                    <input
                      className={styles.input}
                      value={pricingForm.currency}
                      onChange={(e) =>
                        setPricingForm((prev) => ({
                          ...prev,
                          currency: e.target.value,
                        }))
                      }
                      placeholder="Đơn vị tiền tệ"
                    />
                    <input
                      className={`${styles.input} ${styles.full}`}
                      value={pricingForm.tagline}
                      onChange={(e) =>
                        setPricingForm((prev) => ({
                          ...prev,
                          tagline: e.target.value,
                        }))
                      }
                      placeholder="Tagline"
                    />
                    <select
                      className={styles.select}
                      value={pricingForm.imageMediaId}
                      onChange={(e) =>
                        setPricingForm((prev) => ({
                          ...prev,
                          imageMediaId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Chọn ảnh gói giá</option>
                      {filteredMedia.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.originalName}
                        </option>
                      ))}
                    </select>
                    <input
                      className={styles.input}
                      type="number"
                      value={pricingForm.displayOrder}
                      onChange={(e) =>
                        setPricingForm((prev) => ({
                          ...prev,
                          displayOrder: Number(e.target.value),
                        }))
                      }
                      placeholder="Thứ tự"
                    />
                    <textarea
                      className={`${styles.textarea} ${styles.full}`}
                      value={pricingForm.bulletsText}
                      onChange={(e) =>
                        setPricingForm((prev) => ({
                          ...prev,
                          bulletsText: e.target.value,
                        }))
                      }
                      placeholder="Mỗi dòng là một bullet"
                    />
                    <label className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={pricingForm.isActive}
                        onChange={(e) =>
                          setPricingForm((prev) => ({
                            ...prev,
                            isActive: e.target.checked,
                          }))
                        }
                      />
                      Kích hoạt
                    </label>
                    <div className={`${styles.row} ${styles.full}`}>
                      <button className={styles.button} type="submit">
                        {pricingForm.id ? "Cập nhật gói giá" : "Tạo gói giá"}
                      </button>
                      <button
                        className={styles.buttonSecondary}
                        type="button"
                        onClick={() => setPricingForm(EMPTY_PRICING)}
                      >
                        Reset form
                      </button>
                    </div>
                  </form>
                </section>
                <section className={styles.panel}>
                  <div className={styles.sectionTitle}>Danh sách gói giá</div>
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Tiêu đề</th>
                          <th>Giá</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {pricing.map((item) => (
                          <tr key={item.id}>
                            <td>{item.code}</td>
                            <td>{item.title}</td>
                            <td>
                              {item.price.toLocaleString("vi-VN")}{" "}
                              {item.currency}
                            </td>
                            <td>
                              <div className={styles.row}>
                                <button
                                  className={styles.buttonSecondary}
                                  type="button"
                                  onClick={() =>
                                    setPricingForm({
                                      id: item.id,
                                      code: item.code,
                                      title: item.title,
                                      price: item.price,
                                      currency: item.currency,
                                      tagline: item.tagline || "",
                                      imageMediaId: item.imageMediaId,
                                      bulletsText: item.bullets.join("\n"),
                                      displayOrder: item.displayOrder,
                                      isActive: item.isActive,
                                    })
                                  }
                                >
                                  Sửa
                                </button>
                                <button
                                  className={styles.buttonDanger}
                                  type="button"
                                  onClick={() => void deletePricing(item.id)}
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}

            {section === "gallery" && (
              <>
                <div className={styles.grid2}>
                  <section className={styles.panel}>
                    <div className={styles.sectionTitle}>Danh mục gallery</div>
                    <form className={styles.formGrid} onSubmit={saveCategory}>
                      <input
                        className={styles.input}
                        value={categoryForm.code}
                        onChange={(e) =>
                          setCategoryForm((prev) => ({
                            ...prev,
                            code: e.target.value,
                          }))
                        }
                        placeholder="Code / Anchor"
                      />
                      <input
                        className={styles.input}
                        value={categoryForm.name}
                        onChange={(e) =>
                          setCategoryForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Tên danh mục"
                      />
                      <input
                        className={styles.input}
                        type="number"
                        value={categoryForm.displayOrder}
                        onChange={(e) =>
                          setCategoryForm((prev) => ({
                            ...prev,
                            displayOrder: Number(e.target.value),
                          }))
                        }
                        placeholder="Thứ tự"
                      />
                      <label className={styles.checkboxItem}>
                        <input
                          type="checkbox"
                          checked={categoryForm.isActive}
                          onChange={(e) =>
                            setCategoryForm((prev) => ({
                              ...prev,
                              isActive: e.target.checked,
                            }))
                          }
                        />
                        Kích hoạt
                      </label>
                      <div className={`${styles.row} ${styles.full}`}>
                        <button className={styles.button} type="submit">
                          {categoryForm.id
                            ? "Cập nhật category"
                            : "Tạo category"}
                        </button>
                        <button
                          className={styles.buttonSecondary}
                          type="button"
                          onClick={() => setCategoryForm(EMPTY_CATEGORY)}
                        >
                          Reset form
                        </button>
                      </div>
                    </form>
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Tên</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {galleryCategories.map((category) => (
                            <tr key={category.id}>
                              <td>{category.code}</td>
                              <td>{category.name}</td>
                              <td>
                                <button
                                  className={styles.buttonSecondary}
                                  type="button"
                                  onClick={() => setCategoryForm(category)}
                                >
                                  Sửa
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                  <section className={styles.panel}>
                    <div className={styles.sectionTitle}>Item gallery</div>
                    <form
                      className={styles.formGrid}
                      onSubmit={saveGalleryItem}
                    >
                      <select
                        className={styles.select}
                        value={galleryItemForm.categoryId}
                        onChange={(e) =>
                          setGalleryItemForm((prev) => ({
                            ...prev,
                            categoryId: e.target.value,
                          }))
                        }
                      >
                        <option value="">Chọn category</option>
                        {galleryCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <select
                        className={styles.select}
                        value={galleryItemForm.mediaFileId}
                        onChange={(e) =>
                          setGalleryItemForm((prev) => ({
                            ...prev,
                            mediaFileId: e.target.value,
                          }))
                        }
                      >
                        <option value="">Chọn file</option>
                        {filteredMedia.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.originalName}
                          </option>
                        ))}
                      </select>
                      <input
                        className={styles.input}
                        value={galleryItemForm.title}
                        onChange={(e) =>
                          setGalleryItemForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Title"
                      />
                      <input
                        className={styles.input}
                        value={galleryItemForm.altText}
                        onChange={(e) =>
                          setGalleryItemForm((prev) => ({
                            ...prev,
                            altText: e.target.value,
                          }))
                        }
                        placeholder="Alt text"
                      />
                      <input
                        className={styles.input}
                        type="number"
                        value={galleryItemForm.displayOrder}
                        onChange={(e) =>
                          setGalleryItemForm((prev) => ({
                            ...prev,
                            displayOrder: Number(e.target.value),
                          }))
                        }
                        placeholder="Thứ tự"
                      />
                      <label className={styles.checkboxItem}>
                        <input
                          type="checkbox"
                          checked={galleryItemForm.isActive}
                          onChange={(e) =>
                            setGalleryItemForm((prev) => ({
                              ...prev,
                              isActive: e.target.checked,
                            }))
                          }
                        />
                        Kích hoạt
                      </label>
                      <div className={`${styles.row} ${styles.full}`}>
                        <button className={styles.button} type="submit">
                          {galleryItemForm.id ? "Cập nhật item" : "Tạo item"}
                        </button>
                        <button
                          className={styles.buttonSecondary}
                          type="button"
                          onClick={() => setGalleryItemForm(EMPTY_ITEM)}
                        >
                          Reset form
                        </button>
                      </div>
                    </form>
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Media</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {galleryItems.map((item) => (
                            <tr key={item.id}>
                              <td>
                                {galleryCategories.find(
                                  (x) => x.id === item.categoryId,
                                )?.name || item.categoryId}
                              </td>
                              <td>
                                {mediaItems.find(
                                  (x) => x.id === item.mediaFileId,
                                )?.originalName || item.mediaFileId}
                              </td>
                              <td>
                                <div className={styles.row}>
                                  <button
                                    className={styles.buttonSecondary}
                                    type="button"
                                    onClick={() =>
                                      setGalleryItemForm({
                                        id: item.id,
                                        categoryId: item.categoryId,
                                        mediaFileId: item.mediaFileId,
                                        title: item.title || "",
                                        altText: item.altText || "",
                                        displayOrder: item.displayOrder,
                                        isActive: item.isActive,
                                      })
                                    }
                                  >
                                    Sửa
                                  </button>
                                  <button
                                    className={styles.buttonDanger}
                                    type="button"
                                    onClick={() =>
                                      void deleteGalleryItem(item.id)
                                    }
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              </>
            )}

            {section === "settings" && (
              <section className={styles.panel}>
                <div className={styles.sectionTitle}>Site settings editor</div>
                <form className={styles.formGrid} onSubmit={saveSetting}>
                  <select
                    className={`${styles.select} ${styles.full}`}
                    value={selectedSettingKey}
                    onChange={(e) => {
                      const nextKey = e.target.value;
                      setSelectedSettingKey(nextKey);
                      const nextSetting = siteSettings.find(
                        (item) => item.key === nextKey,
                      );
                      setSettingJson(
                        formatJson(nextSetting?.jsonValue || "{}"),
                      );
                    }}
                  >
                    <option value="">Chọn key</option>
                    {siteSettings.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.key}
                      </option>
                    ))}
                  </select>
                  <textarea
                    className={`${styles.textarea} ${styles.full}`}
                    value={settingJson}
                    onChange={(e) => setSettingJson(e.target.value)}
                  />
                  <div className={`${styles.row} ${styles.full}`}>
                    <button className={styles.button} type="submit">
                      Lưu setting
                    </button>
                    <button
                      className={styles.buttonSecondary}
                      type="button"
                      onClick={() =>
                        setSettingJson(
                          formatJson(
                            siteSettings.find(
                              (x) => x.key === selectedSettingKey,
                            )?.jsonValue || "{}",
                          ),
                        )
                      }
                    >
                      Tải lại JSON
                    </button>
                  </div>
                </form>
                <p className={styles.helper}>
                  Dùng editor này để sửa các key như `navigation`, `ctaButtons`,
                  `heroSlides`, `about`, `contact`, `footer`.
                </p>
              </section>
            )}
          </main>
        </div>
      </div>
      <ConfirmActionDialog
        open={Boolean(confirmDialog)}
        onOpenChange={handleConfirmOpenChange}
        title={confirmDialog?.title ?? "Xác nhận thao tác"}
        description={confirmDialog?.description ?? ""}
        confirmLabel={confirmDialog?.confirmLabel ?? "Xóa"}
        loading={confirmLoading}
        onConfirm={handleConfirmAction}
      />
    </>
  );
}

function formatJson(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Có lỗi xảy ra.";
}
