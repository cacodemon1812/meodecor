"use client";

import Image from "next/image";
import { FormEvent } from "react";
import styles from "../AdminConsole.module.css";

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

type MediaItem = {
  id: string;
  url: string;
  originalName: string;
};

type GalleryItemForm = {
  id: string;
  categoryId: string;
  mediaFileId: string;
  title: string;
  altText: string;
  displayOrder: number;
  isActive: boolean;
};

type CategoryForm = {
  id: string;
  code: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
};

type GallerySectionProps = {
  showPreview: (path: string) => void;
  saveCategory: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  categoryForm: CategoryForm;
  setCategoryForm: (
    updater: (prev: CategoryForm) => CategoryForm | GalleryCategory,
  ) => void;
  EMPTY_CATEGORY: CategoryForm;
  galleryCategories: GalleryCategory[];
  galleryItems: GalleryItem[];
  saveGalleryItem: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  galleryItemForm: GalleryItemForm;
  setGalleryItemForm: (
    updater: (prev: GalleryItemForm) => GalleryItemForm,
  ) => void;
  applyGalleryCategory: (categoryId: string) => void;
  galleryItemCountByCategory: Record<string, number>;
  galleryMediaTagFilter: string;
  setGalleryMediaTagFilter: (value: string) => void;
  tags: Array<{ id: string; name: string }>;
  galleryMediaKeyword: string;
  setGalleryMediaKeyword: (value: string) => void;
  visibleGalleryMediaCandidates: MediaItem[];
  hasMoreGalleryMediaCandidates: boolean;
  setGalleryMediaVisibleCount: (updater: (prev: number) => number) => void;
  selectedGalleryMedia?: MediaItem;
  EMPTY_ITEM: GalleryItemForm;
  createGalleryItemsBulk: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  galleryBulkCategoryId: string;
  galleryBulkStartOrder: number;
  setGalleryBulkStartOrder: (value: number) => void;
  galleryBulkIsActive: boolean;
  setGalleryBulkIsActive: (value: boolean) => void;
  galleryBulkTagFilter: string;
  setGalleryBulkTagFilter: (value: string) => void;
  galleryBulkKeyword: string;
  setGalleryBulkKeyword: (value: string) => void;
  visibleGalleryBulkCandidates: MediaItem[];
  galleryBulkExistingMediaSet: Set<string>;
  setGalleryBulkMediaIds: (updater: (prev: string[]) => string[]) => void;
  galleryBulkMediaIds: string[];
  hasMoreGalleryBulkCandidates: boolean;
  galleryBulkCandidatesLoading: boolean;
  galleryBulkCandidatesLoadingMore: boolean;
  loadMoreGalleryBulkCandidates: () => void | Promise<void>;
  selectedGalleryBulkMedia: MediaItem[];
  galleryBulkCreating: boolean;
  visibleGalleryItems: GalleryItem[];
  mediaMap: Record<string, MediaItem | undefined>;
  categoryMap: Record<string, GalleryCategory | undefined>;
  deleteGalleryItem: (id: string) => Promise<void>;
};

export default function GallerySection({
  showPreview,
  saveCategory,
  categoryForm,
  setCategoryForm,
  EMPTY_CATEGORY,
  galleryCategories,
  galleryItems,
  galleryItemForm,
  setGalleryItemForm,
  applyGalleryCategory,
  tags,
  createGalleryItemsBulk,
  galleryBulkCategoryId,
  galleryBulkStartOrder,
  setGalleryBulkStartOrder,
  galleryBulkIsActive,
  setGalleryBulkIsActive,
  galleryBulkTagFilter,
  setGalleryBulkTagFilter,
  galleryBulkKeyword,
  setGalleryBulkKeyword,
  visibleGalleryBulkCandidates,
  galleryBulkExistingMediaSet,
  setGalleryBulkMediaIds,
  galleryBulkMediaIds,
  hasMoreGalleryBulkCandidates,
  galleryBulkCandidatesLoading,
  galleryBulkCandidatesLoadingMore,
  loadMoreGalleryBulkCandidates,
  selectedGalleryBulkMedia,
  galleryBulkCreating,
  visibleGalleryItems,
  mediaMap,
  categoryMap,
  deleteGalleryItem,
}: GallerySectionProps) {
  return (
    <section className={styles.duoGrid}>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <div className={styles.panelTitle}>Category gallery</div>
            <div className={styles.panelText}>
              Code sẽ dùng làm anchor ngoài trang chủ nên cần dễ đọc và ổn định.
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
              onClick={() => setCategoryForm(() => EMPTY_CATEGORY)}
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
              <article key={category.id} className={styles.categoryCard}>
                <div className={styles.categoryTop}>
                  <div>
                    <div className={styles.categoryName}>{category.name}</div>
                    <div className={styles.categoryCode}>#{category.code}</div>
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
                  onClick={() => setCategoryForm(() => category)}
                >
                  Chỉnh category
                </button>
              </article>
            ))
          )}
        </div>
      </section>

      <section className={styles.panel}>
        <form
          className={`${styles.formGrid} ${styles.galleryBulkPanel}`}
          onSubmit={createGalleryItemsBulk}
        >
          <div className={styles.full}>
            <div className={styles.panelTitle}>Thêm nhanh nhiều ảnh</div>
            <div className={styles.panelText}>
              Chọn category, tick nhiều ảnh theo tên file rồi thêm một lần.
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
              onChange={(e) => setGalleryBulkIsActive(e.target.checked)}
            />
            Tạo mới ở trạng thái kích hoạt
          </label>
          <div className={`${styles.full} ${styles.fieldBlock}`}>
            <label className={styles.fieldLabel}>
              Chọn nhiều ảnh theo tag và tên
            </label>
            <select
              className={styles.select}
              value={galleryBulkTagFilter}
              onChange={(e) => setGalleryBulkTagFilter(e.target.value)}
              disabled={galleryBulkCandidatesLoading}
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
              value={galleryBulkKeyword}
              onChange={(e) => setGalleryBulkKeyword(e.target.value)}
              placeholder="Tìm ảnh theo tên file"
              disabled={galleryBulkCandidatesLoading}
            />
            <div className={styles.bulkActionsRow}>
              <button
                className={styles.buttonSecondary}
                type="button"
                onClick={() => {
                  const visibleIds = visibleGalleryBulkCandidates
                    .map((item) => item.id)
                    .filter((id) => !galleryBulkExistingMediaSet.has(id));
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
                onClick={() => setGalleryBulkMediaIds(() => [])}
              >
                Bỏ chọn tất cả
              </button>
            </div>

            <div className={styles.mediaNamePicker}>
              {galleryBulkCandidatesLoading &&
              visibleGalleryBulkCandidates.length === 0 ? (
                <div className={styles.helper}>
                  Đang tải lại danh sách ảnh...
                </div>
              ) : visibleGalleryBulkCandidates.length === 0 ? (
                <div className={styles.helper}>
                  Không có ảnh phù hợp với lựa chọn hiện tại.
                </div>
              ) : (
                visibleGalleryBulkCandidates.map((item) => {
                  const isChecked = galleryBulkMediaIds.includes(item.id);
                  const isExisting = galleryBulkExistingMediaSet.has(item.id);
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
                              return Array.from(new Set([...prev, item.id]));
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
                })
              )}
            </div>
            {hasMoreGalleryBulkCandidates && (
              <div className={styles.loadMoreWrap}>
                <button
                  className={styles.buttonSecondary}
                  type="button"
                  onClick={() => void loadMoreGalleryBulkCandidates()}
                  disabled={galleryBulkCandidatesLoadingMore}
                >
                  {galleryBulkCandidatesLoadingMore
                    ? "Đang tải thêm ảnh..."
                    : "Xem thêm tên ảnh"}
                </button>
              </div>
            )}
          </div>
          <div className={`${styles.full} ${styles.selectionSummary}`}>
            Đã chọn {galleryBulkMediaIds.length} ảnh để thêm vào category.
          </div>
          <div className={`${styles.full} ${styles.galleryMediaPreview}`}>
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
                <article key={item.id} className={styles.galleryItemCard}>
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
                      <div className={styles.galleryItemThumbPlaceholder}>
                        No image
                      </div>
                    )}
                  </div>
                  <div className={styles.galleryItemContent}>
                    <div className={styles.galleryItemTitleRow}>
                      <strong>
                        {item.title || media?.originalName || "Gallery item"}
                      </strong>
                      <span
                        className={`${styles.badge} ${item.isActive ? "" : styles.badgeMuted}`}
                      >
                        {item.isActive ? "Đang bật" : "Đang ẩn"}
                      </span>
                    </div>
                    <div className={styles.galleryItemMeta}>
                      Category:{" "}
                      {categoryMap[item.categoryId]?.name ?? item.categoryId}
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
                        setGalleryItemForm(() => ({
                          id: item.id,
                          categoryId: item.categoryId,
                          mediaFileId: item.mediaFileId,
                          title: item.title || "",
                          altText: item.altText || "",
                          displayOrder: item.displayOrder,
                          isActive: item.isActive,
                        }))
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
  );
}
