import { DashboardCharts } from "@/src/components/landing/dashboard-charts";

type DeviceVariant = "laptop" | "tablet" | "phone";

export function DeviceMockup({ device }: { device: DeviceVariant }) {
  const isLaptop = device === "laptop";
  const isTablet = device === "tablet";
  const isPhone = device === "phone";

  if (isLaptop) {
    return (
      <div aria-hidden="true">
        <div className="relative">
          <div className="w-[340px] h-[220px] rounded-t-[12px] border-[4px] border-[#1a1a1a] bg-white overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
            <div className="h-full bg-[#f8f9fc] p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF5555]" />
                  <span className="text-[7px] font-bold text-[#111] tracking-wide">
                    DASHBOARD
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#aaa]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#aaa]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#aaa]" />
                </div>
              </div>
              <div className="flex gap-1.5">
                <div className="flex-1 bg-white rounded-[4px] p-1.5 shadow-sm border border-[#eee]">
                  <div className="text-[5px] text-[#888]">Revenue</div>
                  <div className="text-[8px] font-extrabold text-[#111]">
                    $48,290
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-[4px] p-1.5 shadow-sm border border-[#eee]">
                  <div className="text-[5px] text-[#888]">Expenses</div>
                  <div className="text-[8px] font-extrabold text-[#FF5555]">
                    $32,640
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-[4px] p-1.5 shadow-sm border border-[#eee]">
                  <div className="text-[5px] text-[#888]">Profit</div>
                  <div className="text-[8px] font-extrabold text-emerald-500">
                    $15,650
                  </div>
                </div>
              </div>
              <div className="flex-1 bg-white rounded-[4px] p-1.5 shadow-sm border border-[#eee]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[5px] font-bold text-[#555]">
                    Monthly Overview
                  </span>
                  <span className="text-[5px] text-[#FF5555]">↗ +12.5%</span>
                </div>
                <DashboardCharts />
              </div>
            </div>
          </div>
          <div className="w-[370px] h-[12px] bg-[#1a1a1a] rounded-b-[8px] mx-auto relative">
            <div className="absolute inset-x-[40%] top-0 h-[3px] bg-[#333] rounded-b" />
          </div>
        </div>
      </div>
    );
  }

  if (isTablet) {
    return (
      <div aria-hidden="true">
        <div className="w-[300px] h-[300px] rounded-[16px] border-[4px] border-[#1a1a1a] bg-white overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.15)] relative">
          {/* Front camera */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#1a1a1a] z-10" />

          <div className="h-full bg-[#f8f9fc] p-3 flex flex-col gap-2 pt-5">
            {/* Header */}
            <div className="flex items-center justify-between px-0.5">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF5555]" />
                <span className="text-[6px] font-bold text-[#111] tracking-wide">
                  FINANCIALS
                </span>
              </div>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-[#aaa]" />
                <div className="w-1 h-1 rounded-full bg-[#aaa]" />
                <div className="w-1 h-1 rounded-full bg-[#aaa]" />
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-1.5">
              <div className="flex-1 bg-white rounded-[4px] p-1.5 shadow-sm border border-[#eee]">
                <div className="text-[4.5px] text-[#888]">Income</div>
                <div className="text-[7px] font-extrabold text-emerald-500">
                  $24.5k
                </div>
                <div className="text-[4px] text-[#888]">↑ 12.3%</div>
              </div>
              <div className="flex-1 bg-white rounded-[4px] p-1.5 shadow-sm border border-[#eee]">
                <div className="text-[4.5px] text-[#888]">Spent</div>
                <div className="text-[7px] font-extrabold text-[#FF5555]">
                  $18.2k
                </div>
                <div className="text-[4px] text-[#888]">↑ 8.7%</div>
              </div>
              <div className="flex-1 bg-white rounded-[4px] p-1.5 shadow-sm border border-[#eee]">
                <div className="text-[4.5px] text-[#888]">Balance</div>
                <div className="text-[7px] font-extrabold text-[#111]">
                  $6.3k
                </div>
                <div className="text-[4px] text-[#888]">Available</div>
              </div>
            </div>

            {/* Chart */}
            <div className="flex-1 bg-white rounded-[4px] p-2 shadow-sm border border-[#eee]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[5px] font-bold text-[#555]">
                  Cash Flow Overview
                </span>
                <span className="text-[4.5px] text-emerald-500">+8.3%</span>
              </div>
              <DashboardCharts compact />
            </div>

            {/* Bottom indicators */}
            <div className="flex justify-between px-1 mt-0.5">
              <div className="text-[4px] text-[#888]">Jan</div>
              <div className="text-[4px] text-[#888]">Feb</div>
              <div className="text-[4px] text-[#888]">Mar</div>
              <div className="text-[4px] text-[#888]">Apr</div>
              <div className="text-[4px] text-[#888]">May</div>
              <div className="text-[4px] text-[#888]">Jun</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isPhone) {
    return (
      <div aria-hidden="true">
        <div className="w-[180px] h-[280px] rounded-[20px] border-[3px] border-[#1a1a1a] bg-white overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.15)] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#1a1a1a] rounded-b-[8px] z-10" />
          <div className="h-full bg-[#f8f9fc] p-2 flex flex-col gap-1 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-[5px] font-bold text-[#111]">Mobile</span>
              <span className="text-[4px] text-[#888]">Live</span>
            </div>
            <div className="bg-white rounded-[3px] p-1 border border-[#eee]">
              <div className="text-[4px] text-[#888]">Balance</div>
              <div className="text-[8px] font-extrabold text-[#111]">
                $5,240
              </div>
            </div>
            <div className="flex-1 bg-white rounded-[3px] p-1 border border-[#eee]">
              <DashboardCharts compact />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
