"use client";

import { FormEvent } from "react";
import styles from "../AdminConsole.module.css";

type AccountSectionProps = {
  handleChangePassword: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  changePasswordMessage: string;
  changePasswordError: string;
  oldPassword: string;
  setOldPassword: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  changePasswordLoading: boolean;
};

export default function AccountSection({
  handleChangePassword,
  changePasswordMessage,
  changePasswordError,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  changePasswordLoading,
}: AccountSectionProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <div className={styles.panelTitle}>Quản lý tài khoản</div>
          <div className={styles.panelText}>
            Cập nhật thông tin cá nhân và bảo mật tài khoản của bạn.
          </div>
        </div>
      </div>
      <form onSubmit={handleChangePassword} className={styles.formGrid}>
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
  );
}
