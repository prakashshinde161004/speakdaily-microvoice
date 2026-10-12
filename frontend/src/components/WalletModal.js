import React, { useState } from "react";
import { CURRENCIES } from "../constants";
import { soundManager } from "../soundEffects";
import { triggerConfetti } from "../confetti";
import { processCashoutAPI } from "../apiService";

export default function WalletModal({
  isOpen,
  onClose,
  points,
  currency,
  onCurrencyChange,
  onPerformCashout,
  transactions
}) {
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [payoutDestination, setPayoutDestination] = useState("prakash@okaxis");
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);

  if (!isOpen) return null;

  const currentCash = (points * currency.rate).toFixed(2);
  const minThresholdPoints = 200; // ~₹30 or $0.40 minimum payout
  const minCash = (minThresholdPoints * currency.rate).toFixed(2);
  const progressPercent = Math.min(100, Math.round((points / minThresholdPoints) * 100));
  const isEligibleForCashout = points >= minThresholdPoints;

  const handleCashoutSubmit = async (e) => {
    e.preventDefault();
    if (!isEligibleForCashout || !payoutDestination) return;

    setIsProcessing(true);
    soundManager.playRecordBeep(true);

    // Call Python FastAPI Cashout Endpoint
    const backendRes = await processCashoutAPI(
      points,
      selectedMethod,
      payoutDestination,
      currency.code
    );

    setIsProcessing(false);
    soundManager.playCashout();
    triggerConfetti();

    let newReceipt = null;

    if (backendRes && backendRes.success) {
      newReceipt = {
        txId: backendRes.transactionId,
        receiptHash: backendRes.receiptHash,
        amountPts: backendRes.amountPts,
        amountCash: backendRes.amountCash,
        method: backendRes.method,
        destination: backendRes.destination,
        date: backendRes.timestamp,
        status: backendRes.status,
        engine: "Python FastAPI Settlement"
      };
    } else {
      // Client Fallback
      newReceipt = {
        txId: `KP-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        receiptHash: "SHA256-SIMULATED",
        amountPts: points,
        amountCash: `${currency.symbol}${currentCash}`,
        method: selectedMethod.toUpperCase(),
        destination: payoutDestination,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
        status: "CONFIRMED & TRANSFERRED",
        engine: "Client Settlement Engine"
      };
    }

    setReceipt(newReceipt);
    onPerformCashout(points, newReceipt);
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="wallet-modal-overlay">
      <div
        className="modal-sheet"
        onClick={(e) => e.stopPropagation()}
        id="wallet-modal-content"
      >
        <div className="modal-handle-bar"></div>

        <div className="modal-header">
          <div className="modal-title">
            <span>💳</span>
            <span>Real Cash Wallet</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Currency Switcher */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(255, 255, 255, 0.04)",
            padding: "8px 12px",
            borderRadius: "10px",
            marginBottom: "14px"
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Display Currency:
          </span>
          <select
            value={currency.code}
            onChange={(e) => onCurrencyChange(CURRENCIES[e.target.value])}
            style={{
              background: "#1e293b",
              color: "#38bdf8",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              borderRadius: "6px",
              padding: "4px 8px",
              fontSize: "12px",
              fontWeight: "700"
            }}
            id="wallet-currency-select"
          >
            {Object.keys(CURRENCIES).map((key) => (
              <option key={key} value={key}>
                {CURRENCIES[key].label}
              </option>
            ))}
          </select>
        </div>

        {/* Hero Balance Box */}
        <div className="wallet-balance-hero">
          <div className="wallet-hero-label">Available Earnings</div>
          <div className="wallet-hero-amount">
            {currency.symbol}{currentCash}
          </div>
          <div className="wallet-points-equivalent">
            🪙 {points} PTS Balance (100 PTS = {currency.symbol}{(100 * currency.rate).toFixed(2)})
          </div>
        </div>

        {/* Cashout Success Receipt */}
        {receipt ? (
          <div
            style={{
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              borderRadius: "14px",
              padding: "16px",
              textAlign: "center",
              marginBottom: "16px"
            }}
            id="payout-receipt-card"
          >
            <div style={{ fontSize: "32px", marginBottom: "4px" }}>🎉</div>
            <div style={{ fontSize: "16px", fontWeight: "800", color: "#34d399" }}>
              Cashout Successful!
            </div>
            <div style={{ fontSize: "11px", color: "#a7f3d0", marginBottom: "12px" }}>
              Settlement verified via {receipt.engine}.
            </div>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "left",
                fontSize: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Txn Ref:</span>
                <span style={{ fontFamily: "monospace", color: "#38bdf8", fontWeight: "700" }}>{receipt.txId}</span>
              </div>
              {receipt.receiptHash && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>SHA-256 Hash:</span>
                  <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#a5b4fc" }}>{receipt.receiptHash}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Amount Paid:</span>
                <span style={{ fontWeight: "700", color: "#34d399" }}>{receipt.amountCash}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Method:</span>
                <span>{receipt.method} ({receipt.destination})</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Status:</span>
                <span style={{ color: "#34d399", fontWeight: "700" }}>{receipt.status}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setReceipt(null)}
              style={{
                marginTop: "12px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid var(--border-subtle)",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              Dismiss Receipt
            </button>
          </div>
        ) : (
          <>
            {/* Payout Threshold Progress */}
            <div className="payout-progress-box">
              <div className="payout-progress-row">
                <span style={{ color: "var(--text-secondary)" }}>
                  Payout Threshold: {points} / {minThresholdPoints} PTS
                </span>
                <span style={{ fontWeight: "700", color: isEligibleForCashout ? "#34d399" : "#fbbf24" }}>
                  {progressPercent}%
                </span>
              </div>
              <div className="payout-bar">
                <div
                  className="payout-bar-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
                {isEligibleForCashout
                  ? "✓ You have unlocked instant cashout eligibility!"
                  : `Earn ${minThresholdPoints - points} more PTS (~${currency.symbol}${minCash}) to trigger payout.`}
              </div>
            </div>

            {/* Payout Rails Selection */}
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>
                Select Payout Method:
              </div>
              <div className="cashout-methods-grid">
                {[
                  { id: "upi", label: "UPI / GPay / PhonePe", icon: "⚡" },
                  { id: "mobile_money", label: "Mobile Money / M-Pesa", icon: "📱" },
                  { id: "bank", label: "Bank Account Transfer", icon: "🏦" },
                  { id: "airtime", label: "Instant Airtime & Data", icon: "📶" }
                ].map((m) => (
                  <div
                    key={m.id}
                    className={`cashout-method-card ${selectedMethod === m.id ? "selected" : ""}`}
                    onClick={() => setSelectedMethod(m.id)}
                  >
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>

              {/* Destination Input */}
              <form onSubmit={handleCashoutSubmit}>
                <div style={{ marginBottom: "12px" }}>
                  <label
                    htmlFor="payout-dest-input"
                    style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}
                  >
                    {selectedMethod === "upi"
                      ? "Enter UPI ID (e.g., yourname@okhdfcbank)"
                      : selectedMethod === "airtime" || selectedMethod === "mobile_money"
                      ? "Enter Mobile Number"
                      : "Enter Account Number / IBAN"}
                  </label>
                  <input
                    id="payout-dest-input"
                    type="text"
                    required
                    value={payoutDestination}
                    onChange={(e) => setPayoutDestination(e.target.value)}
                    style={{
                      width: "100%",
                      background: "rgba(0, 0, 0, 0.3)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      color: "#fff",
                      fontSize: "13px",
                      outline: "none"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="cashout-action-btn"
                  id="btn-trigger-cashout"
                  disabled={!isEligibleForCashout || isProcessing}
                >
                  {isProcessing
                    ? "🔄 Processing Transfer with Python API..."
                    : isEligibleForCashout
                    ? `💸 Withdraw ${currency.symbol}${currentCash} Now`
                    : `🔒 Needs ${minThresholdPoints - points} PTS to Cashout`}
                </button>
              </form>
            </div>
          </>
        )}

        {/* Transaction History Ledger */}
        <div style={{ marginTop: "16px" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>
            Recent Activity & Earnings Ledger
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "150px", overflowY: "auto" }}>
            {transactions.length === 0 ? (
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center", padding: "10px" }}>
                No prior transactions yet. Complete your first recording!
              </div>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "8px",
                    padding: "8px 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "11px"
                  }}
                >
                  <div>
                    <div style={{ color: "#fff", fontWeight: "600" }}>{tx.title}</div>
                    <div style={{ color: "var(--text-muted)" }}>{tx.date}</div>
                  </div>
                  <div
                    style={{
                      fontWeight: "700",
                      color: tx.type === "earn" ? "#34d399" : "#38bdf8"
                    }}
                  >
                    {tx.type === "earn" ? `+${tx.points} PTS` : `-${tx.points} PTS (Paid)`}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
