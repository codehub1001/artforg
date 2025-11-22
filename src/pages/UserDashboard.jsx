import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiCreditCard,
  FiLayers,
  FiLogOut,
  FiMenu,
  FiX,
  FiPlusCircle,
  FiShoppingCart,
  FiDollarSign,
  FiSettings,
  FiActivity,
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function UserDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [ethRate, setEthRate] = useState(3500); // default fallback
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Deposit modal states
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositStep, setDepositStep] = useState(1);
  const [depositUSD, setDepositUSD] = useState("");
  const [depositETH, setDepositETH] = useState(0);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const usdToEth = (amount) => amount / ethRate;

  // Fetch live ETH price
  const fetchEthPrice = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await res.json();
      if (data.ethereum?.usd) setEthRate(data.ethereum.usd);
    } catch (err) {
      console.log("Failed to fetch live ETH price");
    }
  };

  const fetchData = async () => {
    if (!token || !userId) return;

    try {
      setLoading(true);

      const profileRes = await fetch(
        `https://artforapi.onrender.com/api/users/${userId}/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const profileData = await profileRes.json();
      if (profileRes.ok) setProfile(profileData.user);
      else toast.error(profileData.error || "Failed to fetch profile");

      const walletRes = await fetch("https://artforapi.onrender.com/api/wallet", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const walletData = await walletRes.json();
      if (walletRes.ok) setWallet(walletData);
      else toast.error(walletData.error || "Failed to fetch wallet");

      setNfts([
        { id: 1, name: "CryptoArt #1", image: "/nfts/nft1.png" },
        { id: 2, name: "CryptoArt #2", image: "/nfts/nft2.png" },
        { id: 3, name: "CryptoArt #3", image: "/nfts/nft3.png" },
      ]);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Network error");
    }
  };

  useEffect(() => {
    fetchEthPrice();
    fetchData();
  }, []);

  // Deposit modal functions
  const handleDeposit = () => {
    setDepositUSD("");
    setDepositETH(0);
    setDepositStep(1);
    setDepositModalOpen(true);
  };

  const handleDepositNext = () => {
    const usdAmount = parseFloat(depositUSD);
    if (!usdAmount || usdAmount <= 0) return toast.error("Enter a valid USD amount");
    setDepositETH(usdToEth(usdAmount));
    setDepositStep(2);
  };

 const handleDepositConfirm = async () => {
  try {
    setTransactionLoading(true);

    const res = await fetch("https://artforapi.onrender.com/api/wallet/deposit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: parseFloat(depositUSD) }),
    });

    const data = await res.json();
    setTransactionLoading(false);

    if (!res.ok) return toast.error(data.error || "Deposit failed");

    toast.success("Deposit request submitted. Awaiting admin approval.");

    setDepositModalOpen(false);

    // Reload real wallet info
    fetchData();

  } catch {
    setTransactionLoading(false);
    toast.error("Network error");
  }
};


  const handleCopyWallet = () => {
    navigator.clipboard.writeText("0xYourETHWalletAddressHere");
    toast.success("Wallet address copied!");
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(prompt("Enter withdrawal amount:"));
    if (!amount || amount <= 0) return toast.error("Invalid amount");

    try {
      setTransactionLoading(true);

      const res = await fetch("https://artforapi.onrender.com/api/wallet/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      setTransactionLoading(false);

      if (!res.ok) return toast.error(data.error || "Withdrawal failed");

      setWallet(data);
      toast.success("Withdrawal successful!");
    } catch {
      setTransactionLoading(false);
      toast.error("Network error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    toast.success("Logged out");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-xl">
        Loading dashboard...
      </div>
    );
  }

  const SidebarButton = ({ icon, label, section }) => (
    <button
      className={`flex items-center w-full p-3 rounded-lg hover:bg-blue-100 ${
        activeSection === section ? "bg-blue-200" : ""
      }`}
      onClick={() => {
        setActiveSection(section);
        setSidebarOpen(false);
      }}
    >
      <span className="mr-3 text-gray-700">{icon}</span>
      {label}
    </button>
  );

  const Placeholder = ({ title }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      <p className="text-gray-500 mt-2">This section is under construction.</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded shadow"
        >
          {sidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white border-r p-6 flex flex-col shadow-sm space-y-6 fixed md:relative z-40 h-full transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <FiUser className="text-gray-600 text-xl" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {profile?.firstName} {profile?.lastName}
            </h3>
            <p className="text-green-600 text-sm">Verified ✓</p>
          </div>
        </div>

        <nav className="space-y-3 flex-1 overflow-auto">
          <SidebarButton icon={<FiLayers />} label="Overview" section="overview" />
          <SidebarButton icon={<FiCreditCard />} label="Wallet" section="wallet" />
          <SidebarButton icon={<FiPlusCircle />} label="Create NFT" section="createNFT" />
          <SidebarButton icon={<FiShoppingCart />} label="Buy NFT" section="buyNFT" />
          <SidebarButton icon={<FiLayers />} label="My Collections" section="myCollections" />
          <SidebarButton icon={<FiLayers />} label="All Bids" section="allBids" />
          <SidebarButton icon={<FiDollarSign />} label="Withdrawal" section="withdrawal" />
          <SidebarButton icon={<FiSettings />} label="Account" section="account" />
          <SidebarButton icon={<FiActivity />} label="Activity Log" section="activityLog" />
        </nav>

        <button
          onClick={handleLogout}
          className="mt-4 flex items-center p-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
        >
          <FiLogOut className="mr-3" /> Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {/* Keep original sections */}
        {activeSection === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Balance</h2>
              <p className="text-4xl font-bold text-gray-900">${wallet?.balance.toFixed(2)}</p>
              <p className="text-lg text-gray-600 mt-1">
                ≈ {usdToEth(wallet.balance).toFixed(6)} ETH
              </p>
              <div className="mt-4 flex gap-4 flex-wrap">
                <button
                  onClick={handleDeposit}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                >
                  Deposit
                </button>
                <button
                  onClick={handleWithdraw}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
                >
                  Withdraw
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-semibold text-gray-800 mb-3">Crypto</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img src="/eth.png" className="w-10" />
                      <p className="font-semibold">ETH</p>
                    </div>
                    <span className="text-gray-700">{usdToEth(wallet.balance).toFixed(6)} ETH</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-semibold text-gray-800 mb-2">Recent Transactions</h3>
                {wallet?.transactions?.length ? (
                  <ul className="space-y-2 max-h-64 overflow-auto">
                    {wallet.transactions.map((tx) => (
                      <li key={tx.id} className="p-3 bg-gray-50 rounded-lg flex justify-between text-sm">
                        <span>{tx.type}</span>
                        <span>${tx.amount.toFixed(2)}</span>
                        <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No recent transactions.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === "wallet" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Wallet</h2>
            <p className="text-lg"><strong>Balance:</strong> ${wallet.balance.toFixed(2)}</p>
            <p className="text-lg text-gray-600 mt-1">≈ {usdToEth(wallet.balance).toFixed(6)} ETH</p>
            <div className="mt-4 flex gap-4 flex-wrap">
              <button
                onClick={handleDeposit}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              >
                {transactionLoading ? "Processing..." : "Deposit"}
              </button>
              <button
                onClick={handleWithdraw}
                className="px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
              >
                {transactionLoading ? "Processing..." : "Withdraw"}
              </button>
            </div>
          </motion.div>
        )}

        {activeSection === "nfts" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">My NFT Collection</h2>
            {nfts.length === 0 ? (
              <p className="text-gray-500">No NFTs owned yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {nfts.map((nft) => (
                  <div key={nft.id} className="bg-gray-50 p-4 rounded-xl shadow-md hover:shadow-lg transition">
                    <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover rounded-md mb-3"/>
                    <h3 className="text-lg font-semibold">{nft.name}</h3>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Placeholder sections */}
        {activeSection === "createNFT" && <Placeholder title="Create NFT" />}
        {activeSection === "buyNFT" && <Placeholder title="Buy NFT" />}
        {activeSection === "myCollections" && <Placeholder title="My Collections" />}
        {activeSection === "allBids" && <Placeholder title="All Bids" />}
        {activeSection === "withdrawal" && <Placeholder title="Withdrawal" />}
        {activeSection === "account" && <Placeholder title="Account Settings" />}
        {activeSection === "activityLog" && <Placeholder title="Activity Log" />}

        {/* Deposit Modal */}
        {depositModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl shadow-lg w-full max-w-md p-6"
            >
              {/* Step 1 */}
              {depositStep === 1 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">Deposit USD</h2>
                  <input
                    type="number"
                    value={depositUSD}
                    onChange={(e) => {
                      setDepositUSD(e.target.value);
                      setDepositETH(usdToEth(parseFloat(e.target.value) || 0));
                    }}
                    className="w-full p-3 border rounded mb-4 focus:outline-blue-500"
                    placeholder="Enter USD amount"
                  />
                  <p className="mb-4 text-gray-600">
                    You will send ≈ <strong>{depositETH.toFixed(6)} ETH</strong>
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setDepositModalOpen(false)}
                      className="px-4 py-2 rounded bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDepositNext}
                      className="px-4 py-2 rounded bg-blue-600 text-white"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {/* Step 2 */}
              {depositStep === 2 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">Send ETH</h2>
                  <p className="mb-4 text-gray-600">
                    Send <strong>{depositETH.toFixed(6)} ETH</strong> to the wallet below:
                  </p>
                  <div
                    className="p-3 bg-gray-100 rounded mb-4 break-all cursor-pointer hover:bg-gray-200"
                    onClick={handleCopyWallet}
                  >
                    0xYourETHWalletAddressHere (click to copy)
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setDepositStep(1)}
                      className="px-4 py-2 rounded bg-gray-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleDepositConfirm}
                      className="px-4 py-2 rounded bg-green-600 text-white"
                    >
                      {transactionLoading ? "Processing..." : "Confirm Deposit"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
