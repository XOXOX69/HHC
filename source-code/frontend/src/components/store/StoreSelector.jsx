import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Tooltip, Badge, Modal, message } from "antd";
import { ShopOutlined, ExclamationCircleOutlined, GlobalOutlined } from "@ant-design/icons";
import { loadAllStore } from "../../redux/rtk/features/store/storeSlice";

const { Option, OptGroup } = Select;
const { confirm } = Modal;

const StoreSelector = () => {
  const dispatch = useDispatch();
  const { list: stores, loading } = useSelector((state) => state.store);
  const [selectedBranch, setSelectedBranch] = useState(null);
  
  const isLogged = localStorage.getItem("isLogged");

  // Get the main store (All Branches - overview) and other branch stores
  const mainStore = stores?.find(s => s.isMainStore === true || s.isMainStore === 1);
  const branchStores = stores?.filter(s => !s.isMainStore && s.isMainStore !== 1) || [];

  useEffect(() => {
    if (isLogged) {
      dispatch(loadAllStore());
      // Load previously selected branch from localStorage
      const savedBranchId = localStorage.getItem("selectedBranchId");
      const savedBranchName = localStorage.getItem("selectedBranchName");
      if (savedBranchId) {
        setSelectedBranch({ id: savedBranchId, name: savedBranchName });
      }
    }
  }, [dispatch, isLogged]);

  // Auto-select main store (All Branches) if no valid selection
  useEffect(() => {
    if (mainStore && !selectedBranch) {
      const savedBranchId = localStorage.getItem("selectedBranchId");
      if (!savedBranchId) {
        localStorage.setItem("selectedBranchId", mainStore.id.toString());
        localStorage.setItem("selectedBranchName", mainStore.name);
        localStorage.setItem("isMainStore", "true");
        setSelectedBranch({ id: mainStore.id, name: mainStore.name });
      }
    }
  }, [mainStore, selectedBranch]);

  const handleBranchChange = (value) => {
    const store = stores.find((s) => s.id === value);
    if (store) {
      const isMainStore = store.isMainStore === true || store.isMainStore === 1;
      confirm({
        title: `Switch to ${store.name}?`,
        icon: isMainStore ? <GlobalOutlined style={{ color: '#722ed1' }} /> : <ExclamationCircleOutlined />,
        content: (
          <div>
            {isMainStore ? (
              <>
                <p>You will switch to <strong>{store.name}</strong> (Overview Mode).</p>
                <p className="text-purple-500 mt-2">
                  <strong>Note:</strong> This view shows combined data from all branches and allows you to manage branches.
                </p>
              </>
            ) : (
              <>
                <p>You will be switched to the <strong>{store.name}</strong> branch database.</p>
                <p className="text-orange-500 mt-2">
                  <strong>Note:</strong> This branch has its own independent data (products, sales, customers, etc.)
                </p>
              </>
            )}
            <p className="mt-2">The page will reload to apply changes.</p>
          </div>
        ),
        onOk() {
          localStorage.setItem("selectedBranchId", store.id.toString());
          localStorage.setItem("selectedBranchName", store.name);
          localStorage.setItem("isMainStore", isMainStore ? "true" : "false");
          setSelectedBranch({ id: store.id, name: store.name });
          message.success(`Switching to ${store.name}...`);
          window.location.reload();
        },
      });
    }
  };

  // Only show selector for logged-in users
  if (!isLogged) {
    return null;
  }

  // Don't show selector if no stores available
  if (!mainStore && branchStores.length === 0) {
    return null;
  }

  // Get current branch display
  const currentBranchId = selectedBranch?.id || localStorage.getItem("selectedBranchId");
  const currentValue = currentBranchId ? parseInt(currentBranchId) : mainStore?.id;
  const currentStore = stores?.find(s => s.id === parseInt(currentBranchId));
  const isCurrentMainStore = currentStore?.isMainStore === true || currentStore?.isMainStore === 1;

  return (
    <Tooltip title={isCurrentMainStore ? "All Branches Overview - Can manage branches" : "Branch View - Independent data"}>
      <div className={`flex items-center gap-2 rounded px-2 py-1 ${isCurrentMainStore ? 'bg-purple-100' : 'bg-white/10'}`}>
        {isCurrentMainStore ? (
          <GlobalOutlined className="text-lg text-purple-600" />
        ) : (
          <ShopOutlined className="text-lg text-primary" />
        )}
        <Select
          placeholder="Select Branch"
          style={{ width: 200 }}
          value={currentValue}
          onChange={handleBranchChange}
          loading={loading}
          className="store-selector"
          dropdownStyle={{ minWidth: 280 }}
        >
          {/* All Branches (Main Store) - Overview */}
          {mainStore && (
            <OptGroup label="Overview">
              <Option key={mainStore.id} value={mainStore.id}>
                <div className="flex items-center gap-2">
                  <GlobalOutlined className="text-purple-600" />
                  <span className="font-medium text-purple-600">{mainStore.name}</span>
                  <span className="text-xs text-gray-400">(Overview)</span>
                </div>
              </Option>
            </OptGroup>
          )}
          
          {/* Individual Branch Stores */}
          {branchStores.length > 0 && (
            <OptGroup label="Individual Branches">
              {branchStores.map((store) => (
                <Option key={store.id} value={store.id}>
                  <div className="flex items-center gap-2">
                    <Badge status={store.status === "true" || store.status === true ? "processing" : "default"} />
                    <span>{store.name}</span>
                  </div>
                </Option>
              ))}
            </OptGroup>
          )}
        </Select>
        {isCurrentMainStore && (
          <Badge 
            count="Overview" 
            style={{ backgroundColor: '#722ed1', fontSize: '10px' }} 
          />
        )}
      </div>
    </Tooltip>
  );
};

export default StoreSelector;
