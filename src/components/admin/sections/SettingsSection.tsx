"use client";

import { FormEvent } from "react";
import styles from "../AdminConsole.module.css";

type SiteSetting = { key: string; jsonValue: string };

type SettingsSectionProps = {
  showPreview: (path: string) => void;
  selectedSettingKey: string;
  siteSettings: SiteSetting[];
  chooseSetting: (key: string) => void;
  saveSetting: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  settingJson: string;
  setSettingJson: (value: string) => void;
  formatJson: (value: string) => string;
};

export default function SettingsSection({
  showPreview,
  selectedSettingKey,
  siteSettings,
  chooseSetting,
  saveSetting,
  settingJson,
  setSettingJson,
  formatJson,
}: SettingsSectionProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <div className={styles.panelTitle}>Site settings</div>
          <div className={styles.panelText}>
            Ưu tiên các key thường tác động trực tiếp đến trang chủ. Chọn key,
            sửa JSON, lưu và preview ngay.
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
                    siteSettings.find((x) => x.key === selectedSettingKey)
                      ?.jsonValue || "{}",
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
  );
}
