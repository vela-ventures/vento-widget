import { Input } from "./ui/input";

const TokenRow: React.FC<{
  label: string;
  token: string;
  logo?: React.ReactNode;
  amount?: string;
  usd?: string;
}> = ({ label, token, logo, amount = "0", usd = "$0.00" }) => {
  return (
    <div className="rounded-2xl border border-solid border-secondary px-5 py-4">
      <div className="text-base text-secondary-foreground mb-3 text-left">
        {label}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-muted/30 grid place-items-center">
            {logo || <div className="size-5 rounded-full bg-muted" />}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 h-9 text-sm">
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
          </div>
        </div>
        <Input
          className="text-3xl pr-0 tabular-nums font-semibold border-none text-right ring-0 focus-visible:ring-0"
          inputMode="numeric"
          value={amount}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-secondary-foreground">
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
