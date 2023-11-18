import Navbar from "../Navbar/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-neutral-100">
      <div className="w-1/6 border-r-2 bg-neutral-100 border-black p-4">
        {/* User name goes here */}
        <h1>User Name</h1>
      </div>
      <div className="flex bg-neutral-100 flex-col w-4/5">
        <Navbar />
        <div className="overflow-auto">
          {/* Main content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;