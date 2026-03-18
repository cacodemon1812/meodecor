"use client";

import Image from "next/image";
import {
  FormEvent,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
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
type MediaMenuKey = "upload" | "library";

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
const UI_STATE_KEY = "meodecor-admin-ui-state-v1";
const MEDIA_BATCH_SIZE = 120;
const MEDIA_PICKER_BATCH_SIZE = 100;

function filterMediaByKeyword(
  items: MediaItem[],
  keyword: string,
): MediaItem[] {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) {
    return items;
  }

  return items.filter(
    (item) =>
      item.originalName.toLowerCase().includes(normalizedKeyword) ||
      item.storageKey.toLowerCase().includes(normalizedKeyword),
  );
}

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
  const [mediaMenu, setMediaMenu] = useState<MediaMenuKey>("upload");
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
  const [mediaVisibleCount, setMediaVisibleCount] = useState(MEDIA_BATCH_SIZE);
  const [mediaModule, setMediaModule] = useState("general");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadFolderId, setUploadFolderId] = useState("");
  const [uploadTagIds, setUploadTagIds] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderSlug, setFolderSlug] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [tagName, setTagName] = useState("");
  const [tagSlug, setTagSlug] = useState("");
  const [creatingTag, setCreatingTag] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);

  const [eventCoverKeyword, setEventCoverKeyword] = useState("");
  const [eventCoverVisibleCount, setEventCoverVisibleCount] = useState(
    MEDIA_PICKER_BATCH_SIZE,
  );
  const [eventDetailKeyword, setEventDetailKeyword] = useState("");
  const [eventDetailVisibleCount, setEventDetailVisibleCount] = useState(
    MEDIA_PICKER_BATCH_SIZE,
  );
  const [pricingMediaKeyword, setPricingMediaKeyword] = useState("");
  const [pricingMediaVisibleCount, setPricingMediaVisibleCount] = useState(
    MEDIA_PICKER_BATCH_SIZE,
  );
  const [galleryMediaKeyword, setGalleryMediaKeyword] = useState("");
  const [galleryMediaVisibleCount, setGalleryMediaVisibleCount] = useState(
    MEDIA_PICKER_BATCH_SIZE,
  );
  const [galleryBulkCategoryId, setGalleryBulkCategoryId] = useState("");
  const [galleryBulkKeyword, setGalleryBulkKeyword] = useState("");
  const [galleryBulkVisibleCount, setGalleryBulkVisibleCount] = useState(
    MEDIA_PICKER_BATCH_SIZE,
  );
  const [galleryBulkMediaIds, setGalleryBulkMediaIds] = useState<string[]>([]);
  const [galleryBulkStartOrder, setGalleryBulkStartOrder] = useState(1);
  const [galleryBulkIsActive, setGalleryBulkIsActive] = useState(true);
  const [galleryBulkCreating, setGalleryBulkCreating] = useState(false);

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
  const galleryItemCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of galleryItems) {
      counts[item.categoryId] = (counts[item.categoryId] || 0) + 1;
    }
    return counts;
  }, [galleryItems]);
  const nextGalleryOrderByCategory = useMemo(() => {
    const nextOrder: Record<string, number> = {};
    for (const item of galleryItems) {
      const currentMax = nextOrder[item.categoryId] || 0;
      nextOrder[item.categoryId] = Math.max(currentMax, item.displayOrder);
    }
    for (const category of galleryCategories) {
      nextOrder[category.id] = (nextOrder[category.id] || 0) + 1;
    }
    return nextOrder;
  }, [galleryCategories, galleryItems]);

  const deferredMediaKeyword = useDeferredValue(mediaKeyword);
  const deferredEventCoverKeyword = useDeferredValue(eventCoverKeyword);
  const deferredEventDetailKeyword = useDeferredValue(eventDetailKeyword);
  const deferredPricingMediaKeyword = useDeferredValue(pricingMediaKeyword);
  const deferredGalleryMediaKeyword = useDeferredValue(galleryMediaKeyword);
  const deferredGalleryBulkKeyword = useDeferredValue(galleryBulkKeyword);

  useEffect(() => {
    const storedToken =
      window.localStorage.getItem("meodecor-admin-token") || "";
    if (storedToken) {
      setToken(storedToken);
    }

    const storedUiState = window.localStorage.getItem(UI_STATE_KEY);
    if (!storedUiState) {
      return;
    }

    try {
      const parsed = JSON.parse(storedUiState) as Partial<{
        section: SectionKey;
        previewMode: PreviewMode;
        mediaMenu: MediaMenuKey;
        mediaFolderFilter: string;
        mediaTagFilter: string;
        mediaKeyword: string;
      }>;

      if (parsed.section && parsed.section in SECTION_META) {
        setSection(parsed.section);
      }
      if (parsed.previewMode) {
        setPreviewMode(parsed.previewMode);
      }
      if (parsed.mediaMenu === "upload" || parsed.mediaMenu === "library") {
        setMediaMenu(parsed.mediaMenu);
      }
      if (typeof parsed.mediaFolderFilter === "string") {
        setMediaFolderFilter(parsed.mediaFolderFilter);
      }
      if (typeof parsed.mediaTagFilter === "string") {
        setMediaTagFilter(parsed.mediaTagFilter);
      }
      if (typeof parsed.mediaKeyword === "string") {
        setMediaKeyword(parsed.mediaKeyword);
      }
    } catch {
      window.localStorage.removeItem(UI_STATE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      UI_STATE_KEY,
      JSON.stringify({
        section,
        previewMode,
        mediaMenu,
        mediaFolderFilter,
        mediaTagFilter,
        mediaKeyword,
      }),
    );
  }, [
    section,
    previewMode,
    mediaMenu,
    mediaFolderFilter,
    mediaTagFilter,
    mediaKeyword,
  ]);

  useEffect(() => {
    if (selectedSettingKey || siteSettings.length === 0) {
      return;
    }
    setSelectedSettingKey(siteSettings[0].key);
    setSettingJson(formatJson(siteSettings[0].jsonValue));
  }, [selectedSettingKey, siteSettings]);

  const filteredMedia = useMemo(() => {
    const normalizedKeyword = deferredMediaKeyword.trim().toLowerCase();

    return mediaItems.filter((item) => {
      if (mediaFolderFilter && item.folderId !== mediaFolderFilter) {
        return false;
      }
      if (mediaTagFilter && !item.tagIds.includes(mediaTagFilter)) {
        return false;
      }
      if (normalizedKeyword) {
        return (
          item.originalName.toLowerCase().includes(normalizedKeyword) ||
          item.storageKey.toLowerCase().includes(normalizedKeyword)
        );
      }
      return true;
    });
  }, [mediaItems, mediaFolderFilter, mediaTagFilter, deferredMediaKeyword]);

  const visibleMedia = useMemo(
    () => filteredMedia.slice(0, mediaVisibleCount),
    [filteredMedia, mediaVisibleCount],
  );

  const hasMoreMedia = visibleMedia.length < filteredMedia.length;

  const eventCoverCandidates = useMemo(
    () => filterMediaByKeyword(mediaItems, deferredEventCoverKeyword),
    [mediaItems, deferredEventCoverKeyword],
  );
  const visibleEventCoverCandidates = useMemo(
    () => eventCoverCandidates.slice(0, eventCoverVisibleCount),
    [eventCoverCandidates, eventCoverVisibleCount],
  );
  const hasMoreEventCoverCandidates =
    visibleEventCoverCandidates.length < eventCoverCandidates.length;

  const eventDetailCandidates = useMemo(
    () => filterMediaByKeyword(mediaItems, deferredEventDetailKeyword),
    [mediaItems, deferredEventDetailKeyword],
  );
  const visibleEventDetailCandidates = useMemo(
    () => eventDetailCandidates.slice(0, eventDetailVisibleCount),
    [eventDetailCandidates, eventDetailVisibleCount],
  );
  const hasMoreEventDetailCandidates =
    visibleEventDetailCandidates.length < eventDetailCandidates.length;

  const pricingMediaCandidates = useMemo(
    () => filterMediaByKeyword(mediaItems, deferredPricingMediaKeyword),
    [mediaItems, deferredPricingMediaKeyword],
  );
  const visiblePricingMediaCandidates = useMemo(
    () => pricingMediaCandidates.slice(0, pricingMediaVisibleCount),
    [pricingMediaCandidates, pricingMediaVisibleCount],
  );
  const hasMorePricingMediaCandidates =
    visiblePricingMediaCandidates.length < pricingMediaCandidates.length;

  const galleryMediaCandidates = useMemo(
    () => filterMediaByKeyword(mediaItems, deferredGalleryMediaKeyword),
    [mediaItems, deferredGalleryMediaKeyword],
  );
  const visibleGalleryMediaCandidates = useMemo(
    () => galleryMediaCandidates.slice(0, galleryMediaVisibleCount),
    [galleryMediaCandidates, galleryMediaVisibleCount],
  );
  const hasMoreGalleryMediaCandidates =
    visibleGalleryMediaCandidates.length < galleryMediaCandidates.length;

  const galleryBulkCandidates = useMemo(
    () => filterMediaByKeyword(mediaItems, deferredGalleryBulkKeyword),
    [mediaItems, deferredGalleryBulkKeyword],
  );
  const visibleGalleryBulkCandidates = useMemo(
    () => galleryBulkCandidates.slice(0, galleryBulkVisibleCount),
    [galleryBulkCandidates, galleryBulkVisibleCount],
  );
  const hasMoreGalleryBulkCandidates =
    visibleGalleryBulkCandidates.length < galleryBulkCandidates.length;
  const galleryBulkExistingMediaSet = useMemo(
    () =>
      new Set(
        galleryItems
          .filter((item) => item.categoryId === galleryBulkCategoryId)
          .map((item) => item.mediaFileId),
      ),
    [galleryBulkCategoryId, galleryItems],
  );

  const selectedEventCoverMedia = eventForm.coverMediaId
    ? mediaMap[eventForm.coverMediaId]
    : undefined;
  const selectedPricingMedia = pricingForm.imageMediaId
    ? mediaMap[pricingForm.imageMediaId]
    : undefined;

  useEffect(() => {
    setMediaVisibleCount(MEDIA_BATCH_SIZE);
  }, [
    mediaFolderFilter,
    mediaTagFilter,
    deferredMediaKeyword,
    mediaItems.length,
  ]);

  useEffect(() => {
    setEventCoverVisibleCount(MEDIA_PICKER_BATCH_SIZE);
  }, [deferredEventCoverKeyword, mediaItems.length]);

  useEffect(() => {
    setEventDetailVisibleCount(MEDIA_PICKER_BATCH_SIZE);
  }, [deferredEventDetailKeyword, mediaItems.length]);

  useEffect(() => {
    setPricingMediaVisibleCount(MEDIA_PICKER_BATCH_SIZE);
  }, [deferredPricingMediaKeyword, mediaItems.length]);

  useEffect(() => {
    setGalleryMediaVisibleCount(MEDIA_PICKER_BATCH_SIZE);
  }, [deferredGalleryMediaKeyword, mediaItems.length]);

  useEffect(() => {
    setGalleryBulkVisibleCount(MEDIA_PICKER_BATCH_SIZE);
  }, [deferredGalleryBulkKeyword, mediaItems.length]);

  const resetMediaFilters = useCallback(() => {
    setMediaFolderFilter("");
    setMediaTagFilter("");
    setMediaKeyword("");
  }, []);

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

  function applyGalleryCategory(categoryId: string) {
    setGalleryItemForm((prev) => ({ ...prev, categoryId }));
    setGalleryBulkCategoryId(categoryId);
    setGalleryBulkStartOrder(nextGalleryOrderByCategory[categoryId] || 1);
  }

  async function uploadMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploadFiles.length === 0) {
      setError("Chọn file trước khi upload.");
      return;
    }
    setUploading(true);
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
    } finally {
      setUploading(false);
    }
  }

  async function createFolder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreatingFolder(true);
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
      setShowFolderModal(false);
      setMessage("Tạo folder thành công.");
      await loadAdminData();
    } catch (folderError) {
      setError(getErrorMessage(folderError));
    } finally {
      setCreatingFolder(false);
    }
  }

  async function createTag(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreatingTag(true);
    try {
      await api("/api/admin/media/tags", {
        method: "POST",
        body: JSON.stringify({ name: tagName, slug: tagSlug }),
      });
      setTagName("");
      setTagSlug("");
      setShowTagModal(false);
      setMessage("Tạo tag thành công.");
      await loadAdminData();
    } catch (tagError) {
      setError(getErrorMessage(tagError));
    } finally {
      setCreatingTag(false);
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

  async function createGalleryItemsBulk(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!galleryBulkCategoryId) {
      setError("Chọn category trước khi thêm nhanh gallery item.");
      return;
    }
    if (galleryBulkMediaIds.length === 0) {
      setError("Chọn ít nhất một ảnh để thêm vào category.");
      return;
    }

    setGalleryBulkCreating(true);
    try {
      const deduplicated = Array.from(new Set(galleryBulkMediaIds));
      const existingInCategory = new Set(
        galleryItems
          .filter((item) => item.categoryId === galleryBulkCategoryId)
          .map((item) => item.mediaFileId),
      );
      const mediaIdsToCreate = deduplicated.filter(
        (mediaId) => !existingInCategory.has(mediaId),
      );

      if (mediaIdsToCreate.length === 0) {
        setMessage("Các ảnh đã chọn đã tồn tại trong category này.");
        return;
      }

      let nextOrder = Number(galleryBulkStartOrder) || 1;
      for (const mediaId of mediaIdsToCreate) {
        const media = mediaMap[mediaId];
        await api("/api/admin/gallery/items", {
          method: "POST",
          body: JSON.stringify({
            categoryId: galleryBulkCategoryId,
            mediaFileId: mediaId,
            title: media?.originalName || null,
            altText: media?.originalName || null,
            displayOrder: nextOrder,
            isActive: galleryBulkIsActive,
          }),
        });
        nextOrder += 1;
      }

      const skippedCount = deduplicated.length - mediaIdsToCreate.length;
      setMessage(
        skippedCount > 0
          ? `Đã thêm ${mediaIdsToCreate.length} ảnh vào category. Bỏ qua ${skippedCount} ảnh đã có.`
          : `Đã thêm ${mediaIdsToCreate.length} ảnh vào category.`,
      );
      setGalleryBulkMediaIds([]);
      setGalleryBulkKeyword("");
      setGalleryBulkStartOrder(nextOrder);
      await loadAdminData();
      showPreview("/#gallery");
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setGalleryBulkCreating(false);
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
  const selectedGalleryBulkMedia = galleryBulkMediaIds
    .map((id) => mediaMap[id])
    .filter((item): item is MediaItem => Boolean(item))
    .slice(0, 3);
  const visibleGalleryItems = galleryItemForm.categoryId
    ? galleryItems.filter(
        (item) => item.categoryId === galleryItemForm.categoryId,
      )
    : galleryItems;
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
        {renderMessage()}

        <div className={styles.layout}>
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
                  className={styles.button}
                  type="button"
                  onClick={() => void loadAdminData()}
                >
                  Làm mới dữ liệu
                </button>
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
                <button
                  className={styles.buttonDanger}
                  type="button"
                  onClick={logout}
                >
                  Đăng xuất
                </button>
              </div>
            </section>

            <section className={styles.moduleMenuBar}>
              {(
                Object.entries(SECTION_META) as [SectionKey, SectionMeta][]
              ).map(([key, meta]) => (
                <button
                  key={key}
                  type="button"
                  className={`${styles.moduleMenuButton} ${section === key ? styles.moduleMenuButtonActive : ""}`}
                  onClick={() => navigateSection(key, meta.previewPath)}
                >
                  {meta.label}
                </button>
              ))}
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
                <section className={styles.subMenuBar}>
                  <button
                    type="button"
                    className={`${styles.subMenuButton} ${mediaMenu === "upload" ? styles.subMenuButtonActive : ""}`}
                    onClick={() => setMediaMenu("upload")}
                  >
                    Upload & phân loại
                  </button>
                  <button
                    type="button"
                    className={`${styles.subMenuButton} ${mediaMenu === "library" ? styles.subMenuButtonActive : ""}`}
                    onClick={() => setMediaMenu("library")}
                  >
                    Media library
                  </button>
                </section>

                {mediaMenu === "upload" && (
                  <section className={styles.settingGrid}>
                    <section className={styles.panel}>
                      <div className={styles.panelHeader}>
                        <div>
                          <div className={styles.panelTitle}>
                            Upload file mới
                          </div>
                          <div className={styles.panelText}>
                            Chọn đúng module, folder, tag để quản lý file theo
                            ngữ cảnh và tìm lại nhanh hơn.
                          </div>
                        </div>
                        <div className={styles.row}>
                          <button
                            className={styles.buttonSecondary}
                            type="button"
                            onClick={() => setShowFolderModal(true)}
                          >
                            + Tạo folder
                          </button>
                          <button
                            className={styles.buttonGhost}
                            type="button"
                            onClick={() => setShowTagModal(true)}
                          >
                            + Tạo tag
                          </button>
                        </div>
                      </div>
                      <div className={styles.uploadGuide}>
                        <div className={styles.uploadGuideTitle}>
                          Quy trình upload gợi ý
                        </div>
                        <ul className={styles.uploadGuideList}>
                          <li>
                            1) Chọn module (ví dụ: general, gallery, events).
                          </li>
                          <li>2) Chọn folder để gom nhóm theo chiến dịch.</li>
                          <li>
                            3) Gắn tag để lọc nhanh khi chọn ảnh cho form khác.
                          </li>
                          <li>
                            4) Upload 1 hoặc nhiều file trong cùng một lần.
                          </li>
                        </ul>
                      </div>
                      <form className={styles.formGrid} onSubmit={uploadMedia}>
                        <div className={`${styles.fieldBlock} ${styles.full}`}>
                          <label className={styles.fieldLabel}>
                            File upload
                          </label>
                          <input
                            className={`${styles.file} ${styles.full}`}
                            type="file"
                            multiple
                            onChange={(e) =>
                              setUploadFiles(Array.from(e.target.files ?? []))
                            }
                          />
                          <div className={styles.helper}>
                            Hỗ trợ chọn nhiều file cùng lúc. Định dạng và dung
                            lượng tuân theo cấu hình backend.
                          </div>
                        </div>
                        <div className={`${styles.helper} ${styles.full}`}>
                          {uploadFiles.length > 0
                            ? `Đã chọn ${uploadFiles.length} file để upload.`
                            : "Có thể chọn 1 hoặc nhiều file trong một lần upload."}
                        </div>
                        <div className={styles.fieldBlock}>
                          <label className={styles.fieldLabel}>Module</label>
                          <input
                            className={styles.input}
                            value={mediaModule}
                            onChange={(e) => setMediaModule(e.target.value)}
                            placeholder="Ví dụ: general, gallery, events"
                          />
                          <div className={styles.helper}>
                            Module giúp backend lưu file đúng thư mục nghiệp vụ.
                          </div>
                        </div>
                        <div className={styles.fieldBlock}>
                          <label className={styles.fieldLabel}>Folder</label>
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
                          <div className={styles.helper}>
                            Folder giúp nhóm media theo từng chiến dịch hoặc chủ
                            đề.
                          </div>
                        </div>
                        <div className={`${styles.fieldBlock} ${styles.full}`}>
                          <label className={styles.fieldLabel}>
                            Tag (đa chọn)
                          </label>
                          <div className={styles.tagPickerGrid}>
                            {tags.length === 0 ? (
                              <span className={styles.helper}>
                                Chưa có tag.
                              </span>
                            ) : (
                              tags.map((tag) => (
                                <label
                                  key={tag.id}
                                  className={styles.tagPickerItem}
                                >
                                  <input
                                    type="checkbox"
                                    checked={uploadTagIds.includes(tag.id)}
                                    onChange={(e) =>
                                      setUploadTagIds((prev) =>
                                        e.target.checked
                                          ? [...prev, tag.id]
                                          : prev.filter((id) => id !== tag.id),
                                      )
                                    }
                                  />
                                  <span>{tag.name}</span>
                                </label>
                              ))
                            )}
                          </div>
                          <div className={styles.helper}>
                            Chọn trực tiếp nhiều tag để gắn vào toàn bộ file
                            trong lần upload này.
                          </div>
                        </div>
                        {uploadTagIds.length > 0 && (
                          <div className={`${styles.tagRow} ${styles.full}`}>
                            {uploadTagIds.map((tagId) => (
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
                        )}
                        <button
                          className={`${styles.button} ${styles.full}`}
                          type="submit"
                          disabled={uploading}
                        >
                          {uploading
                            ? "Đang upload..."
                            : "Upload và thêm vào thư viện"}
                        </button>
                      </form>
                    </section>
                  </section>
                )}

                {mediaMenu === "library" && (
                  <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                      <div>
                        <div className={styles.panelTitle}>Media library</div>
                        <div className={styles.panelText}>
                          Danh sách media được tách riêng theo menu để duyệt
                          nhanh, không bị rối khi upload.
                        </div>
                      </div>
                      <div className={styles.badgeRow}>
                        <span className={styles.badge}>
                          {visibleMedia.length}/{filteredMedia.length} file
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
                      <button
                        className={styles.buttonGhost}
                        type="button"
                        onClick={resetMediaFilters}
                      >
                        Xóa bộ lọc
                      </button>
                    </div>
                    <div className={styles.filterSummary}>
                      {mediaFolderFilter && (
                        <span className={styles.metaPill}>
                          Folder:{" "}
                          {folderMap[mediaFolderFilter]?.name ??
                            mediaFolderFilter}
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
                    {filteredMedia.length === 0 ? (
                      <div className={styles.emptyState}>
                        Chưa có file nào khớp bộ lọc hiện tại.
                      </div>
                    ) : (
                      <>
                        <div className={styles.mediaGrid}>
                          {visibleMedia.map((item) => (
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
                                {item.module} ·{" "}
                                {Math.round(item.sizeBytes / 1024)}
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
                        {hasMoreMedia && (
                          <div className={styles.loadMoreWrap}>
                            <button
                              className={styles.buttonSecondary}
                              type="button"
                              onClick={() =>
                                setMediaVisibleCount(
                                  (prev) => prev + MEDIA_BATCH_SIZE,
                                )
                              }
                            >
                              Xem thêm{" "}
                              {Math.min(
                                MEDIA_BATCH_SIZE,
                                filteredMedia.length - visibleMedia.length,
                              )}{" "}
                              file
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </section>
                )}

                {showFolderModal && (
                  <div
                    className={styles.modalOverlay}
                    role="presentation"
                    onClick={() => !creatingFolder && setShowFolderModal(false)}
                  >
                    <section
                      className={styles.modalCard}
                      role="dialog"
                      aria-modal="true"
                      aria-label="Tạo folder"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles.panelHeader}>
                        <div>
                          <div className={styles.panelTitle}>
                            Tạo folder mới
                          </div>
                          <div className={styles.panelText}>
                            Folder giúp tổ chức media theo nhóm nghiệp vụ để dễ
                            quản lý lâu dài.
                          </div>
                        </div>
                        <button
                          className={styles.buttonGhost}
                          type="button"
                          onClick={() => setShowFolderModal(false)}
                          disabled={creatingFolder}
                        >
                          Đóng
                        </button>
                      </div>
                      <form className={styles.formGrid} onSubmit={createFolder}>
                        <div className={styles.fieldBlock}>
                          <label className={styles.fieldLabel}>
                            Tên folder
                          </label>
                          <input
                            className={styles.input}
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="Ví dụ: sinh-nhat-be-trai"
                            required
                          />
                        </div>
                        <div className={styles.fieldBlock}>
                          <label className={styles.fieldLabel}>Slug</label>
                          <input
                            className={styles.input}
                            value={folderSlug}
                            onChange={(e) => setFolderSlug(e.target.value)}
                            placeholder="Ví dụ: sinh-nhat-be-trai"
                            required
                          />
                        </div>
                        <div className={`${styles.row} ${styles.full}`}>
                          <button
                            className={styles.buttonSecondary}
                            type="button"
                            onClick={() => setShowFolderModal(false)}
                            disabled={creatingFolder}
                          >
                            Hủy
                          </button>
                          <button
                            className={styles.button}
                            type="submit"
                            disabled={creatingFolder}
                          >
                            {creatingFolder ? "Đang lưu..." : "Lưu folder"}
                          </button>
                        </div>
                      </form>
                    </section>
                  </div>
                )}

                {showTagModal && (
                  <div
                    className={styles.modalOverlay}
                    role="presentation"
                    onClick={() => !creatingTag && setShowTagModal(false)}
                  >
                    <section
                      className={styles.modalCard}
                      role="dialog"
                      aria-modal="true"
                      aria-label="Tạo tag"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles.panelHeader}>
                        <div>
                          <div className={styles.panelTitle}>Tạo tag mới</div>
                          <div className={styles.panelText}>
                            Tag giúp lọc nhanh media theo concept, campaign, sản
                            phẩm.
                          </div>
                        </div>
                        <button
                          className={styles.buttonGhost}
                          type="button"
                          onClick={() => setShowTagModal(false)}
                          disabled={creatingTag}
                        >
                          Đóng
                        </button>
                      </div>
                      <form className={styles.formGrid} onSubmit={createTag}>
                        <div className={styles.fieldBlock}>
                          <label className={styles.fieldLabel}>Tên tag</label>
                          <input
                            className={styles.input}
                            value={tagName}
                            onChange={(e) => setTagName(e.target.value)}
                            placeholder="Ví dụ: premium"
                            required
                          />
                        </div>
                        <div className={styles.fieldBlock}>
                          <label className={styles.fieldLabel}>Slug</label>
                          <input
                            className={styles.input}
                            value={tagSlug}
                            onChange={(e) => setTagSlug(e.target.value)}
                            placeholder="Ví dụ: premium"
                            required
                          />
                        </div>
                        <div className={`${styles.row} ${styles.full}`}>
                          <button
                            className={styles.buttonSecondary}
                            type="button"
                            onClick={() => setShowTagModal(false)}
                            disabled={creatingTag}
                          >
                            Hủy
                          </button>
                          <button
                            className={styles.button}
                            type="submit"
                            disabled={creatingTag}
                          >
                            {creatingTag ? "Đang lưu..." : "Lưu tag"}
                          </button>
                        </div>
                      </form>
                    </section>
                  </div>
                )}
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
                      <div className={`${styles.full} ${styles.fieldBlock}`}>
                        <label className={styles.fieldLabel}>Ảnh cover</label>
                        <input
                          className={styles.input}
                          value={eventCoverKeyword}
                          onChange={(e) => setEventCoverKeyword(e.target.value)}
                          placeholder="Tìm tên ảnh cover"
                        />
                        <div className={styles.mediaNamePicker}>
                          {visibleEventCoverCandidates.map((item) => {
                            const isSelected =
                              eventForm.coverMediaId === item.id;
                            return (
                              <label
                                key={item.id}
                                className={`${styles.mediaNameItem} ${isSelected ? styles.mediaNameItemActive : ""}`}
                              >
                                <input
                                  type="radio"
                                  name="event-cover-media"
                                  checked={isSelected}
                                  onChange={() =>
                                    setEventForm((prev) => ({
                                      ...prev,
                                      coverMediaId: item.id,
                                    }))
                                  }
                                />
                                <span>{item.originalName}</span>
                              </label>
                            );
                          })}
                        </div>
                        {hasMoreEventCoverCandidates && (
                          <div className={styles.loadMoreWrap}>
                            <button
                              className={styles.buttonSecondary}
                              type="button"
                              onClick={() =>
                                setEventCoverVisibleCount(
                                  (prev) => prev + MEDIA_PICKER_BATCH_SIZE,
                                )
                              }
                            >
                              Xem thêm tên ảnh
                            </button>
                          </div>
                        )}
                        {selectedEventCoverMedia && (
                          <div className={styles.mediaPreviewCard}>
                            <Image
                              src={selectedEventCoverMedia.url}
                              alt={selectedEventCoverMedia.originalName}
                              width={96}
                              height={72}
                              className={styles.mediaPreviewThumb}
                              unoptimized
                            />
                          </div>
                        )}
                      </div>
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
                        <input
                          className={styles.input}
                          value={eventDetailKeyword}
                          onChange={(e) =>
                            setEventDetailKeyword(e.target.value)
                          }
                          placeholder="Tìm tên ảnh chi tiết"
                        />
                        <div className={styles.checkboxList}>
                          {visibleEventDetailCandidates.map((item) => (
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
                        {hasMoreEventDetailCandidates && (
                          <div className={styles.loadMoreWrap}>
                            <button
                              className={styles.buttonSecondary}
                              type="button"
                              onClick={() =>
                                setEventDetailVisibleCount(
                                  (prev) => prev + MEDIA_PICKER_BATCH_SIZE,
                                )
                              }
                            >
                              Xem thêm tên ảnh
                            </button>
                          </div>
                        )}
                        {eventForm.imageMediaIds.length > 0 && (
                          <div className={styles.selectionSummary}>
                            Đã chọn {eventForm.imageMediaIds.length} ảnh chi
                            tiết.
                          </div>
                        )}
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
                    <div className={`${styles.full} ${styles.fieldBlock}`}>
                      <label className={styles.fieldLabel}>Ảnh gói giá</label>
                      <input
                        className={styles.input}
                        value={pricingMediaKeyword}
                        onChange={(e) => setPricingMediaKeyword(e.target.value)}
                        placeholder="Tìm tên ảnh gói giá"
                      />
                      <div className={styles.mediaNamePicker}>
                        {visiblePricingMediaCandidates.map((item) => {
                          const isSelected =
                            pricingForm.imageMediaId === item.id;
                          return (
                            <label
                              key={item.id}
                              className={`${styles.mediaNameItem} ${isSelected ? styles.mediaNameItemActive : ""}`}
                            >
                              <input
                                type="radio"
                                name="pricing-media"
                                checked={isSelected}
                                onChange={() =>
                                  setPricingForm((prev) => ({
                                    ...prev,
                                    imageMediaId: item.id,
                                  }))
                                }
                              />
                              <span>{item.originalName}</span>
                            </label>
                          );
                        })}
                      </div>
                      {hasMorePricingMediaCandidates && (
                        <div className={styles.loadMoreWrap}>
                          <button
                            className={styles.buttonSecondary}
                            type="button"
                            onClick={() =>
                              setPricingMediaVisibleCount(
                                (prev) => prev + MEDIA_PICKER_BATCH_SIZE,
                              )
                            }
                          >
                            Xem thêm tên ảnh
                          </button>
                        </div>
                      )}
                      {selectedPricingMedia && (
                        <div className={styles.mediaPreviewCard}>
                          <Image
                            src={selectedPricingMedia.url}
                            alt={selectedPricingMedia.originalName}
                            width={96}
                            height={72}
                            className={styles.mediaPreviewThumb}
                            unoptimized
                          />
                        </div>
                      )}
                    </div>
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
                    <div className={`${styles.full} ${styles.fieldBlock}`}>
                      <label className={styles.fieldLabel}>
                        Danh sách category
                      </label>
                      <div className={styles.categoryPickList}>
                        {galleryCategories.length === 0 ? (
                          <div className={styles.helper}>
                            Chưa có category. Hãy tạo category trước khi thêm
                            item.
                          </div>
                        ) : (
                          galleryCategories.map((category) => {
                            const isActive =
                              galleryItemForm.categoryId === category.id;
                            return (
                              <button
                                key={category.id}
                                type="button"
                                className={`${styles.categoryPickButton} ${isActive ? styles.categoryPickButtonActive : ""}`}
                                onClick={() =>
                                  applyGalleryCategory(category.id)
                                }
                              >
                                <span>{category.name}</span>
                                <span className={styles.categoryPickMeta}>
                                  {galleryItemCountByCategory[category.id] || 0}{" "}
                                  ảnh
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                    <select
                      className={styles.select}
                      value={galleryItemForm.categoryId}
                      onChange={(e) => applyGalleryCategory(e.target.value)}
                    >
                      <option value="">Chọn category</option>
                      {galleryCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <div className={`${styles.full} ${styles.fieldBlock}`}>
                      <label className={styles.fieldLabel}>File media</label>
                      <input
                        className={styles.input}
                        value={galleryMediaKeyword}
                        onChange={(e) => setGalleryMediaKeyword(e.target.value)}
                        placeholder="Tìm tên file media"
                      />
                      <div className={styles.mediaNamePicker}>
                        {visibleGalleryMediaCandidates.map((item) => {
                          const isSelected =
                            galleryItemForm.mediaFileId === item.id;
                          return (
                            <label
                              key={item.id}
                              className={`${styles.mediaNameItem} ${isSelected ? styles.mediaNameItemActive : ""}`}
                            >
                              <input
                                type="radio"
                                name="gallery-item-media"
                                checked={isSelected}
                                onChange={() =>
                                  setGalleryItemForm((prev) => ({
                                    ...prev,
                                    mediaFileId: item.id,
                                  }))
                                }
                              />
                              <span>{item.originalName}</span>
                            </label>
                          );
                        })}
                      </div>
                      {hasMoreGalleryMediaCandidates && (
                        <div className={styles.loadMoreWrap}>
                          <button
                            className={styles.buttonSecondary}
                            type="button"
                            onClick={() =>
                              setGalleryMediaVisibleCount(
                                (prev) => prev + MEDIA_PICKER_BATCH_SIZE,
                              )
                            }
                          >
                            Xem thêm tên ảnh
                          </button>
                        </div>
                      )}
                    </div>
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
                        </>
                      ) : (
                        <div className={styles.helper}>
                          Chọn file để xem trước ảnh nhỏ tương ứng.
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

                  <form
                    className={`${styles.formGrid} ${styles.galleryBulkPanel}`}
                    onSubmit={createGalleryItemsBulk}
                  >
                    <div className={styles.full}>
                      <div className={styles.panelTitle}>
                        Thêm nhanh nhiều ảnh
                      </div>
                      <div className={styles.panelText}>
                        Chọn category, tick nhiều ảnh theo tên file rồi thêm một
                        lần.
                      </div>
                    </div>
                    <select
                      className={styles.select}
                      value={galleryBulkCategoryId}
                      onChange={(e) => applyGalleryCategory(e.target.value)}
                    >
                      <option value="">Chọn category để thêm nhanh</option>
                      {galleryCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <input
                      className={styles.input}
                      type="number"
                      min={1}
                      value={galleryBulkStartOrder}
                      onChange={(e) =>
                        setGalleryBulkStartOrder(Number(e.target.value) || 1)
                      }
                      placeholder="Thứ tự bắt đầu"
                    />
                    <label className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={galleryBulkIsActive}
                        onChange={(e) =>
                          setGalleryBulkIsActive(e.target.checked)
                        }
                      />
                      Tạo mới ở trạng thái kích hoạt
                    </label>
                    <div className={`${styles.full} ${styles.fieldBlock}`}>
                      <label className={styles.fieldLabel}>
                        Chọn nhiều ảnh theo tên
                      </label>
                      <input
                        className={styles.input}
                        value={galleryBulkKeyword}
                        onChange={(e) => setGalleryBulkKeyword(e.target.value)}
                        placeholder="Tìm ảnh theo tên file"
                      />
                      <div className={styles.bulkActionsRow}>
                        <button
                          className={styles.buttonSecondary}
                          type="button"
                          onClick={() => {
                            const visibleIds = visibleGalleryBulkCandidates
                              .map((item) => item.id)
                              .filter(
                                (id) => !galleryBulkExistingMediaSet.has(id),
                              );
                            setGalleryBulkMediaIds((prev) =>
                              Array.from(new Set([...prev, ...visibleIds])),
                            );
                          }}
                        >
                          Chọn tất cả danh sách đang hiển thị
                        </button>
                        <button
                          className={styles.buttonGhost}
                          type="button"
                          onClick={() => setGalleryBulkMediaIds([])}
                        >
                          Bỏ chọn tất cả
                        </button>
                      </div>

                      <div className={styles.mediaNamePicker}>
                        {visibleGalleryBulkCandidates.map((item) => {
                          const isChecked = galleryBulkMediaIds.includes(
                            item.id,
                          );
                          const isExisting = galleryBulkExistingMediaSet.has(
                            item.id,
                          );
                          return (
                            <label
                              key={item.id}
                              className={`${styles.mediaNameItem} ${isChecked ? styles.mediaNameItemActive : ""} ${isExisting ? styles.mediaNameItemDisabled : ""}`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={isExisting}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setGalleryBulkMediaIds((prev) => {
                                    if (checked) {
                                      return Array.from(
                                        new Set([...prev, item.id]),
                                      );
                                    }
                                    return prev.filter((id) => id !== item.id);
                                  });
                                }}
                              />
                              <span>{item.originalName}</span>
                              {isExisting && (
                                <span className={styles.metaPill}>Đã có</span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                      {hasMoreGalleryBulkCandidates && (
                        <div className={styles.loadMoreWrap}>
                          <button
                            className={styles.buttonSecondary}
                            type="button"
                            onClick={() =>
                              setGalleryBulkVisibleCount(
                                (prev) => prev + MEDIA_PICKER_BATCH_SIZE,
                              )
                            }
                          >
                            Xem thêm tên ảnh
                          </button>
                        </div>
                      )}
                    </div>
                    <div
                      className={`${styles.full} ${styles.selectionSummary}`}
                    >
                      Đã chọn {galleryBulkMediaIds.length} ảnh để thêm vào
                      category.
                    </div>
                    <div
                      className={`${styles.full} ${styles.galleryMediaPreview}`}
                    >
                      {selectedGalleryBulkMedia.length > 0 ? (
                        selectedGalleryBulkMedia.map((item) => (
                          <Image
                            key={item.id}
                            src={item.url}
                            alt={item.originalName}
                            width={160}
                            height={120}
                            className={styles.galleryMediaPreviewImage}
                            unoptimized
                          />
                        ))
                      ) : (
                        <div className={styles.helper}>
                          Ảnh đã chọn sẽ hiện preview ở đây (tối đa 3 ảnh).
                        </div>
                      )}
                    </div>
                    <div className={`${styles.row} ${styles.full}`}>
                      <button
                        className={styles.button}
                        type="submit"
                        disabled={galleryBulkCreating}
                      >
                        {galleryBulkCreating
                          ? "Đang tạo gallery item..."
                          : "Thêm vào category"}
                      </button>
                    </div>
                  </form>

                  <div className={styles.galleryItemCards}>
                    {visibleGalleryItems.length === 0 ? (
                      <div className={styles.emptyState}>
                        {galleryItemForm.categoryId
                          ? "Category này chưa có gallery item nào."
                          : "Chưa có gallery item nào."}
                      </div>
                    ) : (
                      visibleGalleryItems.map((item) => {
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
