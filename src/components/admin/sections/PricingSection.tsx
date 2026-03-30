"use client";

import Image from "next/image";
import { FormEvent } from "react";
import styles from "../AdminConsole.module.css";

type MediaItem = { id: string; url: string; originalName: string };
type PricingForm = {
  id: string;
  code: string;
  title: string;
  price: number;
  currency: string;
  tagline: string;
  imageMediaId: string;
  bulletsText: string;
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

type PricingSectionProps = {
  showPreview: (path: string) => void;
  savePricing: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  pricingForm: PricingForm;
  setPricingForm: (updater: (prev: PricingForm) => PricingForm) => void;
  pricingMediaKeyword: string;
  setPricingMediaKeyword: (value: string) => void;
  visiblePricingMediaCandidates: MediaItem[];
  hasMorePricingMediaCandidates: boolean;
  setPricingMediaVisibleCount: (updater: (prev: number) => number) => void;
  MEDIA_PICKER_BATCH_SIZE: number;
  selectedPricingMedia?: MediaItem;
  pricing: PricingItem[];
  deletePricing: (id: string) => Promise<void>;
  EMPTY_PRICING: PricingForm;
};

export default function PricingSection({
  showPreview,
  savePricing,
  pricingForm,
  setPricingForm,
  pricingMediaKeyword,
  setPricingMediaKeyword,
  visiblePricingMediaCandidates,
  hasMorePricingMediaCandidates,
  setPricingMediaVisibleCount,
  MEDIA_PICKER_BATCH_SIZE,
  selectedPricingMedia,
  pricing,
  deletePricing,
  EMPTY_PRICING,
}: PricingSectionProps) {
  return (
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
                const isSelected = pricingForm.imageMediaId === item.id;
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
              onClick={() => setPricingForm(() => EMPTY_PRICING)}
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
              Chọn gói để sửa nhanh hoặc đối chiếu thứ tự hiển thị ngoài trang
              chính.
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
                    <div className={styles.helper}>{item.tagline}</div>
                  </td>
                  <td>
                    {item.price.toLocaleString("vi-VN")} {item.currency}
                  </td>
                  <td>
                    <div className={styles.row}>
                      <button
                        className={styles.buttonSecondary}
                        type="button"
                        onClick={() =>
                          setPricingForm(() => ({
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
                          }))
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
  );
}
