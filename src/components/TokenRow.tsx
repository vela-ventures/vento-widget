const TokenRow: React.FC<{
  label: string;
  token: string;
  logo?: React.ReactNode;
  amount?: string;
  usd?: string;
}> = ({ label, token, logo, amount = "0", usd = "$0.00" }) => {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 px-5 py-4">
      <div className="text-sm text-muted-foreground mb-3">{label}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-muted/30 grid place-items-center">
            {logo || <div className="size-5 rounded-full bg-muted" />}
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-xl border border-input bg-background px-3 h-9 text-sm">
            <span className="font-medium">{token}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 7l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="text-3xl tabular-nums font-semibold">{amount}</div>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v6l3 3" />
          </svg>
          <span>14.55</span>
        </div>
        <span>≈ {usd}</span>
      </div>
    </div>
  );
};

export default TokenRow;
