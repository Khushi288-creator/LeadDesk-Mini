import Sidebar from "./Sidebar";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, minHeight: "100vh", background: "#f4f7fb" }}>
        {children}
      </div>
    </div>
  );
}

export default Layout;