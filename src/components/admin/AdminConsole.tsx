"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import styles from "./AdminConsole.module.css";

type SectionKey =
  | "dashboard"
  | "media"
  | "events"
  | "pricing"
  | "gallery"
  | "account"
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
type UploadBatchResponse = {
  items: Array<{
    id: string;
    url: string;
    storageKey: string;
    mimeType: string;
    sizeBytes: number;
    folderId?: string | null;
    tagIds: string[];
  }>;
  uploadedCount: number;
};

type MediaStats = {
  totalFiles: number;
  totalSizeBytes: number;
  totalSizeReadable: string;
};
type PreviewMode = "desktop" | "tablet" | "mobile";

type SectionMeta = {
  label: string;
  caption: string;
  previewPath: string;
  count: (ctx: {
    events: EventItem[];
    pricing: PricingItem[];
    galleryItems: GalleryItem[];
    siteSettings: SiteSetting[];
    mediaItems: MediaItem[];
  }) => number;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const SECTION_META: Record<SectionKey, SectionMeta> = {
  dashboard: {
    label: "Tổng quan",
    caption:
      "Bàn điều khiển nhanh để kiểm soát nội dung và xem trước trang chính.",
    previewPath: "/",
    count: () => 0,
  },
  media: {
    label: "Media Library",
    caption: "Upload, gắn tag/folder và chọn tài nguyên cho toàn bộ site.",
    previewPath: "/#gallery",
    count: ({ mediaItems }) => mediaItems.length,
  },
  events: {
    label: "Sự kiện",
    caption: "Tạo, chỉnh và preview các trang sự kiện nổi bật.",
    previewPath: "/#events",
    count: ({ events }) => events.length,
  },
  pricing: {
    label: "Bảng giá",
    caption:
      "Quản lý gói dịch vụ và nội dung báo giá hiển thị ngoài trang chủ.",
    previewPath: "/#BaoGiaDichVu",
    count: ({ pricing }) => pricing.length,
  },
  gallery: {
    label: "Gallery",
    caption:
      "Sắp xếp category và item gallery để điều khiển bộ sưu tập trang chủ.",
    previewPath: "/#gallery",
    count: ({ galleryItems }) => galleryItems.length,
  },
  account: {
    label: "Tài khoản",
    caption: "Quản lý tài khoản cá nhân như đổi mật khẩu.",
    previewPath: "/",
    count: () => 0,
  },
  settings: {
    label: "Site Settings",
    caption: "Chỉnh các khối nội dung động như hero, about, contact, footer.",
    previewPath: "/#contact",
    count: ({ siteSettings }) => siteSettings.length,
  },
};

const COMMON_SETTING_KEYS = [
  "navigation",
  "ctaButtons",
  "heroSlides",
  "topbar",
  "about",
  "contact",
  "footer",
];

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

export default function AdminConsole() {
  const [token, setToken] = useState("");
  const [section, setSection] = useState<SectionKey>("dashboard");
  const [previewPath, setPreviewPath] = useState("/");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [previewNonce, setPreviewNonce] = useState(0);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Admin@123");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Change password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePasswordMessage, setChangePasswordMessage] = useState("");
  const [changePasswordError, setChangePasswordError] = useState("");
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

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
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
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

  const folderMap = useMemo(
    () => Object.fromEntries(folders.map((item) => [item.id, item])),
    [folders],
  );
  const tagMap = useMemo(
    () => Object.fromEntries(tags.map((item) => [item.id, item])),
    [tags],
  );
  const mediaMap = useMemo(
    () => Object.fromEntries(mediaItems.map((item) => [item.id, item])),
    [mediaItems],
  );
  const categoryMap = useMemo(
    () => Object.fromEntries(galleryCategories.map((item) => [item.id, item])),
    [galleryCategories],
  );

  useEffect(() => {
    const storedToken =
      window.localStorage.getItem("meodecor-admin-token") || "";
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (selectedSettingKey || siteSettings.length === 0) {
      return;
    }
    setSelectedSettingKey(siteSettings[0].key);
    setSettingJson(formatJson(siteSettings[0].jsonValue));
  }, [selectedSettingKey, siteSettings]);

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

  const api = useCallback(
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
    },
    [token],
  );

  const loadAdminData = useCallback(
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
          api<{ items: MediaItem[] }>("/api/admin/media?page=1&pageSize=200"),
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
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  useEffect(() => {
    if (!token) {
      return;
    }
    void loadAdminData();
  }, [token, loadAdminData]);

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

  async function handleChangePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChangePasswordError("");
    setChangePasswordMessage("");

    if (newPassword !== confirmPassword) {
      setChangePasswordError("Mật khẩu mới không khớp");
      return;
    }

    if (newPassword.length < 6) {
      setChangePasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setChangePasswordLoading(true);
    try {
      await api(
        "/api/auth/change-password",
        {
          method: "POST",
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        },
        true,
      );
      setChangePasswordMessage("Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setChangePasswordError(getErrorMessage(err));
    } finally {
      setChangePasswordLoading(false);
    }
  }

  function showPreview(path: string) {
    setPreviewPath(path);
    setPreviewNonce((value) => value + 1);
  }

  function navigateSection(nextSection: SectionKey, nextPreviewPath?: string) {
    setSection(nextSection);
    showPreview(nextPreviewPath ?? SECTION_META[nextSection].previewPath);
  }

  async function uploadMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploadFiles.length === 0) {
      setError("Chọn file trước khi upload.");
      return;
    }
    const formData = new FormData();
    for (const file of uploadFiles) {
      formData.append("files", file);
    }
    if (uploadFiles.length === 1) {
      formData.append("file", uploadFiles[0]);
    }
    formData.append("module", mediaModule);
    if (uploadFolderId) {
      formData.append("folderId", uploadFolderId);
    }
    if (uploadTagIds.length > 0) {
      formData.append("tagIds", uploadTagIds.join(","));
    }
    try {
      const uploadResult = await api<UploadBatchResponse>(
        "/api/admin/media/upload",
        { method: "POST", body: formData },
      );
      setUploadFiles([]);
      setMessage(
        `Upload thành công ${uploadResult.uploadedCount} file vào thư viện.`,
      );
      await loadAdminData();
      showPreview(SECTION_META.media.previewPath);
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
    if (!window.confirm("Xóa mềm file này?")) return;
    try {
      await api(`/api/admin/media/${id}`, { method: "DELETE" });
      setMessage("Đã xóa mềm file.");
      await loadAdminData();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
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
        await api("/api/admin/events", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Đã tạo sự kiện mới.");
      }
      setEventForm(EMPTY_EVENT);
      await loadAdminData();
      showPreview("/#events");
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    }
  }

  async function deleteEvent(id: string) {
    if (!window.confirm("Xóa sự kiện này?")) return;
    try {
      await api(`/api/admin/events/${id}`, { method: "DELETE" });
      setMessage("Đã xóa sự kiện.");
      await loadAdminData();
      showPreview("/#events");
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
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
        await api("/api/admin/pricing", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Đã tạo gói giá mới.");
      }
      setPricingForm(EMPTY_PRICING);
      await loadAdminData();
      showPreview("/#BaoGiaDichVu");
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    }
  }

  async function deletePricing(id: string) {
    if (!window.confirm("Xóa gói giá này?")) return;
    try {
      await api(`/api/admin/pricing/${id}`, { method: "DELETE" });
      setMessage("Đã xóa gói giá.");
      await loadAdminData();
      showPreview("/#BaoGiaDichVu");
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
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
        await api("/api/admin/gallery/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Đã tạo danh mục gallery.");
      }
      setCategoryForm(EMPTY_CATEGORY);
      await loadAdminData();
      showPreview("/#gallery");
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
        await api("/api/admin/gallery/items", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Đã tạo item gallery.");
      }
      setGalleryItemForm(EMPTY_ITEM);
      await loadAdminData();
      showPreview("/#gallery");
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    }
  }

  async function deleteGalleryItem(id: string) {
    if (!window.confirm("Xóa item gallery này?")) return;
    try {
      await api(`/api/admin/gallery/items/${id}`, { method: "DELETE" });
      setMessage("Đã xóa item gallery.");
      await loadAdminData();
      showPreview("/#gallery");
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
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
      if (selectedSettingKey === "contact") showPreview("/#contact");
      else if (selectedSettingKey === "about") showPreview("/#about");
      else showPreview("/");
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    }
  }

  function chooseSetting(key: string) {
    setSelectedSettingKey(key);
    const item = siteSettings.find((setting) => setting.key === key);
    setSettingJson(formatJson(item?.jsonValue || "{}"));
  }

  function renderMessage() {
    if (error)
      return <div className={`${styles.message} ${styles.error}`}>{error}</div>;
    if (message) return <div className={styles.message}>{message}</div>;
    return null;
  }

  const currentMeta = SECTION_META[section];
  const selectedGalleryMedia = galleryItemForm.mediaFileId
    ? mediaMap[galleryItemForm.mediaFileId]
    : undefined;
  const previewClass =
    previewMode === "desktop"
      ? styles.previewDesktop
      : previewMode === "tablet"
        ? styles.previewTablet
        : styles.previewMobile;

  if (!token) {
    return (
      <div className={styles.page}>
        <div className={styles.loginWrap}>
          <div className={styles.loginSplash}>
            <div className={styles.eyebrow}>Control Center</div>
            <h1 className={styles.title}>MeoDecor Admin Console</h1>
            <p className={styles.subtitle}>
              Bản quản trị mới tập trung vào ba việc: chỉnh nội dung nhanh, thấy
              ngay section ngoài trang chính và thao tác media không bị lạc ngữ
              cảnh.
            </p>
            <div className={styles.loginList}>
              <div className={styles.loginBullet}>
                Preview trang chính ngay trong admin theo desktop, tablet hoặc
                mobile.
              </div>
              <div className={styles.loginBullet}>
                Điều hướng trực tiếp tới section ngoài site từ từng module nội
                dung.
              </div>
              <div className={styles.loginBullet}>
                Media library giữ nguyên folder/tag filter để dùng lại cho
                events, pricing và gallery.
              </div>
            </div>
          </div>
          <div className={styles.loginCard}>
            <div className={styles.eyebrow}>Sign In</div>
            <h2 className={styles.panelTitle}>Đăng nhập quản trị</h2>
            <p className={styles.panelText}>
              Sử dụng tài khoản admin để truy cập dashboard chỉnh nội dung.
            </p>
            <form className={styles.formGrid} onSubmit={handleLogin}>
              <input
                className={`${styles.input} ${styles.full}`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
              <input
                className={`${styles.input} ${styles.full}`}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <button
                className={`${styles.button} ${styles.full}`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "Vào bảng điều khiển"}
              </button>
            </form>
            {renderMessage()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <div className={styles.heroCard}>
            <div className={styles.eyebrow}>Live Admin Workspace</div>
            <h1 className={styles.title}>
              Điều khiển nội dung và nhìn thấy kết quả ngay trên trang chính
            </h1>
            <p className={styles.subtitle}>
              Admin mới ưu tiên workflow thực tế: chọn module, chỉnh dữ liệu,
              preview section tương ứng, rồi quay lại tinh chỉnh tiếp mà không
              phải đổi tab liên tục.
            </p>
            <div className={styles.heroActions}>
              <button
                className={styles.button}
                type="button"
                onClick={() => void loadAdminData()}
              >
                Làm mới toàn bộ dữ liệu
              </button>
              <button
                className={styles.buttonGhost}
                type="button"
                onClick={() =>
                  window.open(previewPath, "_blank", "noopener,noreferrer")
                }
              >
                Mở preview tab mới
              </button>
              <button
                className={styles.buttonDanger}
                type="button"
                onClick={logout}
              >
                Đăng xuất
              </button>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatLabel}>Section hiện tại</span>
                <strong className={styles.heroStatValue}>
                  {currentMeta.label}
                </strong>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatLabel}>Preview đang xem</span>
                <strong className={styles.heroStatValue}>{previewPath}</strong>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatLabel}>Media lọc được</span>
                <strong className={styles.heroStatValue}>
                  {filteredMedia.length}
                </strong>
              </div>
            </div>
          </div>
          <div className={styles.statusCard}>
            <div>
              <div className={styles.panelTitle}>Trạng thái điều khiển</div>
              <div className={styles.panelText}>
                Những con số cần nhìn đầu tiên khi thao tác site.
              </div>
            </div>
            <div className={styles.statusList}>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Tổng file</span>
                <strong className={styles.statusValue}>
                  {stats?.totalFiles ?? 0}
                </strong>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Tổng dung lượng</span>
                <strong className={styles.statusValue}>
                  {stats?.totalSizeReadable ?? "0 B"}
                </strong>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Sự kiện</span>
                <strong className={styles.statusValue}>{events.length}</strong>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Gói giá</span>
                <strong className={styles.statusValue}>{pricing.length}</strong>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Gallery items</span>
                <strong className={styles.statusValue}>
                  {galleryItems.length}
                </strong>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Settings động</span>
                <strong className={styles.statusValue}>
                  {siteSettings.length}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {renderMessage()}

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <section className={styles.sidebarCard}>
              <div className={styles.sidebarTitle}>Điều hướng module</div>
              <p className={styles.sidebarSubtle}>
                Chọn module cần sửa và nhảy ngay tới section tương ứng trên
                site.
              </p>
              <div className={styles.navList}>
                {(
                  Object.entries(SECTION_META) as [SectionKey, SectionMeta][]
                ).map(([key, meta]) => (
                  <button
                    key={key}
                    className={`${styles.navButton} ${section === key ? styles.navButtonActive : ""}`}
                    type="button"
                    onClick={() => navigateSection(key, meta.previewPath)}
                  >
                    <div>
                      <div className={styles.navLabel}>{meta.label}</div>
                      <div className={styles.navCaption}>{meta.caption}</div>
                    </div>
                    {key !== "dashboard" && (
                      <span className={styles.navCount}>
                        {meta.count({
                          events,
                          pricing,
                          galleryItems,
                          siteSettings,
                          mediaItems,
                        })}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.sidebarCard}>
              <div className={styles.sidebarTitle}>Bộ lọc media dùng chung</div>
              <p className={styles.sidebarSubtle}>
                Một bộ lọc để chọn tài nguyên nhất quán cho tất cả các form.
              </p>
              <div className={styles.filterBlock}>
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
                  className={styles.input}
                  value={mediaKeyword}
                  onChange={(e) => setMediaKeyword(e.target.value)}
                  placeholder="Tìm tên file hoặc storage key"
                />
              </div>
              <div className={styles.filterSummary}>
                {mediaFolderFilter && (
                  <span className={styles.metaPill}>
                    Folder:{" "}
                    {folderMap[mediaFolderFilter]?.name ?? mediaFolderFilter}
                  </span>
                )}
                {mediaTagFilter && (
                  <span className={styles.metaPill}>
                    Tag: {tagMap[mediaTagFilter]?.name ?? mediaTagFilter}
                  </span>
                )}
                <span className={styles.metaPill}>
                  {filteredMedia.length} file khớp
                </span>
              </div>
            </section>

            <section className={styles.sidebarCard}>
              <div className={styles.sidebarTitle}>Quick preview links</div>
              <div className={styles.linkList}>
                <button
                  className={`${styles.linkButton} ${styles.previewLink}`}
                  type="button"
                  onClick={() => showPreview("/")}
                >
                  Trang chủ <span>↗</span>
                </button>
                <button
                  className={`${styles.linkButton} ${styles.previewLink}`}
                  type="button"
                  onClick={() => showPreview("/#events")}
                >
                  Khối sự kiện <span>↗</span>
                </button>
                <button
                  className={`${styles.linkButton} ${styles.previewLink}`}
                  type="button"
                  onClick={() => showPreview("/#BaoGiaDichVu")}
                >
                  Khối bảng giá <span>↗</span>
                </button>
                <button
                  className={`${styles.linkButton} ${styles.previewLink}`}
                  type="button"
                  onClick={() => showPreview("/#gallery")}
                >
                  Khối gallery <span>↗</span>
                </button>
                <button
                  className={`${styles.linkButton} ${styles.previewLink}`}
                  type="button"
                  onClick={() => showPreview("/#contact")}
                >
                  Khối liên hệ <span>↗</span>
                </button>
              </div>
            </section>
          </aside>

          <main className={styles.main}>
            <section className={styles.sectionBar}>
              <div>
                <h2 className={styles.sectionHeading}>{currentMeta.label}</h2>
                <p className={styles.sectionDescription}>
                  {currentMeta.caption}
                </p>
              </div>
              <div className={styles.quickLinks}>
                <button
                  className={styles.buttonSecondary}
                  type="button"
                  onClick={() => showPreview(currentMeta.previewPath)}
                >
                  Preview section này
                </button>
                <button
                  className={styles.buttonGhost}
                  type="button"
                  onClick={() =>
                    window.open(
                      currentMeta.previewPath,
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                >
                  Mở tab mới
                </button>
              </div>
            </section>

            {section === "dashboard" && (
              <>
                <section className={styles.metricsGrid}>
                  <MetricCard
                    label="Tổng file"
                    value={String(stats?.totalFiles ?? 0)}
                    hint="Tài nguyên đang sẵn sàng cho toàn site"
                  />
                  <MetricCard
                    label="Tổng dung lượng"
                    value={stats?.totalSizeReadable ?? "0 B"}
                    hint="Giúp kiểm soát mức dùng storage"
                  />
                  <MetricCard
                    label="Sự kiện"
                    value={String(events.length)}
                    hint="Số landing sự kiện đang quản lý"
                  />
                  <MetricCard
                    label="Settings động"
                    value={String(siteSettings.length)}
                    hint="Các khối site có thể đổi ngay từ admin"
                  />
                </section>

                <section className={styles.quickGrid}>
                  <QuickCard
                    title="Hero và điều hướng"
                    text="Chỉnh site settings và xem ngay vùng đầu trang."
                    actionLabel="Mở settings"
                    onAction={() => navigateSection("settings", "/#hero")}
                  />
                  <QuickCard
                    title="Quản lý sự kiện"
                    text="Tạo nhanh event mới rồi preview landing của event đó."
                    actionLabel="Đi tới sự kiện"
                    onAction={() => navigateSection("events", "/#events")}
                  />
                  <QuickCard
                    title="Điều khiển gallery"
                    text="Sắp xếp concept hiển thị và nhảy tới section gallery ngoài site."
                    actionLabel="Đi tới gallery"
                    onAction={() => navigateSection("gallery", "/#gallery")}
                  />
                </section>

                <section className={styles.dashboardGrid}>
                  <div className={styles.stack}>
                    <section className={styles.panel}>
                      <div className={styles.panelHeader}>
                        <div>
                          <div className={styles.panelTitle}>
                            Command center
                          </div>
                          <div className={styles.panelText}>
                            Các thao tác điển hình khi cần chỉnh trang chủ thật
                            nhanh.
                          </div>
                        </div>
                      </div>
                      <div className={styles.quickLinks}>
                        <button
                          className={styles.button}
                          type="button"
                          onClick={() => navigateSection("media", "/#gallery")}
                        >
                          Upload ảnh mới
                        </button>
                        <button
                          className={styles.buttonSecondary}
                          type="button"
                          onClick={() =>
                            navigateSection("pricing", "/#BaoGiaDichVu")
                          }
                        >
                          Sửa bảng giá
                        </button>
                        <button
                          className={styles.buttonSecondary}
                          type="button"
                          onClick={() => navigateSection("events", "/#events")}
                        >
                          Sửa sự kiện
                        </button>
                        <button
                          className={styles.buttonGhost}
                          type="button"
                          onClick={() => chooseSetting("contact")}
                        >
                          Mở setting contact
                        </button>
                      </div>
                    </section>

                    <section className={styles.panel}>
                      <div className={styles.panelHeader}>
                        <div>
                          <div className={styles.panelTitle}>
                            Các key site settings phổ biến
                          </div>
                          <div className={styles.panelText}>
                            Chọn nhanh key rồi nhảy sang màn hình settings để
                            chỉnh.
                          </div>
                        </div>
                      </div>
                      <div className={styles.settingChips}>
                        {COMMON_SETTING_KEYS.map((key) => (
                          <button
                            key={key}
                            className={`${styles.settingChip} ${selectedSettingKey === key ? styles.settingChipActive : ""}`}
                            type="button"
                            onClick={() => {
                              chooseSetting(key);
                              navigateSection(
                                "settings",
                                key === "contact" ? "/#contact" : "/",
                              );
                            }}
                          >
                            {key}
                          </button>
                        ))}
                      </div>
                    </section>
                  </div>

                  <section className={styles.previewPanel}>
                    <div className={styles.panelHeader}>
                      <div>
                        <div className={styles.panelTitle}>Live preview</div>
                        <div className={styles.panelText}>
                          Xem ngay trang chính trong admin để xác nhận thay đổi
                          theo ngữ cảnh.
                        </div>
                      </div>
                      <div className={styles.previewMode}>
                        <button
                          className={`${styles.modeButton} ${previewMode === "desktop" ? styles.modeButtonActive : ""}`}
                          type="button"
                          onClick={() => setPreviewMode("desktop")}
                        >
                          Desktop
                        </button>
                        <button
                          className={`${styles.modeButton} ${previewMode === "tablet" ? styles.modeButtonActive : ""}`}
                          type="button"
                          onClick={() => setPreviewMode("tablet")}
                        >
                          Tablet
                        </button>
                        <button
                          className={`${styles.modeButton} ${previewMode === "mobile" ? styles.modeButtonActive : ""}`}
                          type="button"
                          onClick={() => setPreviewMode("mobile")}
                        >
                          Mobile
                        </button>
                      </div>
                    </div>
                    <div className={styles.previewActions}>
                      <span className={styles.metaPill}>
                        Đang xem: {previewPath}
                      </span>
                      <button
                        className={styles.smallButton}
                        type="button"
                        onClick={() => showPreview(previewPath)}
                      >
                        Reload preview
                      </button>
                    </div>
                    <div className={styles.previewStage}>
                      <div className={styles.previewFrameWrap}>
                        <iframe
                          key={`${previewPath}-${previewNonce}`}
                          title="Website preview"
                          src={previewPath}
                          className={`${styles.previewFrame} ${previewClass}`}
                        />
                      </div>
                    </div>
                  </section>
                </section>
              </>
            )}

            {section === "media" && (
              <>
                <section className={styles.duoGrid}>
                  <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                      <div>
                        <div className={styles.panelTitle}>Upload file mới</div>
                        <div className={styles.panelText}>
                          Chọn module, folder, tag rồi đưa file vào media
                          library.
                        </div>
                      </div>
                    </div>
                    <form className={styles.formGrid} onSubmit={uploadMedia}>
                      <input
                        className={`${styles.file} ${styles.full}`}
                        type="file"
                        multiple
                        onChange={(e) =>
                          setUploadFiles(Array.from(e.target.files ?? []))
                        }
                      />
                      <div className={`${styles.helper} ${styles.full}`}>
                        {uploadFiles.length > 0
                          ? `Đã chọn ${uploadFiles.length} file để upload.`
                          : "Có thể chọn 1 hoặc nhiều file trong một lần upload."}
                      </div>
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
                        className={`${styles.select} ${styles.full}`}
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
                        Upload và thêm vào thư viện
                      </button>
                    </form>
                  </section>
                  <section className={styles.stack}>
                    <section className={styles.panel}>
                      <div className={styles.panelHeader}>
                        <div>
                          <div className={styles.panelTitle}>Tạo folder</div>
                          <div className={styles.panelText}>
                            Phân loại file để các module chọn đúng tài nguyên.
                          </div>
                        </div>
                      </div>
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
                      <div className={styles.panelHeader}>
                        <div>
                          <div className={styles.panelTitle}>Tạo tag</div>
                          <div className={styles.panelText}>
                            Dùng tag để chọn file theo chiến dịch, concept, nhóm
                            nội dung.
                          </div>
                        </div>
                      </div>
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
                  </section>
                </section>

                <section className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div>
                      <div className={styles.panelTitle}>Media library</div>
                      <div className={styles.panelText}>
                        Các file đang sẵn sàng cho events, pricing, gallery và
                        site settings.
                      </div>
                    </div>
                    <div className={styles.badgeRow}>
                      <span className={styles.badge}>
                        {filteredMedia.length} file
                      </span>
                      <button
                        className={styles.buttonGhost}
                        type="button"
                        onClick={() => showPreview("/#gallery")}
                      >
                        Preview gallery
                      </button>
                    </div>
                  </div>
                  {filteredMedia.length === 0 ? (
                    <div className={styles.emptyState}>
                      Chưa có file nào khớp bộ lọc hiện tại.
                    </div>
                  ) : (
                    <div className={styles.mediaGrid}>
                      {filteredMedia.map((item) => (
                        <article key={item.id} className={styles.mediaCard}>
                          <Image
                            className={styles.mediaThumb}
                            src={item.url}
                            alt={item.originalName}
                            width={640}
                            height={480}
                            unoptimized
                          />
                          <div className={styles.mediaName}>
                            {item.originalName}
                          </div>
                          <div className={styles.mediaMeta}>
                            {item.module} · {Math.round(item.sizeBytes / 1024)}{" "}
                            KB
                          </div>
                          <div className={styles.tagRow}>
                            {item.folderId && (
                              <span
                                className={
                                  styles.badgeMuted + " " + styles.badge
                                }
                              >
                                {folderMap[item.folderId]?.name ?? "Folder"}
                              </span>
                            )}
                            {item.tagIds.slice(0, 2).map((tagId) => (
                              <span
                                key={tagId}
                                className={
                                  styles.badgeMuted + " " + styles.badge
                                }
                              >
                                {tagMap[tagId]?.name ?? tagId}
                              </span>
                            ))}
                          </div>
                          <div className={styles.mediaFooter}>
                            <span className={styles.helper}>
                              {item.isActive ? "Đang dùng" : "Ẩn"}
                            </span>
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
                  )}
                </section>
              </>
            )}

            {section === "events" && (
              <>
                <section className={styles.duoGrid}>
                  <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                      <div>
                        <div className={styles.panelTitle}>Form sự kiện</div>
                        <div className={styles.panelText}>
                          Sửa sự kiện và dùng cùng bộ lọc media ở cột trái để
                          chọn ảnh chuẩn.
                        </div>
                      </div>
                      <button
                        className={styles.buttonGhost}
                        type="button"
                        onClick={() => showPreview("/#events")}
                      >
                        Preview events
                      </button>
                    </div>
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
                      <div className={styles.full}>
                        <div className={styles.helper}>Ảnh chi tiết</div>
                        <div className={styles.checkboxList}>
                          {filteredMedia.map((item) => (
                            <label
                              key={item.id}
                              className={styles.checkboxItem}
                            >
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
                    <div className={styles.panelHeader}>
                      <div>
                        <div className={styles.panelTitle}>
                          Danh sách sự kiện
                        </div>
                        <div className={styles.panelText}>
                          Bấm sửa để nạp lại form hoặc mở preview theo từng
                          event.
                        </div>
                      </div>
                    </div>
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Tiêu đề</th>
                            <th>Slug</th>
                            <th>Preview</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {events.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <strong>{item.title}</strong>
                                <div className={styles.helper}>
                                  Thứ tự: {item.displayOrder}
                                </div>
                              </td>
                              <td>{item.slug}</td>
                              <td>
                                <button
                                  className={styles.buttonGhost}
                                  type="button"
                                  onClick={() =>
                                    showPreview(`/events/${item.slug}`)
                                  }
                                >
                                  Xem trang
                                </button>
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
                </section>
              </>
            )}

            {section === "pricing" && (
              <section className={styles.duoGrid}>
                <section className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div>
                      <div className={styles.panelTitle}>Form bảng giá</div>
                      <div className={styles.panelText}>
                        Tinh chỉnh gói giá rồi preview lại khối báo giá ngay.
                      </div>
                    </div>
                    <button
                      className={styles.buttonGhost}
                      type="button"
                      onClick={() => showPreview("/#BaoGiaDichVu")}
                    >
                      Preview pricing
                    </button>
                  </div>
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
                  <div className={styles.panelHeader}>
                    <div>
                      <div className={styles.panelTitle}>Danh sách gói giá</div>
                      <div className={styles.panelText}>
                        Chọn gói để sửa nhanh hoặc đối chiếu thứ tự hiển thị
                        ngoài trang chính.
                      </div>
                    </div>
                  </div>
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
                            <td>
                              <strong>{item.title}</strong>
                              <div className={styles.helper}>
                                {item.tagline}
                              </div>
                            </td>
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
              </section>
            )}

            {section === "gallery" && (
              <section className={styles.duoGrid}>
                <section className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div>
                      <div className={styles.panelTitle}>Category gallery</div>
                      <div className={styles.panelText}>
                        Code sẽ dùng làm anchor ngoài trang chủ nên cần dễ đọc
                        và ổn định.
                      </div>
                    </div>
                    <button
                      className={styles.buttonGhost}
                      type="button"
                      onClick={() => showPreview("/#gallery")}
                    >
                      Preview gallery
                    </button>
                  </div>
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
                        {categoryForm.id ? "Cập nhật category" : "Tạo category"}
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
                  <div className={styles.categoryCards}>
                    {galleryCategories.length === 0 ? (
                      <div className={styles.emptyState}>
                        Chưa có category gallery nào.
                      </div>
                    ) : (
                      galleryCategories.map((category) => (
                        <article
                          key={category.id}
                          className={styles.categoryCard}
                        >
                          <div className={styles.categoryTop}>
                            <div>
                              <div className={styles.categoryName}>
                                {category.name}
                              </div>
                              <div className={styles.categoryCode}>
                                #{category.code}
                              </div>
                            </div>
                            <span
                              className={`${styles.badge} ${category.isActive ? "" : styles.badgeMuted}`}
                            >
                              {category.isActive ? "Đang bật" : "Đang ẩn"}
                            </span>
                          </div>
                          <div className={styles.categoryMeta}>
                            <span className={styles.metaPill}>
                              Thứ tự: {category.displayOrder}
                            </span>
                            <span className={styles.metaPill}>
                              {
                                galleryItems.filter(
                                  (item) => item.categoryId === category.id,
                                ).length
                              }{" "}
                              item
                            </span>
                          </div>
                          <button
                            className={styles.buttonSecondary}
                            type="button"
                            onClick={() => setCategoryForm(category)}
                          >
                            Chỉnh category
                          </button>
                        </article>
                      ))
                    )}
                  </div>
                </section>
                <section className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div>
                      <div className={styles.panelTitle}>Gallery item</div>
                      <div className={styles.panelText}>
                        Chọn item theo category và chọn file ngay từ media
                        filter đang hoạt động.
                      </div>
                    </div>
                  </div>
                  <form className={styles.formGrid} onSubmit={saveGalleryItem}>
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
                    <div
                      className={`${styles.full} ${styles.galleryMediaPreview}`}
                    >
                      {selectedGalleryMedia ? (
                        <>
                          <Image
                            src={selectedGalleryMedia.url}
                            alt={selectedGalleryMedia.originalName}
                            width={160}
                            height={120}
                            className={styles.galleryMediaPreviewImage}
                            unoptimized
                          />
                          <div className={styles.galleryMediaPreviewMeta}>
                            <strong>{selectedGalleryMedia.originalName}</strong>
                            <span>{selectedGalleryMedia.url}</span>
                          </div>
                        </>
                      ) : (
                        <div className={styles.helper}>
                          Chọn file để xem trước ảnh nhỏ và URL tương ứng.
                        </div>
                      )}
                    </div>
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
                  <div className={styles.galleryItemCards}>
                    {galleryItems.length === 0 ? (
                      <div className={styles.emptyState}>
                        Chưa có gallery item nào.
                      </div>
                    ) : (
                      galleryItems.map((item) => {
                        const media = mediaMap[item.mediaFileId];
                        return (
                          <article
                            key={item.id}
                            className={styles.galleryItemCard}
                          >
                            <div className={styles.galleryItemMedia}>
                              {media ? (
                                <Image
                                  src={media.url}
                                  alt={media.originalName}
                                  width={112}
                                  height={84}
                                  className={styles.galleryItemThumb}
                                  unoptimized
                                />
                              ) : (
                                <div
                                  className={styles.galleryItemThumbPlaceholder}
                                >
                                  No image
                                </div>
                              )}
                            </div>
                            <div className={styles.galleryItemContent}>
                              <div className={styles.galleryItemTitleRow}>
                                <strong>
                                  {item.title ||
                                    media?.originalName ||
                                    "Gallery item"}
                                </strong>
                                <span
                                  className={`${styles.badge} ${item.isActive ? "" : styles.badgeMuted}`}
                                >
                                  {item.isActive ? "Đang bật" : "Đang ẩn"}
                                </span>
                              </div>
                              <div className={styles.galleryItemMeta}>
                                Category:{" "}
                                {categoryMap[item.categoryId]?.name ??
                                  item.categoryId}
                              </div>
                              <div className={styles.galleryItemUrl}>
                                {media?.url ?? item.mediaFileId}
                              </div>
                              <div className={styles.tagRow}>
                                <span className={styles.metaPill}>
                                  Order: {item.displayOrder}
                                </span>
                                {item.altText && (
                                  <span className={styles.metaPill}>
                                    Alt: {item.altText}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className={styles.galleryItemActions}>
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
                                onClick={() => void deleteGalleryItem(item.id)}
                              >
                                Xóa
                              </button>
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>
                </section>
              </section>
            )}

            {section === "account" && (
              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <div>
                    <div className={styles.panelTitle}>Quản lý tài khoản</div>
                    <div className={styles.panelText}>
                      Cập nhật thông tin cá nhân và bảo mật tài khoản của bạn.
                    </div>
                  </div>
                </div>
                <form
                  onSubmit={handleChangePassword}
                  className={styles.formGrid}
                >
                  <div style={{ marginBottom: "20px" }}>
                    <h3
                      style={{
                        marginBottom: "16px",
                        fontSize: "16px",
                        fontWeight: 600,
                      }}
                    >
                      Đổi mật khẩu
                    </h3>
                    {changePasswordMessage && (
                      <div
                        style={{
                          padding: "12px",
                          marginBottom: "12px",
                          backgroundColor: "#d4edda",
                          color: "#155724",
                          borderRadius: "4px",
                          fontSize: "14px",
                        }}
                      >
                        {changePasswordMessage}
                      </div>
                    )}
                    {changePasswordError && (
                      <div
                        style={{
                          padding: "12px",
                          marginBottom: "12px",
                          backgroundColor: "#f8d7da",
                          color: "#721c24",
                          borderRadius: "4px",
                          fontSize: "14px",
                        }}
                      >
                        {changePasswordError}
                      </div>
                    )}
                    <div style={{ marginBottom: "12px" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "6px",
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                      >
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        className={styles.input}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Nhập mật khẩu hiện tại"
                        required
                      />
                    </div>
                    <div style={{ marginBottom: "12px" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "6px",
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                      >
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        className={styles.input}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                        required
                      />
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "6px",
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                      >
                        Xác nhận mật khẩu
                      </label>
                      <input
                        type="password"
                        className={styles.input}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Xác nhận mật khẩu mới"
                        required
                      />
                    </div>
                    <button
                      className={styles.button}
                      type="submit"
                      disabled={changePasswordLoading}
                    >
                      {changePasswordLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {section === "settings" && (
              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <div>
                    <div className={styles.panelTitle}>Site settings</div>
                    <div className={styles.panelText}>
                      Ưu tiên các key thường tác động trực tiếp đến trang chủ.
                      Chọn key, sửa JSON, lưu và preview ngay.
                    </div>
                  </div>
                  <button
                    className={styles.buttonGhost}
                    type="button"
                    onClick={() =>
                      showPreview(
                        selectedSettingKey === "contact"
                          ? "/#contact"
                          : selectedSettingKey === "about"
                            ? "/#about"
                            : "/",
                      )
                    }
                  >
                    Preview key này
                  </button>
                </div>
                <div className={styles.settingGrid}>
                  <div className={styles.settingChips}>
                    {siteSettings.map((item) => (
                      <button
                        key={item.key}
                        className={`${styles.settingChip} ${selectedSettingKey === item.key ? styles.settingChipActive : ""}`}
                        type="button"
                        onClick={() => chooseSetting(item.key)}
                      >
                        {item.key}
                      </button>
                    ))}
                  </div>
                  <form className={styles.formGrid} onSubmit={saveSetting}>
                    <select
                      className={`${styles.select} ${styles.full}`}
                      value={selectedSettingKey}
                      onChange={(e) => chooseSetting(e.target.value)}
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
                        Khôi phục JSON hiện tại
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <article className={styles.metricCard}>
      <div className={styles.metricTop}>
        <span className={styles.metricLabel}>{label}</span>
        <span className={styles.badgeMuted + " " + styles.badge}>Live</span>
      </div>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricHint}>{hint}</div>
    </article>
  );
}

function QuickCard({
  title,
  text,
  actionLabel,
  onAction,
}: {
  title: string;
  text: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <article className={styles.quickCard}>
      <div className={styles.quickTitle}>{title}</div>
      <div className={styles.quickText}>{text}</div>
      <div>
        <button
          className={styles.buttonSecondary}
          type="button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      </div>
    </article>
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
  if (error instanceof Error) return error.message;
  return "Có lỗi xảy ra.";
}
