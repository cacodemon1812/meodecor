"use client";

import styles from "../AdminConsole.module.css";

type PreviewMode = "desktop" | "tablet" | "mobile";
type SectionKey =
  | "dashboard"
  | "media"
  | "events"
  | "pricing"
  | "gallery"
  | "account"
  | "settings";

type DashboardSectionProps = {
  stats: { totalFiles: number; totalSizeReadable: string } | null;
  events: Array<unknown>;
  siteSettings: Array<unknown>;
  navigateSection: (nextSection: SectionKey, nextPreviewPath?: string) => void;
  chooseSetting: (key: string) => void;
  selectedSettingKey: string;
  previewMode: PreviewMode;
  setPreviewMode: (mode: PreviewMode) => void;
  previewPath: string;
  showPreview: (path: string) => void;
  previewNonce: number;
  previewClass: string;
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

export default function DashboardSection({
  stats,
  events,
  siteSettings,
  navigateSection,
  chooseSetting,
  selectedSettingKey,
  previewMode,
  setPreviewMode,
  previewPath,
  showPreview,
  previewNonce,
  previewClass,
}: DashboardSectionProps) {
  return (
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
                <div className={styles.panelTitle}>Command center</div>
                <div className={styles.panelText}>
                  Các thao tác điển hình khi cần chỉnh trang chủ thật nhanh.
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
                onClick={() => navigateSection("pricing", "/#BaoGiaDichVu")}
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
                  Chọn nhanh key rồi nhảy sang màn hình settings để chỉnh.
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
                Xem ngay trang chính trong admin để xác nhận thay đổi theo ngữ
                cảnh.
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
            <span className={styles.metaPill}>Dang xem: {previewPath}</span>
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
