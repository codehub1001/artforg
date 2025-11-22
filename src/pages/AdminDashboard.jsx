import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Users,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  XCircle,
  RefreshCw,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [active, setActive] = useState("users");

  const [users, setUsers] = useState([]);
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [notice, setNotice] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, action: null, item: null });

  const counts = useMemo(
    () => ({
      users: users.length,
      pendingDeposits: pendingDeposits.length,
      pendingWithdrawals: pendingWithdrawals.length,
      transactions: transactions.length,
      wallets: wallets.length,
    }),
    [users, pendingDeposits, pendingWithdrawals, transactions, wallets]
  );

  const BASE_URL = "https://artforapi.onrender.com";

  const API = {
    users: `${BASE_URL}/api/admin/users`,
    pendingDeposits: `${BASE_URL}/api/admin/deposits/pending`,
    pendingWithdrawals: `${BASE_URL}/api/admin/withdrawals/pending`,
    transactions: `${BASE_URL}/api/admin/transactions`,
    wallets: `${BASE_URL}/api/admin/wallets`,
    approve: (type, id) =>
      type === "deposit"
        ? `${BASE_URL}/api/admin/deposit/approve/${id}`
        : `${BASE_URL}/api/admin/withdraw/approve/${id}`,
    reject: (type, id) =>
      type === "deposit"
        ? `${BASE_URL}/api/admin/deposit/reject/${id}`
        : `${BASE_URL}/api/admin/withdraw/reject/${id}`,
    updateWallet: (id) => `${BASE_URL}/api/admin/wallet/update/${id}`,
  };

  const navigate = useNavigate();

  // ------------------- AUTH CHECK -------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "ADMIN") {
      navigate("/signin");
    }
  }, [navigate]);

  // ------------------- AUTH FETCH -------------------
  async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized! Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      window.location.href = "/signin";
      return;
    }

    return res;
  }

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, depositsRes, withdrawalsRes, txRes, walletsRes] = await Promise.all([
        fetchWithAuth(API.users),
        fetchWithAuth(API.pendingDeposits),
        fetchWithAuth(API.pendingWithdrawals),
        fetchWithAuth(API.transactions + "?limit=200"),
        fetchWithAuth(API.wallets),
      ]);

      async function parseJSON(res, name) {
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch {
          throw new Error(`${name} did not return JSON (got HTML or invalid): ${text.substring(0, 200)}`);
        }
      }

      const [usersJson, depositsJson, withdrawalsJson, txJson, walletsJson] = await Promise.all([
        parseJSON(usersRes, "Users"),
        parseJSON(depositsRes, "Pending Deposits"),
        parseJSON(withdrawalsRes, "Pending Withdrawals"),
        parseJSON(txRes, "Transactions"),
        parseJSON(walletsRes, "Wallets"),
      ]);

      setUsers(Array.isArray(usersJson) ? usersJson : usersJson.data || []);
      setPendingDeposits(Array.isArray(depositsJson) ? depositsJson : depositsJson.data || []);
      setPendingWithdrawals(Array.isArray(withdrawalsJson) ? withdrawalsJson : withdrawalsJson.data || []);
      setTransactions(Array.isArray(txJson) ? txJson : txJson.data || []);
      setWallets(Array.isArray(walletsJson) ? walletsJson : walletsJson.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch data");
      setNotice({ type: "error", text: err.message || "Failed to fetch" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => setPage(1), [active, debouncedSearch]);

  function paginate(items) {
    const filtered = debouncedSearch
      ? items.filter((i) => JSON.stringify(i).toLowerCase().includes(debouncedSearch.toLowerCase()))
      : items;
    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const curPage = Math.min(page, pages);
    const start = (curPage - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);
    return { total, pages, curPage, pageItems };
  }

  async function handleAction(action, item) {
    setConfirm({ open: false, action: null, item: null });
    const id = item.id;
    const prevDeposits = [...pendingDeposits];
    const prevWithdrawals = [...pendingWithdrawals];
    const prevTransactions = [...transactions];

    try {
      setPendingDeposits((d) => d.filter((x) => x.id !== id));
      setPendingWithdrawals((w) => w.filter((x) => x.id !== id));

      const url =
        action === "approve" || action === "reject"
          ? API[action === "approve" ? "approve" : "reject"](item.type, id)
          : "";

      const method = "PUT";
      const res = await fetchWithAuth(url, { method, body: JSON.stringify({ note: "processed by admin" }) });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Server error: ${res.status} ${txt}`);
      }

      const updated = await res.json();
      if (action === "approve") setTransactions((t) => [updated, ...t]);

      setNotice({ type: "success", text: `${action}d successfully` });
    } catch (err) {
      setPendingDeposits(prevDeposits);
      setPendingWithdrawals(prevWithdrawals);
      setTransactions(prevTransactions);
      console.error(err);
      setNotice({ type: "error", text: `Failed to ${action}: ${err.message}` });
    }
  }

  const ApproveButton = ({ onClick, small }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1 rounded-lg ${small ? "text-sm" : "text-base"} bg-emerald-600 hover:bg-emerald-500`}
    >
      <Check size={14} /> Approve
    </button>
  );

  const RejectButton = ({ onClick, small }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1 rounded-lg ${small ? "text-sm" : "text-base"} bg-red-600 hover:bg-red-500`}
    >
      <XCircle size={14} /> Reject
    </button>
  );

  function Header() {
    return (
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen((s) => !s)} className="md:hidden p-2 bg-gray-800 rounded-md">
              <Menu size={20} />
            </button>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <span className="text-sm text-gray-400">Overview & approvals</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-gray-800 px-3 py-2 rounded-lg w-64 placeholder:text-gray-400"
              />
              <div className="absolute right-3 top-2.5">
                <Search size={16} />
              </div>
            </div>
            <button onClick={() => loadAll()} className="px-3 py-2 rounded-lg bg-gray-800">
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card title="Users" value={counts.users} icon={<Users size={20} />} />
          <Card title="Pending Deposits" value={counts.pendingDeposits} icon={<ArrowDownRight size={20} />} />
          <Card title="Pending Withdrawals" value={counts.pendingWithdrawals} icon={<ArrowUpRight size={20} />} />
          <Card title="Transactions" value={counts.transactions} icon={<Wallet size={20} />} />
          <Card title="Wallets" value={counts.wallets} icon={<Wallet size={20} />} />
        </div>
      </header>
    );
  }

  function Card({ title, value, icon }) {
    return (
      <div className="bg-gray-900 p-4 rounded-2xl shadow flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <div className="p-3 bg-gray-800 rounded-lg">{icon}</div>
      </div>
    );
  }

  function TableWrapper({ title, children, items, onPrev, onNext, pageInfo }) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-gray-900 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-400">{pageInfo.total} results</p>
            <div className="flex items-center gap-1">
              <button
                onClick={onPrev}
                disabled={pageInfo.curPage <= 1}
                className="px-2 py-1 rounded bg-gray-800 disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 py-1">
                {pageInfo.curPage} / {pageInfo.pages}
              </span>
              <button
                onClick={onNext}
                disabled={pageInfo.curPage >= pageInfo.pages}
                className="px-2 py-1 rounded bg-gray-800 disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {children}
      </motion.div>
    );
  }

  // ---------- USERS VIEW ----------
  function UsersView() {
    const { total, pages, curPage, pageItems } = paginate(users);
    return (
      <TableWrapper
        title="All Users"
        items={pageItems}
        pageInfo={{ total, pages, curPage }}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(pages, p + 1))}
      >
        <div className="overflow-hidden rounded-lg border border-gray-800">
          <table className="w-full text-left">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((u) => (
                <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-850">
                  <td className="p-3">{u.firstName} {u.lastName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <span className="text-sm text-blue-300">{u.role}</span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button className="px-3 py-1 rounded-lg bg-gray-800">View</button>
                    <button className="px-3 py-1 rounded-lg bg-red-700">Disable</button>
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </TableWrapper>
    );
  }

  // ---------- PENDING DEPOSITS VIEW ----------
  function PendingDepositsView() {
    const { total, pages, curPage, pageItems } = paginate(pendingDeposits);
    return (
      <TableWrapper
        title="Pending Deposits"
        pageInfo={{ total, pages, curPage }}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(pages, p + 1))}
      >
        <div className="flex flex-col gap-3">
          {pageItems.map((d) => (
            <div key={d.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
              <div>
                <div className="font-semibold">
                  {d.wallet?.user ? `${d.wallet.user.firstName} ${d.wallet.user.lastName}` : d.user || d.username || "Unknown User"}
                </div>
                <div className="text-sm text-gray-400">Amount: ${d.amount}</div>
                <div className="text-sm text-gray-500">Ref: {d.reference || d.id}</div>
              </div>
              <div className="flex gap-2">
                <ApproveButton onClick={() => setConfirm({ open: true, action: "approve", item: { ...d, type: "deposit" } })} />
                <RejectButton onClick={() => setConfirm({ open: true, action: "reject", item: { ...d, type: "deposit" } })} />
              </div>
            </div>
          ))}
          {pageItems.length === 0 && <div className="p-6 text-center text-gray-400">No pending deposits.</div>}
        </div>
      </TableWrapper>
    );
  }

  // ---------- PENDING WITHDRAWALS VIEW ----------
  function PendingWithdrawalsView() {
    const { total, pages, curPage, pageItems } = paginate(pendingWithdrawals);
    return (
      <TableWrapper
        title="Pending Withdrawals"
        pageInfo={{ total, pages, curPage }}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(pages, p + 1))}
      >
        <div className="flex flex-col gap-3">
          {pageItems.map((w) => (
            <div key={w.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
              <div>
                <div className="font-semibold">
                  {w.wallet?.user ? `${w.wallet.user.firstName} ${w.wallet.user.lastName}` : w.user || w.username || "Unknown User"}
                </div>
                <div className="text-sm text-gray-400">Amount: ${w.amount}</div>
                <div className="text-sm text-gray-500">Wallet: {w.wallet || w.walletAddress}</div>
              </div>
              <div className="flex gap-2">
                <ApproveButton onClick={() => setConfirm({ open: true, action: "approve", item: { ...w, type: "withdrawal" } })} />
                <RejectButton onClick={() => setConfirm({ open: true, action: "reject", item: { ...w, type: "withdrawal" } })} />
              </div>
            </div>
          ))}
          {pageItems.length === 0 && <div className="p-6 text-center text-gray-400">No pending withdrawals.</div>}
        </div>
      </TableWrapper>
    );
  }

  // ---------- TRANSACTIONS VIEW ----------
  function TransactionsView() {
    const { total, pages, curPage, pageItems } = paginate(transactions);
    return (
      <TableWrapper
        title="All Transactions"
        pageInfo={{ total, pages, curPage }}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(pages, p + 1))}
      >
        <div className="overflow-hidden rounded-lg border border-gray-800">
          <table className="w-full text-left">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((t) => (
                <tr key={t.id} className="border-b border-gray-800 hover:bg-gray-850">
                  <td className="p-3">{t.wallet?.user ? `${t.wallet.user.firstName} ${t.wallet.user.lastName}` : t.user || "Unknown"}</td>
                  <td className="p-3">{t.type}</td>
                  <td className="p-3">${t.amount}</td>
                  <td className="p-3">{t.status}</td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </TableWrapper>
    );
  }

  
// --------------- WALLETS VIEW ---------------
function WalletsView() {
  const [wallets, setWallets] = useState([]);

  // Fetch wallets
  useEffect(() => {
    async function loadWallets() {
      try {
        const res = await fetchWithAuth(`${BASE_URL}/api/admin/wallets`);
        if (!res.ok) throw new Error("Failed to fetch wallets");
        const data = await res.json();
        setWallets(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error(err);
        setNotice({ type: "error", text: err.message });
      }
    }
    loadWallets();
  }, []);

  async function updateWallet(walletId, action, amount) {
    if (isNaN(amount) || amount <= 0) return setNotice({ type: "error", text: "Enter a valid amount" });

    try {
      const res = await fetchWithAuth(`${BASE_URL}/api/admin/wallets/${walletId}`, {
        method: "PUT",
        body: JSON.stringify({ amount, action }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setWallets((prev) => prev.map((w) => (w.id === walletId ? updated : w)));
      setNotice({ type: "success", text: `Wallet ${action === "topup" ? "credited" : "reduced"} successfully` });
    } catch (err) {
      console.error(err);
      setNotice({ type: "error", text: err.message });
    }
  }

  const { total, pages, curPage, pageItems } = paginate(wallets);

  return (
    <TableWrapper
      title="Wallets"
      pageInfo={{ total, pages, curPage }}
      onPrev={() => setPage((p) => Math.max(1, p - 1))}
      onNext={() => setPage((p) => Math.min(pages, p + 1))}
    >
      <div className="overflow-hidden rounded-lg border border-gray-800">
        <table className="w-full text-left">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Balance</th>
              <th className="p-3">Update Wallet</th>
              <th className="p-3">Wallet Address</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((w) => (
              <tr key={w.id} className="border-b border-gray-800 hover:bg-gray-850">
                <td className="p-3">{w.user ? `${w.user.firstName} ${w.user.lastName}` : "Unknown"}</td>
                <td className="p-3">${w.balance}</td>
                <td className="p-3 flex gap-2">
                  <input
                    type="number"
                    placeholder="Amount"
                    className="bg-gray-900 p-1 rounded w-24"
                    id={`wallet-input-${w.id}`}
                  />
                  <button
                    className="px-3 py-1 rounded-lg bg-emerald-600"
                    onClick={() =>
                      updateWallet(w.id, "topup", parseFloat(document.getElementById(`wallet-input-${w.id}`).value))
                    }
                  >
                    Top Up
                  </button>
                  <button
                    className="px-3 py-1 rounded-lg bg-red-600"
                    onClick={() =>
                      updateWallet(w.id, "reduce", parseFloat(document.getElementById(`wallet-input-${w.id}`).value))
                    }
                  >
                    Reduce
                  </button>
                </td>
                <td className="p-3">{w.address}</td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">
                  No wallets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </TableWrapper>
  );
}





  // ---------- MAIN RETURN ----------
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {sidebarOpen && (
        <aside className="w-64 bg-gray-900 p-6 flex flex-col gap-6">
          <div className="text-xl font-bold mb-6">Admin Panel</div>
          <button className={`flex items-center gap-2 ${active === "users" ? "text-emerald-400" : ""}`} onClick={() => setActive("users")}>
            <Users size={18} /> Users
          </button>
          <button className={`flex items-center gap-2 ${active === "pendingDeposits" ? "text-emerald-400" : ""}`} onClick={() => setActive("pendingDeposits")}>
            <ArrowDownRight size={18} /> Pending Deposits
          </button>
          <button className={`flex items-center gap-2 ${active === "pendingWithdrawals" ? "text-emerald-400" : ""}`} onClick={() => setActive("pendingWithdrawals")}>
            <ArrowUpRight size={18} /> Pending Withdrawals
          </button>
          <button className={`flex items-center gap-2 ${active === "transactions" ? "text-emerald-400" : ""}`} onClick={() => setActive("transactions")}>
            <Wallet size={18} /> Transactions
          </button>
          <button className={`flex items-center gap-2 ${active === "wallets" ? "text-emerald-400" : ""}`} onClick={() => setActive("wallets")}>
            <Wallet size={18} /> Wallets
          </button>
        </aside>
      )}

      <main className="flex-1 p-6 overflow-auto">
        <Header />

        {loading ? (
          <div className="flex items-center justify-center mt-20">
            <Loader2 className="animate-spin mr-2" /> Loading...
          </div>
        ) : active === "users" ? (
          <UsersView />
        ) : active === "pendingDeposits" ? (
          <PendingDepositsView />
        ) : active === "pendingWithdrawals" ? (
          <PendingWithdrawalsView />
        ) : active === "transactions" ? (
          <TransactionsView />
        ) : active === "wallets" ? (
          <WalletsView />
        ) : null}

        {confirm.open && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-gray-900 p-6 rounded-xl">
              <p className="mb-4">Are you sure you want to {confirm.action} this?</p>
              <div className="flex gap-4 justify-end">
                <button className="px-4 py-2 bg-gray-700 rounded" onClick={() => setConfirm({ open: false, action: null, item: null })}>
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-emerald-600 rounded"
                  onClick={() => handleAction(confirm.action, confirm.item)}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {notice && (
          <div className={`fixed bottom-6 right-6 px-4 py-2 rounded-lg ${notice.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
            {notice.text}
            <button className="ml-4 font-bold" onClick={() => setNotice(null)}>
              X
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
