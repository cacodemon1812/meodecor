"use client";

import {
  FormEvent,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import styles from "./AdminConsole.module.css";
import AccountSection from "./sections/AccountSection";
import DashboardSection from "./sections/DashboardSection";
import EventsSection from "./sections/EventsSection";
import GallerySection from "./sections/GallerySection";
import MediaSection from "./sections/MediaSection";
import PricingSection from "./sections/PricingSection";
import SettingsSection from "./sections/SettingsSection";
import ConfirmActionDialog from "../ui/confirm-action-dialog";

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

type PaginatedMediaResponse = {
  page: number;
  pageSize: number;
  total: number;
  items: MediaItem[];
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

type ConfirmDialogState = {
  title: string;
  description: string;
  confirmLabel: string;
  action: () => Promise<void>;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const UI_STATE_KEY = "meodecor-admin-ui-state-v1";
const MEDIA_PAGE_SIZE = 100;
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

function filterMediaByTagAndKeyword(
  items: MediaItem[],
  keyword: string,
  tagId: string,
): MediaItem[] {
  const itemsAfterTagFilter = tagId
    ? items.filter((item) => item.tagIds.includes(tagId))
    : items;

  return filterMediaByKeyword(itemsAfterTagFilter, keyword);
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
  const [libraryMediaItems, setLibraryMediaItems] = useState<MediaItem[]>([]);
  const [libraryMediaPage, setLibraryMediaPage] = useState(1);
  const [libraryMediaTotal, setLibraryMediaTotal] = useState(0);
  const [libraryMediaLoading, setLibraryMediaLoading] = useState(false);
  const [libraryMediaLoadingMore, setLibraryMediaLoadingMore] = useState(false);
  const [mediaModule, setMediaModule] = useState("general");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadFolderId, setUploadFolderId] = useState("");
  const [uploadTagIds, setUploadTagIds] = useState<string[]>([]);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState("");
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
  const [galleryMediaTagFilter, setGalleryMediaTagFilter] = useState("");
  const [galleryMediaVisibleCount, setGalleryMediaVisibleCount] = useState(
    MEDIA_PICKER_BATCH_SIZE,
  );
  const [galleryBulkCategoryId, setGalleryBulkCategoryId] = useState("");
  const [galleryBulkKeyword, setGalleryBulkKeyword] = useState("");
  const [galleryBulkTagFilter, setGalleryBulkTagFilter] = useState("");
  const [galleryBulkPickerItems, setGalleryBulkPickerItems] = useState<
    MediaItem[]
  >([]);
  const [galleryBulkPickerPage, setGalleryBulkPickerPage] = useState(1);
  const [galleryBulkPickerTotal, setGalleryBulkPickerTotal] = useState(0);
  const [galleryBulkCandidatesLoading, setGalleryBulkCandidatesLoading] =
    useState(false);
  const [
    galleryBulkCandidatesLoadingMore,
    setGalleryBulkCandidatesLoadingMore,
  ] = useState(false);
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
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(
    null,
  );
  const [confirmLoading, setConfirmLoading] = useState(false);

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

  const hasMoreMedia = libraryMediaItems.length < libraryMediaTotal;

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
    () =>
      filterMediaByTagAndKeyword(
        mediaItems,
        deferredGalleryMediaKeyword,
        galleryMediaTagFilter,
      ),
    [mediaItems, deferredGalleryMediaKeyword, galleryMediaTagFilter],
  );
  const visibleGalleryMediaCandidates = useMemo(
    () => galleryMediaCandidates.slice(0, galleryMediaVisibleCount),
    [galleryMediaCandidates, galleryMediaVisibleCount],
  );
  const hasMoreGalleryMediaCandidates =
    visibleGalleryMediaCandidates.length < galleryMediaCandidates.length;

  const visibleGalleryBulkCandidates = galleryBulkPickerItems;
  const hasMoreGalleryBulkCandidates =
    galleryBulkPickerItems.length < galleryBulkPickerTotal;
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
  }, [deferredGalleryMediaKeyword, galleryMediaTagFilter, mediaItems.length]);

  const resetMediaFilters = useCallback(() => {
    setMediaFolderFilter("");
    setMediaTagFilter("");
    setMediaKeyword("");
  }, []);

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

  const handleUnauthorized = useCallback(() => {
    window.localStorage.removeItem("meodecor-admin-token");
    setToken("");
    setMessage("");
    setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
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
        if (response.status === 401) {
          handleUnauthorized();
          throw new Error(
            "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
          );
        }
        const text = await response.text();
        throw new Error(text || `Request failed: ${response.status}`);
      }
      if (response.status === 204) {
        return undefined as T;
      }
      return (await response.json()) as T;
    },
    [handleUnauthorized, token],
  );

  const loadLibraryMedia = useCallback(
    async function loadLibraryMedia(options?: {
      page?: number;
      append?: boolean;
      folderId?: string;
      tagId?: string;
      keyword?: string;
    }) {
      const page = options?.page ?? 1;
      const append = options?.append ?? false;
      const folderId = options?.folderId ?? mediaFolderFilter;
      const tagId = options?.tagId ?? mediaTagFilter;
      const keyword = options?.keyword ?? deferredMediaKeyword;
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(MEDIA_PAGE_SIZE),
      });

      if (folderId) {
        params.set("folderId", folderId);
      }
      if (tagId) {
        params.set("tagId", tagId);
      }
      if (keyword.trim()) {
        params.set("keyword", keyword.trim());
      }

      if (append) {
        setLibraryMediaLoadingMore(true);
      } else {
        setLibraryMediaLoading(true);
      }

      try {
        const mediaData = await api<PaginatedMediaResponse>(
          `/api/admin/media?${params.toString()}`,
        );

        setLibraryMediaPage(mediaData.page);
        setLibraryMediaTotal(mediaData.total);
        setLibraryMediaItems((prev) => {
          if (!append) {
            return mediaData.items || [];
          }

          const merged = new Map(prev.map((item) => [item.id, item]));
          for (const item of mediaData.items || []) {
            merged.set(item.id, item);
          }
          return Array.from(merged.values());
        });
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        if (append) {
          setLibraryMediaLoadingMore(false);
        } else {
          setLibraryMediaLoading(false);
        }
      }
    },
    [api, deferredMediaKeyword, mediaFolderFilter, mediaTagFilter],
  );

  const loadMoreLibraryMedia = useCallback(async () => {
    if (
      libraryMediaLoadingMore ||
      libraryMediaItems.length >= libraryMediaTotal
    ) {
      return;
    }

    await loadLibraryMedia({ page: libraryMediaPage + 1, append: true });
  }, [
    libraryMediaItems.length,
    libraryMediaLoadingMore,
    libraryMediaPage,
    libraryMediaTotal,
    loadLibraryMedia,
  ]);

  const loadGalleryBulkCandidates = useCallback(
    async function loadGalleryBulkCandidates(options?: {
      page?: number;
      append?: boolean;
      tagId?: string;
      keyword?: string;
    }) {
      const page = options?.page ?? 1;
      const append = options?.append ?? false;
      const tagId = options?.tagId ?? galleryBulkTagFilter;
      const keyword = options?.keyword ?? deferredGalleryBulkKeyword;
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(MEDIA_PICKER_BATCH_SIZE),
      });

      if (tagId) {
        params.set("tagId", tagId);
      }
      if (keyword.trim()) {
        params.set("keyword", keyword.trim());
      }

      if (append) {
        setGalleryBulkCandidatesLoadingMore(true);
      } else {
        setGalleryBulkCandidatesLoading(true);
      }

      try {
        const mediaData = await api<PaginatedMediaResponse>(
          `/api/admin/media?${params.toString()}`,
        );

        setGalleryBulkPickerPage(mediaData.page);
        setGalleryBulkPickerTotal(mediaData.total);
        setGalleryBulkPickerItems((prev) => {
          if (!append) {
            return mediaData.items || [];
          }

          const merged = new Map(prev.map((item) => [item.id, item]));
          for (const item of mediaData.items || []) {
            merged.set(item.id, item);
          }
          return Array.from(merged.values());
        });
        setMediaItems((prev) => {
          const merged = new Map(prev.map((item) => [item.id, item]));
          for (const item of mediaData.items || []) {
            merged.set(item.id, item);
          }
          return Array.from(merged.values());
        });
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        if (append) {
          setGalleryBulkCandidatesLoadingMore(false);
        } else {
          setGalleryBulkCandidatesLoading(false);
        }
      }
    },
    [api, deferredGalleryBulkKeyword, galleryBulkTagFilter],
  );

  const loadMoreGalleryBulkCandidates = useCallback(async () => {
    if (
      galleryBulkCandidatesLoadingMore ||
      galleryBulkPickerItems.length >= galleryBulkPickerTotal
    ) {
      return;
    }

    await loadGalleryBulkCandidates({
      page: galleryBulkPickerPage + 1,
      append: true,
    });
  }, [
    galleryBulkCandidatesLoadingMore,
    galleryBulkPickerItems.length,
    galleryBulkPickerPage,
    galleryBulkPickerTotal,
    loadGalleryBulkCandidates,
  ]);

  useEffect(() => {
    if (!token) {
      setGalleryBulkPickerItems([]);
      setGalleryBulkPickerPage(1);
      setGalleryBulkPickerTotal(0);
      return;
    }

    void loadGalleryBulkCandidates({ page: 1 });
  }, [
    deferredGalleryBulkKeyword,
    galleryBulkTagFilter,
    loadGalleryBulkCandidates,
    token,
  ]);

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
          api<PaginatedMediaResponse>(
            `/api/admin/media?page=1&pageSize=${MEDIA_PAGE_SIZE}`,
          ),
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

  useEffect(() => {
    if (!token) {
      return;
    }

    void loadLibraryMedia({ page: 1 });
  }, [
    token,
    loadLibraryMedia,
    mediaFolderFilter,
    mediaTagFilter,
    deferredMediaKeyword,
  ]);

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
      setUploadSuccessMessage("");
      setError("Chọn file trước khi upload.");
      return;
    }
    setError("");
    setUploadSuccessMessage("");
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
      const successText = `Upload thành công ${uploadResult.uploadedCount} file vào thư viện.`;
      setUploadFiles([]);
      setUploadSuccessMessage(successText);
      setMessage(successText);
      await Promise.all([loadAdminData(), loadLibraryMedia({ page: 1 })]);
      showPreview(SECTION_META.media.previewPath);
    } catch (uploadError) {
      setUploadSuccessMessage("");
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
      await Promise.all([loadAdminData(), loadLibraryMedia({ page: 1 })]);
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
      await Promise.all([loadAdminData(), loadLibraryMedia({ page: 1 })]);
    } catch (tagError) {
      setError(getErrorMessage(tagError));
    } finally {
      setCreatingTag(false);
    }
  }

  async function deleteMedia(id: string) {
    requestConfirmAction({
      title: "Xóa mềm file này?",
      description:
        "File sẽ bị ẩn khỏi media library và các bộ chọn media hiện tại sau khi xác nhận.",
      confirmLabel: "Xóa file",
      action: async () => {
        try {
          await api(`/api/admin/media/${id}`, { method: "DELETE" });
          setMessage("Đã xóa mềm file.");
          await Promise.all([loadAdminData(), loadLibraryMedia({ page: 1 })]);
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
    requestConfirmAction({
      title: "Xóa sự kiện này?",
      description:
        "Sự kiện sẽ bị gỡ khỏi danh sách hiển thị và không còn xuất hiện trên trang public.",
      confirmLabel: "Xóa sự kiện",
      action: async () => {
        try {
          await api(`/api/admin/events/${id}`, { method: "DELETE" });
          setMessage("Đã xóa sự kiện.");
          await loadAdminData();
          showPreview("/#events");
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
    requestConfirmAction({
      title: "Xóa gói giá này?",
      description:
        "Gói giá sẽ bị xóa khỏi bảng giá và người dùng sẽ không còn thấy nội dung này ngoài trang chủ.",
      confirmLabel: "Xóa gói giá",
      action: async () => {
        try {
          await api(`/api/admin/pricing/${id}`, { method: "DELETE" });
          setMessage("Đã xóa gói giá.");
          await loadAdminData();
          showPreview("/#BaoGiaDichVu");
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
    requestConfirmAction({
      title: "Xóa item gallery này?",
      description:
        "Ảnh sẽ bị gỡ khỏi category gallery hiện tại và không còn hiển thị trong bộ sưu tập public.",
      confirmLabel: "Xóa item",
      action: async () => {
        try {
          await api(`/api/admin/gallery/items/${id}`, { method: "DELETE" });
          setMessage("Đã xóa item gallery.");
          await loadAdminData();
          showPreview("/#gallery");
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
      <>
        <div className={styles.page}>
          <div className={styles.loginWrap}>
            <div className={styles.loginSplash}>
              <div className={styles.eyebrow}>Control Center</div>
              <h1 className={styles.title}>MeoDecor Admin Console</h1>
              <p className={styles.subtitle}>
                Bản quản trị mới tập trung vào ba việc: chỉnh nội dung nhanh,
                thấy ngay section ngoài trang chính và thao tác media không bị
                lạc ngữ cảnh.
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

  return (
    <>
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
                <DashboardSection
                  stats={stats}
                  events={events}
                  siteSettings={siteSettings}
                  navigateSection={navigateSection}
                  chooseSetting={chooseSetting}
                  selectedSettingKey={selectedSettingKey}
                  previewMode={previewMode}
                  setPreviewMode={setPreviewMode}
                  previewPath={previewPath}
                  showPreview={showPreview}
                  previewNonce={previewNonce}
                  previewClass={previewClass}
                />
              )}

              {section === "media" && (
                <MediaSection
                  mediaMenu={mediaMenu}
                  setMediaMenu={setMediaMenu}
                  setShowFolderModal={setShowFolderModal}
                  setShowTagModal={setShowTagModal}
                  uploadMedia={uploadMedia}
                  uploadFiles={uploadFiles}
                  setUploadFiles={setUploadFiles}
                  setUploadSuccessMessage={setUploadSuccessMessage}
                  mediaModule={mediaModule}
                  setMediaModule={setMediaModule}
                  uploadFolderId={uploadFolderId}
                  setUploadFolderId={setUploadFolderId}
                  folders={folders}
                  tags={tags}
                  uploadTagIds={uploadTagIds}
                  setUploadTagIds={setUploadTagIds}
                  tagMap={tagMap}
                  uploading={uploading}
                  uploadSuccessMessage={uploadSuccessMessage}
                  mediaItems={libraryMediaItems}
                  totalFilteredMedia={libraryMediaTotal}
                  mediaLoading={libraryMediaLoading}
                  mediaLoadingMore={libraryMediaLoadingMore}
                  showPreview={showPreview}
                  mediaFolderFilter={mediaFolderFilter}
                  setMediaFolderFilter={setMediaFolderFilter}
                  mediaTagFilter={mediaTagFilter}
                  setMediaTagFilter={setMediaTagFilter}
                  mediaKeyword={mediaKeyword}
                  setMediaKeyword={setMediaKeyword}
                  resetMediaFilters={resetMediaFilters}
                  folderMap={folderMap}
                  hasMoreMedia={hasMoreMedia}
                  loadMoreMedia={loadMoreLibraryMedia}
                  deleteMedia={deleteMedia}
                  showFolderModal={showFolderModal}
                  creatingFolder={creatingFolder}
                  createFolder={createFolder}
                  folderName={folderName}
                  setFolderName={setFolderName}
                  folderSlug={folderSlug}
                  setFolderSlug={setFolderSlug}
                  showTagModal={showTagModal}
                  creatingTag={creatingTag}
                  createTag={createTag}
                  tagName={tagName}
                  setTagName={setTagName}
                  tagSlug={tagSlug}
                  setTagSlug={setTagSlug}
                />
              )}

              {section === "events" && (
                <EventsSection
                  showPreview={showPreview}
                  saveEvent={saveEvent}
                  eventForm={eventForm}
                  setEventForm={setEventForm}
                  eventCoverKeyword={eventCoverKeyword}
                  setEventCoverKeyword={setEventCoverKeyword}
                  visibleEventCoverCandidates={visibleEventCoverCandidates}
                  hasMoreEventCoverCandidates={hasMoreEventCoverCandidates}
                  setEventCoverVisibleCount={setEventCoverVisibleCount}
                  MEDIA_PICKER_BATCH_SIZE={MEDIA_PICKER_BATCH_SIZE}
                  selectedEventCoverMedia={selectedEventCoverMedia}
                  eventDetailKeyword={eventDetailKeyword}
                  setEventDetailKeyword={setEventDetailKeyword}
                  visibleEventDetailCandidates={visibleEventDetailCandidates}
                  hasMoreEventDetailCandidates={hasMoreEventDetailCandidates}
                  setEventDetailVisibleCount={setEventDetailVisibleCount}
                  events={events}
                  deleteEvent={deleteEvent}
                  EMPTY_EVENT={EMPTY_EVENT}
                />
              )}

              {section === "pricing" && (
                <PricingSection
                  showPreview={showPreview}
                  savePricing={savePricing}
                  pricingForm={pricingForm}
                  setPricingForm={setPricingForm}
                  pricingMediaKeyword={pricingMediaKeyword}
                  setPricingMediaKeyword={setPricingMediaKeyword}
                  visiblePricingMediaCandidates={visiblePricingMediaCandidates}
                  hasMorePricingMediaCandidates={hasMorePricingMediaCandidates}
                  setPricingMediaVisibleCount={setPricingMediaVisibleCount}
                  MEDIA_PICKER_BATCH_SIZE={MEDIA_PICKER_BATCH_SIZE}
                  selectedPricingMedia={selectedPricingMedia}
                  pricing={pricing}
                  deletePricing={deletePricing}
                  EMPTY_PRICING={EMPTY_PRICING}
                />
              )}

              {section === "gallery" && (
                <GallerySection
                  showPreview={showPreview}
                  saveCategory={saveCategory}
                  categoryForm={categoryForm}
                  setCategoryForm={setCategoryForm}
                  EMPTY_CATEGORY={EMPTY_CATEGORY}
                  galleryCategories={galleryCategories}
                  galleryItems={galleryItems}
                  saveGalleryItem={saveGalleryItem}
                  galleryItemForm={galleryItemForm}
                  setGalleryItemForm={setGalleryItemForm}
                  applyGalleryCategory={applyGalleryCategory}
                  galleryItemCountByCategory={galleryItemCountByCategory}
                  galleryMediaTagFilter={galleryMediaTagFilter}
                  setGalleryMediaTagFilter={setGalleryMediaTagFilter}
                  tags={tags}
                  galleryMediaKeyword={galleryMediaKeyword}
                  setGalleryMediaKeyword={setGalleryMediaKeyword}
                  visibleGalleryMediaCandidates={visibleGalleryMediaCandidates}
                  hasMoreGalleryMediaCandidates={hasMoreGalleryMediaCandidates}
                  setGalleryMediaVisibleCount={setGalleryMediaVisibleCount}
                  selectedGalleryMedia={selectedGalleryMedia}
                  EMPTY_ITEM={EMPTY_ITEM}
                  createGalleryItemsBulk={createGalleryItemsBulk}
                  galleryBulkCategoryId={galleryBulkCategoryId}
                  galleryBulkStartOrder={galleryBulkStartOrder}
                  setGalleryBulkStartOrder={setGalleryBulkStartOrder}
                  galleryBulkIsActive={galleryBulkIsActive}
                  setGalleryBulkIsActive={setGalleryBulkIsActive}
                  galleryBulkTagFilter={galleryBulkTagFilter}
                  setGalleryBulkTagFilter={setGalleryBulkTagFilter}
                  galleryBulkKeyword={galleryBulkKeyword}
                  setGalleryBulkKeyword={setGalleryBulkKeyword}
                  visibleGalleryBulkCandidates={visibleGalleryBulkCandidates}
                  galleryBulkExistingMediaSet={galleryBulkExistingMediaSet}
                  setGalleryBulkMediaIds={setGalleryBulkMediaIds}
                  galleryBulkMediaIds={galleryBulkMediaIds}
                  hasMoreGalleryBulkCandidates={hasMoreGalleryBulkCandidates}
                  galleryBulkCandidatesLoading={galleryBulkCandidatesLoading}
                  galleryBulkCandidatesLoadingMore={
                    galleryBulkCandidatesLoadingMore
                  }
                  loadMoreGalleryBulkCandidates={loadMoreGalleryBulkCandidates}
                  selectedGalleryBulkMedia={selectedGalleryBulkMedia}
                  galleryBulkCreating={galleryBulkCreating}
                  visibleGalleryItems={visibleGalleryItems}
                  mediaMap={mediaMap}
                  categoryMap={categoryMap}
                  deleteGalleryItem={deleteGalleryItem}
                />
              )}

              {section === "account" && (
                <AccountSection
                  handleChangePassword={handleChangePassword}
                  changePasswordMessage={changePasswordMessage}
                  changePasswordError={changePasswordError}
                  oldPassword={oldPassword}
                  setOldPassword={setOldPassword}
                  newPassword={newPassword}
                  setNewPassword={setNewPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  changePasswordLoading={changePasswordLoading}
                />
              )}

              {section === "settings" && (
                <SettingsSection
                  showPreview={showPreview}
                  selectedSettingKey={selectedSettingKey}
                  siteSettings={siteSettings}
                  chooseSetting={chooseSetting}
                  saveSetting={saveSetting}
                  settingJson={settingJson}
                  setSettingJson={setSettingJson}
                  formatJson={formatJson}
                />
              )}
            </main>
          </div>
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
  if (error instanceof Error) return error.message;
  return "Có lỗi xảy ra.";
}
