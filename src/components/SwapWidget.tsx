import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'

const TokenRow: React.FC<{ label: string; token: string; logo?: React.ReactNode; amount?: string; usd?: string; }> = ({ label, token, logo, amount = '0', usd = '$0.00' }) => {
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
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div className="text-3xl tabular-nums font-semibold">{amount}</div>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l3 3"/></svg>
          <span>14.55</span>
        </div>
        <span>≈ {usd}</span>
      </div>
    </div>
  )
}

export const SwapWidget: React.FC = () => {
  return (
    <Card className="w-[380px] bg-neutral-950/80 backdrop-blur-md border-white/10 shadow-black/40">
      <CardHeader className="pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-7 rounded-full border border-white/10 grid place-items-center">
              <div className="size-4 rounded-full border border-white/20" />
            </div>
            <CardTitle className="text-2xl text-white">Vento</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-lg h-8 w-8 text-white/80 border-white/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12a9 9 0 0115.54-5.54M21 12a9 9 0 01-15.54 5.54"/><path d="M3 3v6h6"/></svg>
            </Button>
            <Button variant="outline" size="icon" className="rounded-lg h-8 w-8 text-white/80 border-white/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 6v6"/><path d="M12 18h.01"/></svg>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <TokenRow label="Sell" token="AO" amount="0" usd="$0.00" />
        <div className="flex items-center justify-center gap-3 text-white/40">
          <Separator className="w-2/5 bg-white/10" />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-70"><path d="M7 7h10l-3-3M17 17H7l3 3"/></svg>
          <Separator className="w-2/5 bg-white/10" />
        </div>
        <TokenRow label="Buy" token="ARIO" amount="0" usd="$0.00" />

        <div className="mt-1 flex items-center justify-between text-[13px] text-white/60">
          <span>Average time to swap</span>
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l3 3"/></svg>
            <span>1 min 32 sec</span>
          </div>
        </div>

        <Button disabled className="w-full h-11 rounded-xl bg-white/10 text-white/70 hover:bg-white/10">
          Enter amounts
        </Button>
      </CardContent>
    </Card>
  )
}

export default SwapWidget


