"use client";

import Image from "next/image";
import { FormEvent } from "react";
import styles from "../AdminConsole.module.css";

type Folder = { id: string; name: string };
type Tag = { id: string; name: string };
type MediaItem = {
  id: string;
  url: string;
  originalName: string;
  module: string;
  sizeBytes: number;
  folderId?: string | null;
  tagIds: string[];
  isActive: boolean;
};

type MediaSectionProps = {
  mediaMenu: "upload" | "library";
  setMediaMenu: (value: "upload" | "library") => void;
  setShowFolderModal: (value: boolean) => void;
  setShowTagModal: (value: boolean) => void;
  uploadMedia: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  uploadFiles: File[];
  setUploadFiles: (files: File[]) => void;
  setUploadSuccessMessage: (value: string) => void;
  mediaModule: string;
  setMediaModule: (value: string) => void;
  uploadFolderId: string;
  setUploadFolderId: (value: string) => void;
  folders: Folder[];
  tags: Tag[];
  uploadTagIds: string[];
  setUploadTagIds: (updater: (previous: string[]) => string[]) => void;
  tagMap: Record<string, { name: string } | undefined>;
  uploading: boolean;
  uploadSuccessMessage: string;
  mediaItems: MediaItem[];
  totalFilteredMedia: number;
  mediaLoading: boolean;
  mediaLoadingMore: boolean;
  showPreview: (path: string) => void;
  mediaFolderFilter: string;
  setMediaFolderFilter: (value: string) => void;
  mediaTagFilter: string;
  setMediaTagFilter: (value: string) => void;
  mediaKeyword: string;
  setMediaKeyword: (value: string) => void;
  resetMediaFilters: () => void;
  folderMap: Record<string, { name: string } | undefined>;
  hasMoreMedia: boolean;
  loadMoreMedia: () => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;
  showFolderModal: boolean;
  creatingFolder: boolean;
  createFolder: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  folderName: string;
  setFolderName: (value: string) => void;
  folderSlug: string;
  setFolderSlug: (value: string) => void;
  showTagModal: boolean;
  creatingTag: boolean;
  createTag: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  tagName: string;
  setTagName: (value: string) => void;
  tagSlug: string;
  setTagSlug: (value: string) => void;
};

export default function MediaSection({
  mediaMenu,
  setMediaMenu,
  setShowFolderModal,
  setShowTagModal,
  uploadMedia,
  uploadFiles,
  setUploadFiles,
  setUploadSuccessMessage,
  mediaModule,
  setMediaModule,
  uploadFolderId,
  setUploadFolderId,
  folders,
  tags,
  uploadTagIds,
  setUploadTagIds,
  tagMap,
  uploading,
  uploadSuccessMessage,
  mediaItems,
  totalFilteredMedia,
  mediaLoading,
  mediaLoadingMore,
  showPreview,
  mediaFolderFilter,
  setMediaFolderFilter,
  mediaTagFilter,
  setMediaTagFilter,
  mediaKeyword,
  setMediaKeyword,
  resetMediaFilters,
  folderMap,
  hasMoreMedia,
  loadMoreMedia,
  deleteMedia,
  showFolderModal,
  creatingFolder,
  createFolder,
  folderName,
  setFolderName,
  folderSlug,
  setFolderSlug,
  showTagModal,
  creatingTag,
  createTag,
  tagName,
  setTagName,
  tagSlug,
  setTagSlug,
}: MediaSectionProps) {
  return (
    <>
      <section className={styles.subMenuBar}>
        <button
          type="button"
          className={`${styles.subMenuButton} ${mediaMenu === "upload" ? styles.subMenuButtonActive : ""}`}
          onClick={() => setMediaMenu("upload")}
        >
          Upload & phan loai
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
                <div className={styles.panelTitle}>Upload file moi</div>
                <div className={styles.panelText}>
                  Chon dung module, folder, tag de quan ly file theo ngu canh va
                  tim lai nhanh hon.
                </div>
              </div>
              <div className={styles.row}>
                <button
                  className={styles.buttonSecondary}
                  type="button"
                  onClick={() => setShowFolderModal(true)}
                >
                  + Tao folder
                </button>
                <button
                  className={styles.buttonGhost}
                  type="button"
                  onClick={() => setShowTagModal(true)}
                >
                  + Tao tag
                </button>
              </div>
            </div>
            <div className={styles.uploadGuide}>
              <div className={styles.uploadGuideTitle}>
                Quy trinh upload goi y
              </div>
              <ul className={styles.uploadGuideList}>
                <li>1) Chon module (vi du: general, gallery, events).</li>
                <li>2) Chon folder de gom nhom theo chien dich.</li>
                <li>3) Gan tag de loc nhanh khi chon anh cho form khac.</li>
                <li>4) Upload 1 hoac nhieu file trong cung mot lan.</li>
              </ul>
            </div>
            <form className={styles.formGrid} onSubmit={uploadMedia}>
              <div className={`${styles.fieldBlock} ${styles.full}`}>
                <label className={styles.fieldLabel}>File upload</label>
                <input
                  className={`${styles.file} ${styles.full}`}
                  type="file"
                  multiple
                  onChange={(e) => {
                    setUploadSuccessMessage("");
                    setUploadFiles(Array.from(e.target.files ?? []));
                  }}
                />
                <div className={styles.helper}>
                  Ho tro chon nhieu file cung luc. Dinh dang va dung luong tuan
                  theo cau hinh backend.
                </div>
              </div>
              <div className={`${styles.helper} ${styles.full}`}>
                {uploadFiles.length > 0
                  ? `Da chon ${uploadFiles.length} file de upload.`
                  : "Co the chon 1 hoac nhieu file trong mot lan upload."}
              </div>
              <div className={styles.fieldBlock}>
                <label className={styles.fieldLabel}>Module</label>
                <input
                  className={styles.input}
                  value={mediaModule}
                  onChange={(e) => setMediaModule(e.target.value)}
                  placeholder="Vi du: general, gallery, events"
                />
                <div className={styles.helper}>
                  Module giup backend luu file dung thu muc nghiep vu.
                </div>
              </div>
              <div className={styles.fieldBlock}>
                <label className={styles.fieldLabel}>Folder</label>
                <select
                  className={styles.select}
                  value={uploadFolderId}
                  onChange={(e) => setUploadFolderId(e.target.value)}
                >
                  <option value="">Chon folder</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
                <div className={styles.helper}>
                  Folder giup nhom media theo tung chien dich hoac chu de.
                </div>
              </div>
              <div className={`${styles.fieldBlock} ${styles.full}`}>
                <label className={styles.fieldLabel}>Tag (da chon)</label>
                <div className={styles.tagPickerGrid}>
                  {tags.length === 0 ? (
                    <span className={styles.helper}>Chua co tag.</span>
                  ) : (
                    tags.map((tag) => (
                      <label key={tag.id} className={styles.tagPickerItem}>
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
                  Chon truc tiep nhieu tag de gan vao toan bo file trong lan
                  upload nay.
                </div>
              </div>
              {uploadTagIds.length > 0 && (
                <div className={`${styles.tagRow} ${styles.full}`}>
                  {uploadTagIds.map((tagId) => (
                    <span
                      key={tagId}
                      className={styles.badgeMuted + " " + styles.badge}
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
                {uploading ? "Dang upload..." : "Upload va them vao thu vien"}
              </button>
              {uploadSuccessMessage && (
                <div className={`${styles.message} ${styles.full}`}>
                  {uploadSuccessMessage}
                </div>
              )}
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
                Danh sach media duoc tach rieng theo menu de duyet nhanh, khong
                bi roi khi upload.
              </div>
            </div>
            <div className={styles.badgeRow}>
              <span className={styles.badge}>
                {mediaItems.length}/{totalFilteredMedia} file
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
              <option value="">Tat ca tag</option>
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
              placeholder="Tim ten file hoac storage key"
            />
            <button
              className={styles.buttonGhost}
              type="button"
              onClick={resetMediaFilters}
            >
              Xoa bo loc
            </button>
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
              {totalFilteredMedia} file khop
            </span>
          </div>
          {mediaLoading ? (
            <div className={styles.emptyState}>Dang tai media...</div>
          ) : totalFilteredMedia === 0 ? (
            <div className={styles.emptyState}>
              Chua co file nao khop bo loc hien tai.
            </div>
          ) : (
            <>
              <div className={styles.mediaGrid}>
                {mediaItems.map((item) => (
                  <article key={item.id} className={styles.mediaCard}>
                    <Image
                      className={styles.mediaThumb}
                      src={item.url}
                      alt={item.originalName}
                      width={640}
                      height={480}
                      unoptimized
                    />
                    <div className={styles.mediaName}>{item.originalName}</div>
                    <div className={styles.mediaMeta}>
                      {item.module} . {Math.round(item.sizeBytes / 1024)}KB
                    </div>
                    <div className={styles.tagRow}>
                      {item.folderId && (
                        <span
                          className={styles.badgeMuted + " " + styles.badge}
                        >
                          {folderMap[item.folderId]?.name ?? "Folder"}
                        </span>
                      )}
                      {item.tagIds.slice(0, 2).map((tagId) => (
                        <span
                          key={tagId}
                          className={styles.badgeMuted + " " + styles.badge}
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
                    onClick={() => void loadMoreMedia()}
                    disabled={mediaLoadingMore}
                  >
                    {mediaLoadingMore
                      ? "Dang tai them..."
                      : `Load them ${Math.min(100, totalFilteredMedia - mediaItems.length)} file`}
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
            aria-label="Tao folder"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.panelHeader}>
              <div>
                <div className={styles.panelTitle}>Tao folder moi</div>
                <div className={styles.panelText}>
                  Folder giup to chuc media theo nhom nghiep vu de de quan ly
                  lau dai.
                </div>
              </div>
              <button
                className={styles.buttonGhost}
                type="button"
                onClick={() => setShowFolderModal(false)}
                disabled={creatingFolder}
              >
                Dong
              </button>
            </div>
            <form className={styles.formGrid} onSubmit={createFolder}>
              <div className={styles.fieldBlock}>
                <label className={styles.fieldLabel}>Ten folder</label>
                <input
                  className={styles.input}
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Vi du: sinh-nhat-be-trai"
                  required
                />
              </div>
              <div className={styles.fieldBlock}>
                <label className={styles.fieldLabel}>Slug</label>
                <input
                  className={styles.input}
                  value={folderSlug}
                  onChange={(e) => setFolderSlug(e.target.value)}
                  placeholder="Vi du: sinh-nhat-be-trai"
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
                  Huy
                </button>
                <button
                  className={styles.button}
                  type="submit"
                  disabled={creatingFolder}
                >
                  {creatingFolder ? "Dang luu..." : "Luu folder"}
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
            aria-label="Tao tag"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.panelHeader}>
              <div>
                <div className={styles.panelTitle}>Tao tag moi</div>
                <div className={styles.panelText}>
                  Tag giup loc nhanh media theo concept, campaign, san pham.
                </div>
              </div>
              <button
                className={styles.buttonGhost}
                type="button"
                onClick={() => setShowTagModal(false)}
                disabled={creatingTag}
              >
                Dong
              </button>
            </div>
            <form className={styles.formGrid} onSubmit={createTag}>
              <div className={styles.fieldBlock}>
                <label className={styles.fieldLabel}>Ten tag</label>
                <input
                  className={styles.input}
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="Vi du: premium"
                  required
                />
              </div>
              <div className={styles.fieldBlock}>
                <label className={styles.fieldLabel}>Slug</label>
                <input
                  className={styles.input}
                  value={tagSlug}
                  onChange={(e) => setTagSlug(e.target.value)}
                  placeholder="Vi du: premium"
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
                  Huy
                </button>
                <button
                  className={styles.button}
                  type="submit"
                  disabled={creatingTag}
                >
                  {creatingTag ? "Dang luu..." : "Luu tag"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
