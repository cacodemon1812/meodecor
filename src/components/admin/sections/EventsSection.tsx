"use client";

import Image from "next/image";
import { FormEvent } from "react";
import styles from "../AdminConsole.module.css";

type MediaItem = { id: string; url: string; originalName: string };
type EventForm = {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverMediaId: string;
  imageMediaIds: string[];
  displayOrder: number;
  isActive: boolean;
};

type EventItem = {
  id: string;
  title: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
  coverMediaId: string;
  imageMediaIds: string[];
  description: string;
};

type EventsSectionProps = {
  showPreview: (path: string) => void;
  saveEvent: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  eventForm: EventForm;
  setEventForm: (updater: (prev: EventForm) => EventForm | EventItem) => void;
  eventCoverKeyword: string;
  setEventCoverKeyword: (value: string) => void;
  visibleEventCoverCandidates: MediaItem[];
  hasMoreEventCoverCandidates: boolean;
  setEventCoverVisibleCount: (updater: (prev: number) => number) => void;
  MEDIA_PICKER_BATCH_SIZE: number;
  selectedEventCoverMedia?: MediaItem;
  eventDetailKeyword: string;
  setEventDetailKeyword: (value: string) => void;
  visibleEventDetailCandidates: MediaItem[];
  hasMoreEventDetailCandidates: boolean;
  setEventDetailVisibleCount: (updater: (prev: number) => number) => void;
  events: EventItem[];
  deleteEvent: (id: string) => Promise<void>;
  EMPTY_EVENT: EventForm;
};

export default function EventsSection({
  showPreview,
  saveEvent,
  eventForm,
  setEventForm,
  eventCoverKeyword,
  setEventCoverKeyword,
  visibleEventCoverCandidates,
  hasMoreEventCoverCandidates,
  setEventCoverVisibleCount,
  MEDIA_PICKER_BATCH_SIZE,
  selectedEventCoverMedia,
  eventDetailKeyword,
  setEventDetailKeyword,
  visibleEventDetailCandidates,
  hasMoreEventDetailCandidates,
  setEventDetailVisibleCount,
  events,
  deleteEvent,
  EMPTY_EVENT,
}: EventsSectionProps) {
  return (
    <>
      <section className={styles.duoGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <div className={styles.panelTitle}>Form sự kiện</div>
              <div className={styles.panelText}>
                Sửa sự kiện và dùng cùng bộ lọc media ở cột trái để chọn ảnh
                chuẩn.
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
                  const isSelected = eventForm.coverMediaId === item.id;
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
                onChange={(e) => setEventDetailKeyword(e.target.value)}
                placeholder="Tìm tên ảnh chi tiết"
              />
              <div className={styles.checkboxList}>
                {visibleEventDetailCandidates.map((item) => (
                  <label key={item.id} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={eventForm.imageMediaIds.includes(item.id)}
                      onChange={(e) =>
                        setEventForm((prev) => ({
                          ...prev,
                          imageMediaIds: e.target.checked
                            ? [...prev.imageMediaIds, item.id]
                            : prev.imageMediaIds.filter((x) => x !== item.id),
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
                  Đã chọn {eventForm.imageMediaIds.length} ảnh chi tiết.
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
                onClick={() => setEventForm(() => EMPTY_EVENT)}
              >
                Reset form
              </button>
            </div>
          </form>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <div className={styles.panelTitle}>Danh sách sự kiện</div>
              <div className={styles.panelText}>
                Bấm sửa để nạp lại form hoặc mở preview theo từng event.
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
                        onClick={() => showPreview(`/events/${item.slug}`)}
                      >
                        Xem trang
                      </button>
                    </td>
                    <td>
                      <div className={styles.row}>
                        <button
                          className={styles.buttonSecondary}
                          type="button"
                          onClick={() => setEventForm(() => item)}
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
  );
}
