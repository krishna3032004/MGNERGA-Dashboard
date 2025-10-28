// app/dashboard/page.js  (server component)
import React, { Suspense } from "react";
import DashboardClient from "./DashboardClient";
// import dynamic from "next/dynamic";

// lazily import client component to keep server bundle clean
// const DashboardClient = dynamic(() => import("./DashboardClient"), { ssr: false });

export default function Page() {
  return (
    <main>
      <Suspense fallback={<div className="p-6 text-center">Loading dashboard…</div>}>
        <DashboardClient />
      </Suspense>
    </main>
  );
}
