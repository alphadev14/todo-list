import React, { createContext, useContext, useState } from "react";
import { Spin } from "antd";

const LoadingContext = createContext({
  showLoading: () => {},
  hideLoading: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(255, 255, 255, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <Spin size="large" tip="Đang xử lý..." />
        </div>
      )}
    </LoadingContext.Provider>
  );
};
